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

## Still unsupported

### OpenAPI Params

OpenAPI parameter types with style and explode are not quite supported yet

### OpenAPI Servers on various levels

This pulls from the top level servers object of an OpenAPI Document. Server variables do not work either.

### JSONPath and XPath criteria objects

Criteria Objects set as type JSON Path or XPath do not work

### Non application/json Responses

Responses that do not conform to application/json do not work

### Non application/json Requests

Requests that do not conform to application/json do not work

#### Reporting && Logging

A better reporter/logger than console.log still needs to be implemented.
