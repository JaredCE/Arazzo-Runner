"use strict";

const expect = require("chai").expect;

const Expression = require("../../src/Expression.js");

describe(`Expression`, function () {
  describe(`constructor`, function () {
    it(`returns an instance of Expression`, function () {
      const expected = new Expression();

      expect(expected).to.be.instanceOf(Expression);
    });
  });

  describe(`checkSimpleExpression`, function () {
    describe(`boolean`, function () {
      it(`returns true when an expression matches a boolean true`, function () {
        const expression = new Expression();

        expression.addToContext("response", { body: true });

        const expected = expression.checkSimpleExpression(
          "$response.body == true",
        );

        expect(expected).to.be.true;
      });

      it(`returns true when an expression matches a boolean false`, function () {
        const expression = new Expression();

        expression.addToContext("response", { body: false });

        const expected = expression.checkSimpleExpression(
          "$response.body == false",
        );

        expect(expected).to.be.true;
      });
    });

    describe(`null`, function () {
      it(`returns true when an expression matches a null`, function () {
        const expression = new Expression();

        // expression.addToContext("response", { body: null });
        expression.addToContext("response.body", null);

        const expected = expression.checkSimpleExpression(
          "$response.body == null",
        );

        expect(expected).to.be.true;
      });
    });

    describe(`number`, function () {
      describe(`equality`, function () {
        it(`returns true when an expression matches`, function () {
          const expression = new Expression();

          expression.addToContext("statusCode", 200);

          const expected =
            expression.checkSimpleExpression("$statusCode == 200");

          expect(expected).to.be.true;
        });

        it(`returns true when an expression matches`, function () {
          const expression = new Expression();

          expression.addToContext("statusCode", 201);

          const expected =
            expression.checkSimpleExpression("$statusCode != 200");

          expect(expected).to.be.true;
        });

        it(`returns false when an expression does not match`, function () {
          const expression = new Expression();

          expression.addToContext("statusCode", 201);

          const expected =
            expression.checkSimpleExpression("$statusCode == 200");

          expect(expected).to.be.false;
        });
      });

      describe(`Less than`, function () {
        it(`returns true when an expression matches`, function () {
          const expression = new Expression();

          expression.addToContext("statusCode", 200);

          const expected =
            expression.checkSimpleExpression("$statusCode < 201");

          expect(expected).to.be.true;
        });
      });

      describe(`Less than equal`, function () {
        it(`returns true when an expression matches`, function () {
          const expression = new Expression();

          expression.addToContext("statusCode", 201);

          const expected =
            expression.checkSimpleExpression("$statusCode <= 201");

          expect(expected).to.be.true;
        });
      });

      describe(`Greater than`, function () {
        it(`returns true when an expression matches`, function () {
          const expression = new Expression();

          expression.addToContext("statusCode", 404);

          const expected =
            expression.checkSimpleExpression("$statusCode > 400");

          expect(expected).to.be.true;
        });
      });

      describe(`Greater than equal`, function () {
        it(`returns true when an expression matches`, function () {
          const expression = new Expression();

          expression.addToContext("statusCode", 404);

          const expected =
            expression.checkSimpleExpression("$statusCode >= 404");

          expect(expected).to.be.true;
        });
      });
    });

    describe(`string`, function () {
      describe(`equality`, function () {
        it(`returns true when an expression matches`, function () {
          const expression = new Expression();
          const headers = new Headers();
          headers.append("x-rate-limit", "500");
          const contextHeaders = {};
          for (const [header, value] of headers.entries()) {
            Object.assign(contextHeaders, { [header]: value });
          }

          expression.addToContext("response.header", contextHeaders);

          const expected = expression.checkSimpleExpression(
            "$response.header.x-rate-limit == '500'",
          );

          expect(expected).to.be.true;
        });

        it(`returns true when an expression matches`, function () {
          const expression = new Expression();
          const headers = new Headers();
          headers.append("x-rate-limit", "501");
          const contextHeaders = {};
          for (const [header, value] of headers.entries()) {
            Object.assign(contextHeaders, { [header]: value });
          }

          expression.addToContext("response.header", contextHeaders);

          const expected = expression.checkSimpleExpression(
            '$response.header.x-rate-limit != "500"',
          );

          expect(expected).to.be.true;
        });

        it(`returns true when an expression matches case insensitive`, function () {
          const expression = new Expression();
          const headers = new Headers();
          headers.append("x-rate-limit", "HELLO");
          const contextHeaders = {};
          for (const [header, value] of headers.entries()) {
            Object.assign(contextHeaders, { [header]: value });
          }

          expression.addToContext("response.header", contextHeaders);

          const expected = expression.checkSimpleExpression(
            "$response.header.x-rate-limit == 'hello'",
          );

          expect(expected).to.be.true;
        });

        it(`returns true when an expression matches to a response body`, function () {
          const expression = new Expression();

          expression.addToContext("response", { body: "john" });

          const expected = expression.checkSimpleExpression(
            '$response.body == "john"',
          );

          expect(expected).to.be.true;
        });
      });

      describe(`jsonPointer`, function () {
        it(`returns true when an expression matches to a response body using json pointer`, function () {
          const expression = new Expression();

          expression.addToContext("response", { body: { name: "John" } });

          const expected = expression.checkSimpleExpression(
            '$response.body#/name == "John"',
          );

          expect(expected).to.be.true;
        });
      });

      describe(`index based`, function () {
        it(`returns true when an expression matches`, function () {
          const expression = new Expression();

          expression.addToContext("response.body", [
            { name: "Jack" },
            { name: "John" },
          ]);

          const expected = expression.checkSimpleExpression(
            "$response.body[1].name == 'John'",
          );

          expect(expected).to.be.true;
        });
      });
    });

    describe(`multiple test`, function () {
      describe(`AND`, function () {
        it(`returns true when an expression matches`, function () {
          const expression = new Expression();
          const headers = new Headers();
          headers.append("x-rate-limit", "500");
          const contextHeaders = {};
          for (const [header, value] of headers.entries()) {
            Object.assign(contextHeaders, { [header]: value });
          }

          expression.addToContext("response.header", contextHeaders);
          expression.addToContext("statusCode", 200);

          const expected = expression.checkSimpleExpression(
            '$response.header.x-rate-limit == "500" && $statusCode == 200',
          );

          expect(expected).to.be.true;
        });

        describe(`logical grouping`, function () {
          it(`returns true when an expression matches`, function () {
            const expression = new Expression();
            const headers = new Headers();
            headers.append("x-rate-limit", "500");
            headers.append("x-rate-timeout", "30");
            const contextHeaders = {};
            for (const [header, value] of headers.entries()) {
              Object.assign(contextHeaders, { [header]: value });
            }

            expression.addToContext("response.header", contextHeaders);
            expression.addToContext("statusCode", 200);

            const expected = expression.checkSimpleExpression(
              "($response.header.x-rate-limit == '500' && $response.header.x-rate-timeout == '30') && $statusCode == 200",
            );

            expect(expected).to.be.true;
          });
        });
      });

      describe(`OR`, function () {
        it(`returns true when an expression matches`, function () {
          const expression = new Expression();
          const headers = new Headers();
          headers.append("x-rate-limit", "600");
          const contextHeaders = {};
          for (const [header, value] of headers.entries()) {
            Object.assign(contextHeaders, { [header]: value });
          }

          expression.addToContext("response.header", contextHeaders);
          expression.addToContext("statusCode", 200);

          const expected = expression.checkSimpleExpression(
            '$response.header.x-rate-limit == "500" || $statusCode == 200',
          );

          expect(expected).to.be.true;
        });

        describe(`logical grouping`, function () {
          it(`returns true when an expression matches`, function () {
            const expression = new Expression();
            const headers = new Headers();
            headers.append("x-rate-limit", "500");
            const contextHeaders = {};
            for (const [header, value] of headers.entries()) {
              Object.assign(contextHeaders, { [header]: value });
            }

            expression.addToContext("response.header", contextHeaders);
            expression.addToContext("statusCode", 200);

            const expected = expression.checkSimpleExpression(
              "($response.header.x-rate-limit == '500' || $response.header.x-rate-limit == 400) && $statusCode == 200",
            );

            expect(expected).to.be.true;
          });
        });
      });
    });

    it(`returns true when an expression matches to a response header`, function () {
      const expression = new Expression();
      const headers = new Headers();
      headers.append("x-rate-limit", "500");
      const contextHeaders = {};
      for (const [header, value] of headers.entries()) {
        Object.assign(contextHeaders, { [header]: value });
      }

      expression.addToContext("response.header", contextHeaders);

      const expected = expression.checkSimpleExpression(
        '$response.header.x-rate-limit == "500"',
      );

      expect(expected).to.be.true;
    });

    it(`returns false when an expression does not match to a response header`, function () {
      const expression = new Expression();
      const headers = new Headers();
      headers.append("x-rate-limit", "500");
      const contextHeaders = {};
      for (const [header, value] of headers.entries()) {
        Object.assign(contextHeaders, { [header]: value });
      }

      expression.addToContext("response", { header: contextHeaders });

      const expected = expression.checkSimpleExpression(
        '$response.header.x-rate-limit == "600"',
      );

      expect(expected).to.be.false;
    });
  });

  describe(`resolveExpression`, function () {
    it(`can resolve a simple expression`, function () {
      const expression = new Expression();

      expression.addToContext("inputs", {
        user: { name: "john" },
        petId: 1224,
      });

      const expected = expression.resolveExpression("$inputs.user");

      expect(expected).to.be.eql({ name: "john" });
    });

    describe(`dotted expressions`, function () {
      it(`should resolve a dotted expression for a response body`, function () {
        const expression = new Expression();

        expression.addToContext("response.body", { name: "john" });

        const expected = expression.resolveExpression("$response.body");

        expect(expected).to.be.eql({ name: "john" });
      });

      it(`should resolve a dotted expression for a steps output`, function () {
        const expression = new Expression();

        // expression.addToContext('steps.createAUser.outputs.user', { name: 'john' });
        expression.addToContext("steps", {
          createAUser: { outputs: { user: { name: "john" } } },
        });

        const expected = expression.resolveExpression(
          "$steps.createAUser.outputs.user",
        );

        expect(expected).to.be.eql({ name: "john" });
      });

      it(`should resolve a dotted expression with a json pointer for a response body`, function () {
        const expression = new Expression();

        expression.addToContext("response.body", { name: "john" });

        const expected = expression.resolveExpression("$response.body#/name");

        expect(expected).to.be.eql("john");
      });

      it(`should resolve a dotted expression for a specific response header`, function () {
        const expression = new Expression();
        const headers = new Headers();
        headers.append("x-rate-limit", "500");
        const contextHeaders = {};
        for (const [header, value] of headers.entries()) {
          Object.assign(contextHeaders, { [header]: value });
        }

        expression.addToContext("response.header", contextHeaders);

        const expected = expression.resolveExpression(
          "$response.header.x-rate-limit",
        );

        expect(expected).to.be.eql("500");
      });

      it(`should resolve a dotted expression for a specific request QueryParams`, function () {
        const expression = new Expression();
        const queryParams = new URLSearchParams();
        queryParams.append("username", "bob");
        const contextQueryParams = {};
        for (const [queryParam, value] of queryParams.entries()) {
          Object.assign(contextQueryParams, { [queryParam]: value });
        }

        expression.addToContext("request.query", contextQueryParams);

        const expected = expression.resolveExpression(
          "$request.query.username",
        );

        expect(expected).to.be.eql({ username: "bob" });
      });
    });

    it(`can resolve a templated expression`, function () {
      const expression = new Expression();

      expression.addToContext("inputs", {
        user: { name: "john" },
        petId: 1224,
      });

      const expected = expression.resolveExpression("{$inputs.user}");

      expect(expected).to.be.eql({ name: "john" });
    });

    it(`can resolve a json pointer expression`, function () {
      const expression = new Expression();

      expression.addToContext("inputs", {
        user: { name: "john" },
        petId: 1224,
      });

      const expected = expression.resolveExpression("$inputs.user#/name");

      expect(expected).to.be.eql("john");
    });

    it(`can resolve a templated expression to a json Pointer`, function () {
      const expression = new Expression();

      expression.addToContext("inputs", {
        user: { name: "john" },
        petId: 1224,
      });

      const expected = expression.resolveExpression("{$inputs.user#/name}");

      expect(expected).to.be.eql("john");
    });

    it(`can resolve all expressions in an object`, function () {
      const expression = new Expression();

      expression.addToContext("inputs", {
        user: { name: "john" },
        petId: 1224,
      });

      const expected = expression.resolveExpression({
        user: { name: "$inputs.user#/name" },
        petId: "$inputs.petId",
      });

      expect(expected).to.be.eql({ user: { name: "john" }, petId: 1224 });
    });

    it(`can resolve all expressions in an array`, function () {
      const expression = new Expression();

      expression.addToContext("inputs", {
        user: { name: "john" },
        petId: 1224,
      });

      const expected = expression.resolveExpression(["$inputs.user#/name"]);

      expect(expected).to.be.eql(["john"]);
    });
  });

  describe(`addToContext`, function () {
    it(`adds a type to the context if it does not already exist`, function () {
      const expression = new Expression();

      expression.addToContext("sourceDescriptions", [{ name: "abc" }]);

      expect(expression.context).to.have.property("sourceDescriptions");
      expect(expression.context.sourceDescriptions).to.be.an("array");
      expect(expression.context.sourceDescriptions).to.have.lengthOf(1);
    });

    it(`adds a type to the context if it does already exist`, function () {
      const expression = new Expression();

      expression.addToContext("sourceDescriptions", [{ name: "abc" }]);

      expect(expression.context).to.have.property("sourceDescriptions");
      expect(expression.context.sourceDescriptions).to.be.an("array");
      expect(expression.context.sourceDescriptions).to.have.lengthOf(1);

      expression.addToContext("sourceDescriptions", [{ name: "123" }]);
    });

    it(`adds a dotted type`, function () {
      const expression = new Expression();

      expression.addToContext("body.response", { name: "john" });

      expect(expression.context).to.have.property("body.response");
    });
  });
});
