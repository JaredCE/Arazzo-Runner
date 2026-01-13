#!/usr/bin/env node
"use strict";

const { parseArgs } = require("node:util");
const path = require("node:path");
const fs = require("node:fs");

const Runner = require("./src/Runner");

// Parse command line arguments
const options = {
  arazzo: {
    type: "string",
    short: "a",
  },
  input: {
    type: "string",
    short: "i",
  },
  help: {
    type: "boolean",
    short: "h",
  },
  version: {
    type: "boolean",
    short: "v",
  },
};

function showHelp() {
  console.log(`
Arazzo Runner - Execute Arazzo workflow specifications

USAGE:
  arazzo-runner --arazzo <file|url> --input <file>
  arazzo-runner -a <file|url> -i <file>

OPTIONS:
  -a, --arazzo <file|url>   Path or URL to Arazzo Document file (required)
  -i, --input <file>        Path to input JSON file (required)
  -h, --help                Show this help message
  -v, --version             Show version number

EXAMPLES:
  # Run with local files
  arazzo-runner --arazzo ./arazzo.json --input ./input.json

  # Run with URL
  arazzo-runner -a https://example.com/arazzo.json -i ./input.json

  # Short form
  arazzo-runner -a arazzo.json -i input.json
`);
}

function showVersion() {
  const packageJson = require("./package.json");
  console.log(`v${packageJson.version}`);
}

function isUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function validateArazzoPath(arazzoPath) {
  if (isUrl(arazzoPath)) {
    return arazzoPath;
  }

  const resolvedPath = path.resolve(arazzoPath);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Error: Arazzo file not found: ${arazzoPath}`);
    process.exit(1);
  }

  return resolvedPath;
}

function validateInputPath(inputPath) {
  const resolvedPath = path.resolve(inputPath);

  if (!fs.existsSync(resolvedPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  return resolvedPath;
}

async function main() {
  let values;

  try {
    ({ values } = parseArgs({ options, allowPositionals: false }));
  } catch (err) {
    console.error(`Error: ${err.message}`);
    console.log("Use --help for usage information");
    process.exit(1);
  }

  // Handle help
  if (values.help) {
    showHelp();
    process.exit(0);
  }

  // Handle version
  if (values.version) {
    showVersion();
    process.exit(0);
  }

  // Validate required arguments
  if (!values.arazzo) {
    console.error("Error: --arazzo argument is required");
    console.log("Use --help for usage information");
    process.exit(1);
  }

  if (!values.input) {
    console.error("Error: --input argument is required");
    console.log("Use --help for usage information");
    process.exit(1);
  }

  // Validate paths
  const arazzoPath = validateArazzoPath(values.arazzo);
  const inputPath = validateInputPath(values.input);

  console.log(`Starting Arazzo Runner...`);
  console.log(`Arazzo: ${arazzoPath}`);
  console.log(`Input: ${inputPath}`);
  console.log("");

  try {
    const runner = new Runner();
    await runner.runArazzo(arazzoPath, inputPath);

    console.log("");
    console.log("✓ Arazzo execution completed successfully");
    process.exit(0);
  } catch (err) {
    console.error("");
    console.error("✗ Arazzo execution failed:");
    console.error(err.message);

    if (process.env.DEBUG) {
      console.error("");
      console.error("Stack trace:");
      console.error(err.stack);
    }

    process.exit(1);
  }
}

main();
