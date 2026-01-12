"use strict";

const Arazzo = require("./Arazzo");
const OpenAPI = require("./OpenAPI");

class DocumentFactory {
  constructor() {}

  async buildDocument(type, path, name, options) {
    let document;
    if (type === "openapi") {
      document = new OpenAPI(path, name, options);
    } else {
      document = new Arazzo(path, name, options);
    }

    await document.loadDocument();

    return document;
  }
}

module.exports = new DocumentFactory();
