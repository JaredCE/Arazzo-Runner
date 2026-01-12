"use strict";

const {
  bundleDocument,
  bundleFromString,
  createConfig,
} = require("@redocly/openapi-core");
const { chain } = require("stream-chain");
const Pick = require("stream-json/filters/Pick");
const { streamArray } = require("stream-json/streamers/StreamArray");
const { streamValues } = require("stream-json/streamers/StreamValues");

const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");

class Document {
  constructor(url, name, { parser, logger }) {
    this.url = url;
    this.name = name;
    this.parser = parser;
    this.logger = logger;
  }

  async loadDocument() {
    const response = await fetch(this.url);

    if (!response.ok) {
      throw new Error(`Error fetching document from ${this.url}`);
    }

    let data = await response.json();

    await this.writeDocument(data);
  }

  async writeDocument(data) {
    let document = data;
    if (this.type === "openapi") {
      const config = await createConfig({});
      const bundledData = await bundleFromString({
        source: JSON.stringify(data),
        dereference: true,
        config: config,
      });
      document = bundledData.bundle.parsed;
    }

    this.fileName = `${this.name}.json`;
    await fsp.writeFile(this.fileName, JSON.stringify(document));
    this.filePath = path.resolve(this.fileName);
  }

  async readStreamFromURL(key) {
    try {
      const response = await fetch(this.url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return chain([
        response.body, // ReadableStream from fetch
        Pick.withParser({ filter: key }),
        streamValues(), // Change to streamObject() if JSON is an object
      ]);
    } catch (err) {
      console.error("Error reading stream:", err);
    }
  }

  matchesExpectedRunTimeExpression(string, runtimeExpression) {
    const result = this.parser.parse(string, { peg$library: true });
    if (result.peg$success) {
      if (result.peg$result[0] === runtimeExpression) {
        return true;
      }
    }

    return false;
  }

  JSONPickerToIndex(key, index, file = this.filePath) {
    return new Promise((resolve, reject) => {
      const pipeline = chain([
        fs.createReadStream(path.resolve(file)),
        Pick.withParser({ filter: key }),
        streamArray(),
      ]);

      pipeline.on("data", ({ key, value }) => {
        if (key === index) {
          resolve(value);
          pipeline.destroy();
        }
      });

      pipeline.on("error", (err) => {
        reject(err);
      });

      pipeline.on("end", () => {
        resolve(null);
      });
    });
  }

  JSONPicker(key, file) {
    let pipeline;

    pipeline = chain([
      fs.createReadStream(path.resolve(file)),
      Pick.withParser({ filter: key }),
      streamValues(),
    ]);

    return pipeline;
  }
}

module.exports = Document;
