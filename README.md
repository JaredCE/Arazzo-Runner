# Arazzo-Runner

<p>
  <a href="https://www.npmjs.com/package/arazzo-runner">
    <img src="https://img.shields.io/npm/v/arazzo-runner.svg?style=flat-square">
  </a>
  <a href="https://github.com/JaredCE/arazzo-runner/actions/workflows/node.yml">
    <img src="https://github.com/JaredCE/arazzo-runner/actions/workflows/node.yml/badge.svg">
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

OpenAPI Param types with style and explode are not quite supported yet

### Reporting && Logging

A better reporter/logger than console.log
