"use strict";

const Arazzo = require("./Arazzo");
const OpenAPI = require("./OpenAPI");

class DocumentFactory {
  constructor() {}

  /**
   * Document Factory to create Arazzo or OpenAPI documents
   * @function buildDocument
   * @param {('openapi'|'arazzo')} type Which document type to create
   * @param {string} path The url of the document
   * @param {string} name What the name of the written file will be
   * @param {*} options Takes a Logging library and a Reporting library
   * @returns {Arazzo|OpenAPI}
   */
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
