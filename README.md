# Arazzo-Runner

<p>
  <a href="https://www.npmjs.com/package/arazzo-runner">
    <img src="https://img.shields.io/npm/v/arazzo-runner.svg?style=flat-square">
  </a>
  <a href="https://github.com/JaredCE/arazzo-runner/actions/workflows/node.yml">
    <img src="https://github.com/JaredCE/arazzo-runner/actions/workflows/node.yml/badge.svg">
  </a>
  <a href="https://www.buymeacoffee.com/jarede">
    <img src="https://raw.githubusercontent.com/pachadotdev/buymeacoffee-badges/main/bmc-donate-yellow.svg">
  </a>
</p>

Run your [OpenAPI Arazzo Workflow Spec](https://www.openapis.org/arazzo-specification).

## Install

**Using npm:**

```bash
npm install -g arazzo-runner
```

## Use

```bash
# Run the CLI
arazzo-runner --arazzo ./arazzo.json --input ./input.json

# Or with short flags
arazzo-runner -a arazzo.json -i input.json

# With URL
arazzo-runner -a https://example.com/arazzo.json -i ./input.json

# Show help
arazzo-runner --help

# Show version
arazzo-runner --version
```

### Input file

The input file is where you keep your variables that you wish to use within your workflow and should be a json file structured like:

```json
{
  "worflowId1": {
    "name": "Jared"
  }
}
```

The file should contain objects for each workflow, by workflowId, with the variables matching up to the inputs that you defined in your workflow inputs schema.

This file is likely to be comitted to your repository, so you should not store secrets in the file, instead you might use something like [jq](https://jqlang.org/) that can take repository variables and insert them into your input file:

```bash
jq --arg password "$secret_password" '.workflowId1.password = $password' input.json
```

Obviously, if you have a lot of secret variables that need adding as inputs, then you might need to write a script that can alter the `input.json` file for you within your CI/CD runner.

## OpenAPI Parameters

OpenAPI Documents allow you to specify [`header`, `path` and `query` parameters](https://spec.openapis.org/oas/latest.html#parameter-object) in myriad of styles. This Arazzo Runner will respect your styling and send the format to the server as specified by your OpenAPI document.

It currently does not follow the `allowEmptyValue`, `allowReserved` or the `content` keywords currently.

## Logging And Reporting

### Logging

Logging is currently pretty verbose, with an example Log looking like:

```bash
Running Workflows
Running Workflow: createUser
Running Step: createAUser
Getting Source Description for: users-openAPI
Making a POST to http://petstore.swagger.io/v2/user
http://petstore.swagger.io/v2/user responded with a: 200
==================================================================================
Checking: $statusCode == 200
✅ $statusCode == 200 passed
==================================================================================
✅ All criteria checks passed
Running onSuccess Rules
✅ Step createAUser completed
✅ Workflow createUser completed
✅ All Workflows run
```

### Reporting

Work on Reporting still needs completeing.

## Still unsupported

### PathOperation

Accessing an OpenAPI operation by Operation Path `'{$sourceDescriptions.petstoreDescription.url}#/paths/~1pet~1findByStatus/get'` does not work currently

### OpenAPI Servers on various levels

This pulls from the top level servers object of an OpenAPI Document. Server variables do not work either.

### OpenAPI server variables

OpenAPI server variables currently do not work

### JSONPath and XPath criteria objects

Criteria Objects set as type JSON Path or XPath do not work

### Non application/json Responses

Responses that do not conform to application/json do not work

### Non application/json Requests

Requests that do not conform to application/json do not work
