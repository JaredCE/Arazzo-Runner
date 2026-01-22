"use strict";

const {
  extractAll,
  extractAndResolve,
  hasRuntimeExpressions,
} = require("./runtime");

const {
  parse,
  test,
  extract,
} = require("@swaggerexpert/arazzo-runtime-expression");
const { evaluate } = require("@swaggerexpert/json-pointer");
const { evaluate: jsonPathEvaluate } = require("@swaggerexpert/jsonpath");
const { DOMParser } = require("@xmldom/xmldom");
const xpath = require("xpath");

/**
 * Handles resolution of Arazzo runtime expressions to context values.
 *
 * Supports expressions like:
 * - Simple: $inputs.user, $statusCode
 * - Complex: $response.body#/data/id, $response.header.Content-Type
 * - Templated: "User {$inputs.username} logged in"
 */
class Expression {
  constructor() {
    this.context = {};

    this.simpleExpressions = [
      "$url",
      "$method",
      "$statusCode",
      "$inputs",
      "$outputs",
      "$steps",
      "$workflows",
      "$sourceDescriptions",
    ];

    this.expressionMap = {
      $url: "url",
      $method: "method",
      $statusCode: "statusCode",
      $request: "request",
      "$request.query": "request.query",
      "$request.header": "request.header",
      "$request.path": "request.path",
      "$request.body": "request.body",
      $response: "response",
      "$response.body": "response.body",
      "$response.header": "response.header",
      $inputs: "inputs",
      $outputs: "outputs",
      $steps: "steps",
      $workflows: "workflows",
      $sourceDescriptions: "sourceDescriptions",
    };
  }

  /**
   * Runs a check on a runtime expression from a simple Criterion Object
   * @public
   * @param {string} expression - The runtime expression to resolve
   */
  checkSimpleExpression(expression) {
    try {
      const normalisedExpression = this.normalisedExpression(expression);
      return this.safeEvaluate(normalisedExpression);
    } catch (e) {
      return false;
    }
  }

  /**
   * Runs a check on a runtime expression from a regex Criterion Object
   * @public
   * @param {string} expression - The runtime expression to resolve
   */
  checkRegexExpression(expression, pattern) {
    try {
      const value = this.resolveExpression(expression);
      const regex = new RegExp(pattern);
      return regex.test(String(value));
    } catch (e) {
      return false;
    }
  }

  /**
   * Runs a check on a runtime expression from a JSON Path Criterion Object
   * @public
   * @param {string} expression - The runtime expression to resolve
   */
  checkJSONPathExpression(expression, jsonPath) {
    try {
      const value = this.resolveExpression(expression);
      const result = jsonPathEvaluate(value, jsonPath);

      return Array.isArray(result) && result.length > 0;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /**
   * Runs a check on a runtime expression from a XPath Criterion Object
   * @public
   * @param {string} expression - The runtime expression to resolve
   */
  checkXPathExpression(expression, xPath) {
    try {
      const value = this.resolveExpression(expression);
      const doc = new DOMParser().parseFromString(value, "text/xml");
      const result = xpath.select(xPath, doc);

      // Empty nodeset = false, non-empty = true
      return Array.isArray(result) ? result.length > 0 : !!result;
    } catch (e) {
      return false;
    }
  }

  /**
   * Safely evaluates an expression by resolving runtime expressions first
   * @private
   * @param {string} expression - The normalized expression to evaluate
   * @returns {boolean} Result of evaluation
   */
  safeEvaluate(expression) {
    let resolvedExpression = expression;

    // Match runtime expressions, but stop at brackets for array access
    const runtimeExprRegex =
      /\$[a-zA-Z0-9._#/-]+(?=\[|\.name|\.|\s|==|!=|<|>|$)/g;
    const matches = expression.match(runtimeExprRegex);

    if (matches) {
      const uniqueMatches = [...new Set(matches)];

      for (const match of uniqueMatches) {
        try {
          let originalExpr = match;

          // Handle JSON pointer expressions
          if (match.includes("#")) {
            const [basePart, pointerPart] = match.split("#");
            const parts = basePart.split(".");

            if (parts.length > 0) {
              parts[0] = parts[0].replace(/_/g, ".");
            }

            for (let i = 1; i < parts.length; i++) {
              parts[i] = parts[i].replace(/_/g, "-");
            }

            originalExpr = parts.join(".") + "#" + pointerPart;
          } else {
            const parts = match.split(".");

            if (parts.length > 0) {
              parts[0] = parts[0].replace(/_/g, ".");
            }

            for (let i = 1; i < parts.length; i++) {
              parts[i] = parts[i].replace(/_/g, "-");
            }

            originalExpr = parts.join(".");
          }

          const value = this.resolveExpression(originalExpr);

          // Convert string representations to actual types
          let actualValue = value;
          if (typeof value === "string") {
            if (value === "true") actualValue = true;
            else if (value === "false") actualValue = false;
            else if (value === "null") actualValue = null;
            else if (!isNaN(value) && value.trim() !== "") {
              actualValue = Number(value);
            }
          }

          const escapedMatch = match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          resolvedExpression = resolvedExpression.replace(
            new RegExp(escapedMatch, "g"),
            JSON.stringify(actualValue),
          );
        } catch (err) {
          console.warn(`Could not resolve ${match}:`, err.message);
        }
      }
    }

    // Handle case-insensitive string comparisons with ==
    resolvedExpression = resolvedExpression.replace(
      /"([^"]*)"\s*==\s*'([^']*)'/g,
      (match, p1, p2) => `"${p1}".toLowerCase() == '${p2}'.toLowerCase()`,
    );
    resolvedExpression = resolvedExpression.replace(
      /"([^"]*)"\s*==\s*"([^"]*)"/g,
      (match, p1, p2) => `"${p1}".toLowerCase() == "${p2}".toLowerCase()`,
    );
    resolvedExpression = resolvedExpression.replace(
      /'([^']*)'\s*==\s*'([^']*)'/g,
      (match, p1, p2) => `'${p1}'.toLowerCase() == '${p2}'.toLowerCase()`,
    );
    resolvedExpression = resolvedExpression.replace(
      /'([^']*)'\s*==\s*"([^"]*)"/g,
      (match, p1, p2) => `'${p1}'.toLowerCase() == "${p2}".toLowerCase()`,
    );

    try {
      // eslint-disable-next-line no-eval
      return eval(resolvedExpression);
    } catch (err) {
      throw new Error(`Failed to evaluate expression: ${err.message}`);
    }
  }

  /**
   * Resolves a runtime expression to its value in the context
   * @public
   * @param {string|Object|Array} expression - The runtime expression to resolve
   * @returns {*} The resolved value
   * @throws {Error} If expression is invalid or context path doesn't exist
   */
  // resolveExpression(expression) {
  //   // Handle arrays recursively
  //   if (Array.isArray(expression)) {
  //     return expression.map((item) => this.resolveExpression(item));
  //   }

  //   // Handle objects recursively
  //   if (typeof expression === "object" && expression !== null) {
  //     const resolved = {};
  //     for (const [key, value] of Object.entries(expression)) {
  //       resolved[key] = this.resolveExpression(value);
  //     }
  //     return resolved;
  //   }

  //   // Handle strings (runtime expressions)
  //   if (typeof expression !== "string") {
  //     return expression;
  //   }

  //   this.expression = expression;

  //   if (this.isARunTimeExpression()) {
  //     return this.mapToContext();
  //   }

  //   const extractedExpression = extract(expression);

  //   if (extractedExpression !== expression && test(extractedExpression)) {
  //     this.expression = extractedExpression;
  //     return this.mapToContext();
  //   }

  //   return expression;
  // }

  /**
   * @private
   * @param {*} value
   * @returns {boolean}
   */
  isXML(value) {
    return (
      typeof value === "string" &&
      (value.trim().startsWith("<?xml") || value.trim().startsWith("<"))
    );
  }

  /**
   * Resolves a runtime expression to its value in the context
   * @public
   * @param {string|Object|Array} expression - The runtime expression to resolve
   * @returns {*} The resolved value
   * @throws {Error} If expression is invalid or context path doesn't exist
   */
  resolveExpression(expression) {
    // Handle arrays recursively
    if (Array.isArray(expression)) {
      return expression.map((item) => this.resolveExpression(item));
    }

    // Handle objects recursively
    if (typeof expression === "object" && expression !== null) {
      const resolved = {};
      for (const [key, value] of Object.entries(expression)) {
        resolved[key] = this.resolveExpression(value);
      }
      return resolved;
    }

    // Handle strings (runtime expressions)
    if (typeof expression !== "string") {
      return expression;
    }

    this.expression = expression;

    // Check if it's a runtime expression
    if (this.isARunTimeExpression()) {
      return this.mapToContext();
    }

    // NEW: Handle multiple templated expressions
    const runtimeExprRegex = /{(\$[^}]+)}/g;
    const matches = [...expression.matchAll(runtimeExprRegex)];

    if (matches.length > 0) {
      // If entire string is single expression, return resolved value
      if (matches.length === 1 && matches[0][0] === expression) {
        const extractedExpression = matches[0][1];
        if (test(extractedExpression)) {
          this.expression = extractedExpression;
          return this.mapToContext();
        }
      }

      // Multiple expressions - substitute each one
      let result = expression;
      for (const match of matches) {
        const fullMatch = match[0];
        const expr = match[1];

        if (test(expr)) {
          this.expression = expr;
          const resolvedValue = this.mapToContext();
          const stringValue =
            typeof resolvedValue === "object"
              ? JSON.stringify(resolvedValue)
              : String(resolvedValue);
          result = result.replace(fullMatch, stringValue);
        }
      }
      return result;
    }

    return expression;
  }

  /**
   * Adds data to the context under a specific type
   * @public
   * @param {string} type - The context type (e.g., 'inputs', 'response')
   * @param {*} obj - The data to add
   */
  addToContext(type, obj) {
    if (Object.hasOwn(this.context, type)) {
      if (Array.isArray(this.context[type])) {
        if (Array.isArray(obj)) {
          this.context[type].push(...obj);
        } else {
          this.context[type].push(obj);
        }
      } else if (
        typeof this.context[type] === "object" &&
        typeof obj === "object"
      ) {
        Object.assign(this.context[type], obj);
      } else {
        this.context[type] = obj;
      }
    } else {
      this.context[type] = obj;
    }
  }

  /**
   * @private
   * @param {string} expression - The Criteria Condition expression
   * @returns {string}
   */
  normalisedExpression(expression) {
    const normalisedSymbolsExpression =
      this.normaliseSymbolsExpression(expression);
    const cleanedJsExpression = normalisedSymbolsExpression.replace(
      /{(.*?)}/g,
      "$1",
    );
    const expressionWithBrackets =
      this.convertNumericIndices(cleanedJsExpression);
    const headerParameterNameRegex = /\.header\.([a-zA-Z0-9._-]+)/g;
    const normalisedExpression = expressionWithBrackets.replace(
      headerParameterNameRegex,
      (_match, p1) => {
        return `.header.${p1.toLowerCase()}`;
      },
    );

    return normalisedExpression;
  }

  /**
   * Alters the expression by replacing hyphens with underscores
   * @private
   * @param {string} expression - The Criteria Condition expression
   * @returns {string}
   */
  normaliseSymbolsExpression(expression) {
    return expression.replace(/\$([a-zA-Z0-9._-]+)/g, (_match, variable) => {
      const normalisedKey = variable.replace(/-/g, "_");
      return `$${normalisedKey}`;
    });
  }

  /**
   * Alters the expression to match a dot followed by a number (.1) and change to [1]
   * @private
   * @param {string} expression - The Criteria Condition expression
   * @returns {string}
   */
  convertNumericIndices(expression) {
    return expression.replace(/\.(\d+)/g, (match, num, offset, str) => {
      const charBeforeDot = str[offset - 1];
      const isFloat = /\d/.test(charBeforeDot);
      return isFloat ? match : `[${num}]`;
    });
  }

  /**
   * Maps the parsed expression to the corresponding context value
   * @private
   * @returns {*} The value from context
   * @throws {Error} If context path is missing or invalid
   */
  mapToContext() {
    const { normalised, contextName, pointer, token } = this.mapParts();

    if (!normalised) {
      throw new Error(`Unable to resolve expression: ${this.expression}`);
    }

    let contextData = this.context[normalised];
    let foundInContext = contextData !== undefined;

    // If not found as flat key and key has dots, try nested access
    if (!foundInContext && normalised.includes(".")) {
      const parts = normalised.split(".");
      contextData = this.context[parts[0]];

      if (contextData !== undefined) {
        foundInContext = true;
        for (let i = 1; i < parts.length; i++) {
          const nextValue = contextData?.[parts[i]];

          // Check if property exists (not just undefined value)
          if (nextValue === undefined && !(parts[i] in contextData)) {
            foundInContext = false;
            contextData = undefined;
            break;
          }

          contextData = nextValue;
        }
      } else {
        foundInContext = false;
      }
    }

    if (!foundInContext) {
      throw new Error(
        `Context '${normalised}' not found for expression: ${this.expression}`,
      );
    }

    if (this.isSimple) {
      const propName = contextName?.split("#")[0];

      if (!propName) {
        return contextData;
      }

      const propertyPath = propName.split(".");
      let value = contextData;

      for (const prop of propertyPath) {
        if (value === undefined || value === null) {
          return undefined;
        }
        value = value[prop];
      }

      if (pointer) {
        try {
          return evaluate(value, pointer);
        } catch (err) {
          throw new Error(`Invalid JSON pointer '${pointer}': ${err.message}`);
        }
      }

      return value;
    }

    if (pointer) {
      if (!contextData) {
        throw new Error(`Context path '${normalised}' not found`);
      }

      // NEW: Check if contextData is XML
      if (this.isXML(contextData)) {
        const { XMLParser } = require("fast-xml-parser");
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "@_",
        });
        const jsonData = parser.parse(contextData);
        return evaluate(jsonData, pointer);
      }

      // Regular JSON pointer evaluation
      try {
        return evaluate(contextData, pointer);
      } catch (err) {
        throw new Error(`Invalid JSON pointer '${pointer}': ${err.message}`);
      }
    }

    if (token) {
      if (!contextData) {
        throw new Error(`Context path '${normalised}' not found`);
      }

      if (typeof contextData.get === "function") {
        return contextData.get(token);
      }

      return contextData[token];
    }

    return contextData;
  }

  /**
   * Tests if the expression is a runtime expression
   * @private
   * @returns {boolean}
   */
  isARunTimeExpression() {
    try {
      return test(this.expression);
    } catch (err) {
      return false;
    }
  }

  /**
   * Parses the expression into its component parts
   * @private
   * @returns {{normalised: string, contextName: string, pointer: string, token: string}}
   * @throws {Error} If parsing fails
   */
  mapParts() {
    let parsedExpression;
    try {
      parsedExpression = parse(this.expression);
    } catch (err) {
      throw new Error(
        `Failed to parse expression '${this.expression}': ${err.message}`,
      );
    }

    const parts = [];
    parsedExpression.ast.translate(parts);

    if (!parts.length) {
      throw new Error(`No parts found in expression: ${this.expression}`);
    }

    this.isSimple = false;
    let expressionType;
    let contextName = "";
    let pointer = null;
    let token = null;

    for (const partType of parts) {
      const [type, value] = partType;

      if (type === "expression") {
        const firstPart = value.split(".")[0].split("#")[0];
        this.isSimple = this.simpleExpressions.includes(firstPart);

        if (this.isSimple) {
          expressionType = firstPart;
        } else {
          const baseExpression = value.split("#")[0];
          const parts = baseExpression.split(".");
          if (
            parts.length === 3 &&
            ["query", "header", "path"].includes(parts[1])
          ) {
            expressionType = parts.slice(0, 2).join(".");
          } else {
            expressionType = baseExpression;
          }
        }
      }

      if (this.isSimple) {
        if (type === "name") {
          contextName = value;
        }
      } else {
        if (type === "source") {
          contextName = value;
        }

        if (type === "json-pointer") {
          pointer = value;
        }

        if (type === "token") {
          token = value;
        }
      }
    }

    if (this.isSimple && contextName?.includes("#")) {
      const [name, ptr] = contextName.split("#");
      contextName = name;
      pointer = ptr;
    }

    const normalised = this.expressionMap[expressionType];

    if (!normalised) {
      throw new Error(`Unknown expression type: ${expressionType}`);
    }

    return { normalised, contextName, pointer, token };
  }
}

module.exports = Expression;
