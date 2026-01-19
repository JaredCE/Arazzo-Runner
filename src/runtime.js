/**
 * Extract and resolve multiple runtime expressions from a template string
 *
 * @param {string} template - Template string with runtime expressions like "{$inputs.user}"
 * @param {Function} resolver - Function to resolve each runtime expression
 * @returns {string} The template with all expressions resolved
 *
 * @example
 * const result = extractAndResolve(
 *   "{$inputs.user} has a pet called {$inputs.petName}",
 *   (expr) => resolveExpression(expr)
 * );
 * // "Jack has a pet called Jill"
 */
function extractAndResolve(template, resolver) {
  if (typeof template !== "string") {
    return template;
  }

  // Match all runtime expressions wrapped in {}
  const runtimeExpressionRegex = /{(\$[^}]+)}/g;

  let result = template;
  const matches = [...template.matchAll(runtimeExpressionRegex)];

  if (matches.length === 0) {
    return template;
  }

  // If the entire string is a single expression like "{$url}", return the resolved value
  if (matches.length === 1 && matches[0][0] === template) {
    return resolver(matches[0][1]);
  }

  // Multiple expressions or mixed template - replace each one
  for (const match of matches) {
    const fullMatch = match[0]; // e.g., "{$inputs.user}"
    const expression = match[1]; // e.g., "$inputs.user"

    const resolvedValue = resolver(expression);

    // Convert resolved value to string for template substitution
    const stringValue =
      typeof resolvedValue === "object"
        ? JSON.stringify(resolvedValue)
        : String(resolvedValue);

    result = result.replace(fullMatch, stringValue);
  }

  return result;
}

/**
 * Check if a string contains any runtime expressions
 *
 * @param {string} str - String to check
 * @returns {boolean} True if the string contains runtime expressions
 */
function hasRuntimeExpressions(str) {
  if (typeof str !== "string") {
    return false;
  }
  return /{(\$[^}]+)}/g.test(str);
}

/**
 * Extract all runtime expressions from a template string
 *
 * @param {string} template - Template string
 * @returns {Array<string>} Array of runtime expressions (without the {} wrapper)
 */
function extractAll(template) {
  if (typeof template !== "string") {
    return [];
  }

  const runtimeExpressionRegex = /{(\$[^}]+)}/g;
  const matches = [...template.matchAll(runtimeExpressionRegex)];

  return matches.map((match) => match[1]);
}

// Example usage
// const Expression = require("./Expression");

// const expression = new Expression();
// expression.addToContext("inputs", {
//   user: { name: "Jack" },
//   petName: "Jill",
//   pet_id: 1,
//   coupon_code: "abc-def",
//   quantity: 1,
// });

// // Example 1: Multiple expressions in a sentence
// const result1 = extractAndResolve(
//   "{$inputs.user} has a pet called {$inputs.petName}",
//   (expr) => expression.resolveExpression(expr),
// );
// console.log(result1);
// // Output: {"name":"Jack"} has a pet called Jill

// // Example 2: Single expression (returns the resolved value directly)
// const result2 = extractAndResolve("{$inputs.user}", (expr) =>
//   expression.resolveExpression(expr),
// );
// console.log(result2);
// // Output: { name: 'Jack' }

// // Example 3: JSON template with multiple expressions
// const result3 = extractAndResolve(
//   '{\n  "petOrder": {\n    "petId": "{$inputs.pet_id}",\n    "couponCode": "{$inputs.coupon_code}",\n    "quantity": "{$inputs.quantity}"\n  }\n}',
//   (expr) => expression.resolveExpression(expr),
// );
// console.log(result3);

// // Helper functions
// console.log("\nHelper examples:");
// console.log("Has expressions:", hasRuntimeExpressions("{$inputs.user} test"));
// console.log("Extract all:", extractAll("{$inputs.user} and {$inputs.petName}"));

module.exports = {
  extractAndResolve,
  hasRuntimeExpressions,
  extractAll,
};
