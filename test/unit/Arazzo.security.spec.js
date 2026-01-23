"use strict";

const { bundleFromString } = require("@redocly/openapi-core");
const expect = require("chai").expect;
const nock = require("nock");
const sinon = require("sinon");

const path = require("node:path");
const fs = require("node:fs");
const fsp = require("node:fs/promises");

const openAPIMock = require("../mocks/petStoreOpenAPI.json");

const docFactory = require("../../src/DocFactory.js");
const Input = require("../../src/Input.js");
const Logger = require("../../src/Logger.js");
const OpenAPI = require("../../src/OpenAPI.js");

const Arazzo = require("../../src/Arazzo.js");

describe(`OpenAPI Security`, function () {
  const logger = new Logger();

  describe(`apiKey`, function () {
    it(`handles the security requirement when root level security but path is optional, sending Access Token anyway`, async function () {
      // nock.recorder.rec();

      const AccessToken =
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ";

      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/security/api-key/users-openapi-global-security-optional-path.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed5adf6fdb36107ef75f7150f7b002899ca6d91ef2b4346d8760413b2c29b6212b50463e5b6c2552234f71bcc0fffb404ab229ca92edd8695c342f4ecc1fc7bbe3771f7947dff5000299a160190f8e2178191e842f833dd31ac934930205e9e018ee7a0000818e624cd9bcc10c53c8083f68544e2b4040930c8d4479fd1923b222cb9e4cc90c1571d4b5190041ae510996a2d7ee48d3a4b818054ee774cf9530e44ad3bb8d44246c530998329edc7f7ac6b41e4b35d840422cc506fa9b6db82046b9bf418e0c2e0847a882bd7af750aa945139e0e5a1df3d401d299e1197c28c31a8817225579bd9ff8e5ec16deafb3428b162e5cc0554d3679383eda09377ecc82aeef8f9a8dbe54fc87f42feb6916f0c3ab50c3dd8b90058a2b6eed49b29c526aeda9c306d68dc6a65979d8b2d5d6a6bb7b51ed25a63a513acaed3ba1d687071625df408de6b25b365c6f9e069a5b43505b512db9a72eeb7659e9056925b57ce42aa5b534807e1ad0df806e9ad4c7b1eae6b406b925f2bfd2de7947339e26217eea9f73ae93a8c4b8c617fa0cea4d0b8b9812751845a5fca2f28b6a5e1edbe6284fb094f392d56b0425963ea5ffb6f6e33ae50ef9f0ca9ed2657d7a6beed8dbd6a9bd573e6061aa35c719a5c98a4a7e6a3e024a7582afe1f2b81bd886233fe1bd638b6026d7db24bc23646626403c70bbdead3aa15703194f37c8c382556e6ef489aa442b011511ae005df65cc35700d0c344bb30441a3ba4105b3b9c5f710e06f9943c4040cb91880cc0952d3cdaecdbf1763361aa1024670151365c7fdbe2e9a422e3ffed8687a0e52811470c555140e15a290030c05d21e3c2b472d98d5e72aea3f0f01de4a0564142f74de8349a95bae1128466019872f38814f3ac388b364ff0b4e3e014920d4548c70fd0d439e102a1dfe53b93eb841a54b17bd080fc283aa9d50a5fafdf002d50d8fac979b6ada31fd6a462405b1c885f76cd367fb3c3b440c420859facb5c5c50c35fc223ac47f31c42198b6284c399b206e82a71741c8fc721b3a342a946fd5296ee9f9f9dbe7977f166ff303c08634a93c0c35705fae018ae6c572be6af3ecea67eb4533346b1532be8e7f5ac2bc8a4f6225fe769ca94592b282e7b90ebda31b310c266f7a54826708d309002e17a62f73991a3110e805b6ca8d0156378ceea7d6618d7ad59b874c8144bd180c35ae7f4101bd9364b2681dba3f0df1c35bd928389cfa19eeae56dd6ea068b6e54461457f6be4b2ac75a9f01160a6a7231cbb28447d6b4fe672d9b6c3d2bda2ce801087e503834da3debcfcb3dfdb2cad377dce4cd9cf6dabe2dce60547932350e9ac383174da3165d1aa23219f0ee2f6d8e59cd35ddce59e61e37b76a4c9e767bcc33a3e07ceb9df69bd0d1c14f4b7d75266e58c24d106439f9ce6a5ba5796ad778c81a5a82e14f4eb19f57ac12d81a12ae09e4d0e25fc398530c237e83a250151a198967d84ad1ac67ea9d79f63f70709f3bc67d23c13dcf101f3bb6359cee6670ebef31ba0d947737b88d764fb1fd14db4fb10d2bc776e2153dba43fa5c8e7481752e4c161523e889264cef17bf76f1af7bd3b6f7455be901932d9b0a553dd1dec9989d97a71e2e660f96a250e7b6f233cc13986de42e856ebdceb5bdd8f50d69ad56b5392e6249a2214305b1cc15b02491631c54a9a997d66ec313350d973ba25199ed2aaab5193930293a17f0e1f214c6310a205321042c046dd9405fc17537bb838d97c741c5c655f5b05f156c41e706e3cd036d538a9679edda35c2768abe3713cb6ddc9b1e985d36f2e35db55fd3557df92b5271da5d4f8abfb6c4762f078f90ccd1f36af2ce1351f7b36354cbabc6ac64edb9a6a80f9b32db92d765bfbbe3b4eb8ad1e50796d57285f3c945905b61bc9bee08ea1ef34c5b54607ba06be8fac4b736df792b1ead56de1392602873b101adce0ae159de1eee1fb2c1ac0afbf075e6dcaed67dfbfd0a7460f7916246201007e66de41aa1d0ade1ef9da28aad6403ce8e17e97b6b26306489de8554e0412beedf09090c3041c2561e786dbbbf120d14ba3c3a0d5cc608752ad02517140a7ebb5cf05d42bd577d560fb7e6f15e37df6debefc259f9d81f3a8fd83787f357e0e229b772765d928bc4c089b49a79ef2becebf20703f5d1784bc6d1c96b19d5f7cb97f376c16f0f4c666db577e3a86edfdc2cddfc094561dc42155659befce943f5dadfb6b05977da9bf6fe07841055aa5c2f0000",
          ],
          {
            "accept-ranges": "bytes",
            "access-control-allow-origin": "*",
            "cache-control": "max-age=300",
            connection: "keep-alive",
            "content-encoding": "gzip",
            "content-length": "1620",
            "content-security-policy":
              "default-src 'none'; style-src 'unsafe-inline'; sandbox",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-resource-policy": "cross-origin",
            date: "Sun, 18 Jan 2026 21:26:54 GMT",
            etag: 'W/"95953d6e24040db48494283f93834fbe20833a3e5ac453b4ce40aff5530670a1"',
            expires: "Sun, 18 Jan 2026 21:31:54 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "4ec99b6d774409f93257da80bf4623b7f6905e62",
            "x-frame-options": "deny",
            "x-github-request-id": "72AC:3C3DD7:5875CB:A90BC7:696D501E",
            "x-served-by": "cache-lhr-egll1980043-LHR",
            "x-timer": "S1768771615.636896,VS0,VE114",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
        .post("/v2/user/login", { "username": "jack", "password": "p4ssW0rd" })
        .reply(
          200,
          {
            AccessToken,
          },
          {
            "access-control-allow-headers":
              "Content-Type, api_key, Authorization",
            "access-control-allow-methods": "GET, POST, DELETE, PUT",
            "access-control-allow-origin": "*",
            connection: "keep-alive",
            "content-type": "application/json",
            date: "Fri, 16 Jan 2026 14:56:10 GMT",
            server: "Jetty(9.2.9.v20150224)",
            "transfer-encoding": "chunked",
            "x-expires-after": "Fri Jan 16 15:56:10 UTC 2026",
            "x-rate-limit": "5000",
          },
        );

      nock("http://petstore.swagger.io:80", {
        encodedQueryParams: true,
        reqheaders: { Authorization: AccessToken },
      })
        .delete("/v2/user/jack")
        .reply(
          200,
          {},
          {
            "access-control-allow-headers":
              "Content-Type, api_key, Authorization",
            "access-control-allow-methods": "GET, POST, DELETE, PUT",
            "access-control-allow-origin": "*",
            connection: "keep-alive",
            "content-type": "application/json",
            date: "Fri, 16 Jan 2026 14:56:10 GMT",
            server: "Jetty(9.2.9.v20150224)",
            "transfer-encoding": "chunked",
            "x-expires-after": "Fri Jan 16 15:56:10 UTC 2026",
            "x-rate-limit": "5000",
          },
        );

      const inputFile = new Input(
        "./test/mocks/inputs/security/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-security-tests/apiKey/users-arazzo-global-security-optional-path-with-Acess-Token.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      try {
        await arazzo.runWorkflows(inputFile);
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }
    });

    it(`handles the security requirement when root level security but path is optional`, async function () {
      // nock.recorder.rec();

      const AccessToken =
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ";

      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/security/api-key/users-openapi-global-security-optional-path.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed5adf6fdb36107ef75f7150f7b002899ca6d91ef2b4346d8760413b2c29b6212b50463e5b6c2552234f71bcc0fffb404ab229ca92edd8695c342f4ecc1fc7bbe3771f7947dff5000299a160190f8e2178191e842f833dd31ac934930205e9e018ee7a0000818e624cd9bcc10c53c8083f68544e2b4040930c8d4479fd1923b222cb9e4cc90c1571d4b5190041ae510996a2d7ee48d3a4b818054ee774cf9530e44ad3bb8d44246c530998329edc7f7ac6b41e4b35d840422cc506fa9b6db82046b9bf418e0c2e0847a882bd7af750aa945139e0e5a1df3d401d299e1197c28c31a8817225579bd9ff8e5ec16deafb3428b162e5cc0554d3679383eda09377ecc82aeef8f9a8dbe54fc87f42feb6916f0c3ab50c3dd8b90058a2b6eed49b29c526aeda9c306d68dc6a65979d8b2d5d6a6bb7b51ed25a63a513acaed3ba1d687071625df408de6b25b365c6f9e069a5b43505b512db9a72eeb7659e9056925b57ce42aa5b534807e1ad0df806e9ad4c7b1eae6b406b925f2bfd2de7947339e26217eea9f73ae93a8c4b8c617fa0cea4d0b8b9812751845a5fca2f28b6a5e1edbe6284fb094f392d56b0425963ea5ffb6f6e33ae50ef9f0ca9ed2657d7a6beed8dbd6a9bd573e6061aa35c719a5c98a4a7e6a3e024a7582afe1f2b81bd886233fe1bd638b6026d7db24bc23646626403c70bbdead3aa15703194f37c8c382556e6ef489aa442b011511ae005df65cc35700d0c344bb30441a3ba4105b3b9c5f710e06f9943c4040cb91880cc0952d3cdaecdbf1763361aa1024670151365c7fdbe2e9a422e3ffed8687a0e52811470c555140e15a290030c05d21e3c2b472d98d5e72aea3f0f01de4a0564142f74de8349a95bae1128466019872f38814f3ac388b364ff0b4e3e014920d4548c70fd0d439e102a1dfe53b93eb841a54b17bd080fc283aa9d50a5fafdf002d50d8fac979b6ada31fd6a462405b1c885f76cd367fb3c3b440c420859facb5c5c50c35fc223ac47f31c42198b6284c399b206e82a71741c8fc721b3a342a946fd5296ee9f9f9dbe7977f166ff303c08634a93c0c35705fae018ae6c572be6af3ecea67eb4533346b1532be8e7f5ac2bc8a4f6225fe769ca94592b282e7b90ebda31b310c266f7a54826708d309002e17a62f73991a3110e805b6ca8d0156378ceea7d6618d7ad59b874c8144bd180c35ae7f4101bd9364b2681dba3f0df1c35bd928389cfa19eeae56dd6ea068b6e54461457f6be4b2ac75a9f01160a6a7231cbb28447d6b4fe672d9b6c3d2bda2ce801087e503834da3debcfcb3dfdb2cad377dce4cd9cf6dabe2dce60547932350e9ac383174da3165d1aa23219f0ee2f6d8e59cd35ddce59e61e37b76a4c9e767bcc33a3e07ceb9df69bd0d1c14f4b7d75266e58c24d106439f9ce6a5ba5796ad778c81a5a82e14f4eb19f57ac12d81a12ae09e4d0e25fc398530c237e83a250151a198967d84ad1ac67ea9d79f63f70709f3bc67d23c13dcf101f3bb6359cee6670ebef31ba0d947737b88d764fb1fd14db4fb10d2bc776e2153dba43fa5c8e7481752e4c161523e889264cef17bf76f1af7bd3b6f7455be901932d9b0a553dd1dec9989d97a71e2e660f96a250e7b6f233cc13986de42e856ebdceb5bdd8f50d69ad56b5392e6249a2214305b1cc15b02491631c54a9a997d66ec313350d973ba25199ed2aaab5193930293a17f0e1f214c6310a205321042c046dd9405fc17537bb838d97c741c5c655f5b05f156c41e706e3cd036d538a9679edda35c2768abe3713cb6ddc9b1e985d36f2e35db55fd3557df92b5271da5d4f8abfb6c4762f078f90ccd1f36af2ce1351f7b36354cbabc6ac64edb9a6a80f9b32db92d765bfbbe3b4eb8ad1e50796d57285f3c945905b61bc9bee08ea1ef34c5b54607ba06be8fac4b736df792b1ead56de1392602873b101adce0ae159de1eee1fb2c1ac0afbf075e6dcaed67dfbfd0a7460f7916246201007e66de41aa1d0ade1ef9da28aad6403ce8e17e97b6b26306489de8554e0412beedf09090c3041c2561e786dbbbf120d14ba3c3a0d5cc608752ad02517140a7ebb5cf05d42bd577d560fb7e6f15e37df6debefc259f9d81f3a8fd83787f357e0e229b772765d928bc4c089b49a79ef2becebf20703f5d1784bc6d1c96b19d5f7cb97f376c16f0f4c666db577e3a86edfdc2cddfc094561dc42155659befce943f5dadfb6b05977da9bf6fe07841055aa5c2f0000",
          ],
          {
            "accept-ranges": "bytes",
            "access-control-allow-origin": "*",
            "cache-control": "max-age=300",
            connection: "keep-alive",
            "content-encoding": "gzip",
            "content-length": "1620",
            "content-security-policy":
              "default-src 'none'; style-src 'unsafe-inline'; sandbox",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-resource-policy": "cross-origin",
            date: "Sun, 18 Jan 2026 21:26:54 GMT",
            etag: 'W/"95953d6e24040db48494283f93834fbe20833a3e5ac453b4ce40aff5530670a1"',
            expires: "Sun, 18 Jan 2026 21:31:54 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "4ec99b6d774409f93257da80bf4623b7f6905e62",
            "x-frame-options": "deny",
            "x-github-request-id": "72AC:3C3DD7:5875CB:A90BC7:696D501E",
            "x-served-by": "cache-lhr-egll1980043-LHR",
            "x-timer": "S1768771615.636896,VS0,VE114",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
        .post("/v2/user/login", { "username": "jack", "password": "p4ssW0rd" })
        .reply(
          200,
          {
            AccessToken,
          },
          {
            "access-control-allow-headers":
              "Content-Type, api_key, Authorization",
            "access-control-allow-methods": "GET, POST, DELETE, PUT",
            "access-control-allow-origin": "*",
            connection: "keep-alive",
            "content-type": "application/json",
            date: "Fri, 16 Jan 2026 14:56:10 GMT",
            server: "Jetty(9.2.9.v20150224)",
            "transfer-encoding": "chunked",
            "x-expires-after": "Fri Jan 16 15:56:10 UTC 2026",
            "x-rate-limit": "5000",
          },
        );

      nock("http://petstore.swagger.io:80", {
        encodedQueryParams: true,
        badheaders: ["Authorization"],
      })
        .get("/v2/user/jack")
        .reply(
          200,
          {},
          {
            "access-control-allow-headers":
              "Content-Type, api_key, Authorization",
            "access-control-allow-methods": "GET, POST, DELETE, PUT",
            "access-control-allow-origin": "*",
            connection: "keep-alive",
            "content-type": "application/json",
            date: "Fri, 16 Jan 2026 14:56:10 GMT",
            server: "Jetty(9.2.9.v20150224)",
            "transfer-encoding": "chunked",
            "x-expires-after": "Fri Jan 16 15:56:10 UTC 2026",
            "x-rate-limit": "5000",
          },
        );

      const inputFile = new Input(
        "./test/mocks/inputs/security/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-security-tests/apiKey/users-arazzo-global-security-optional-path.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      try {
        await arazzo.runWorkflows(inputFile);
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }
    });

    it(`handles the security requirement when defined at root level only`, async function () {
      const AccessToken =
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ";

      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/security/api-key/users-openapi-global-security.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed5a516fdb36107ef7af38a87b58814476d36e0f795a9ab643b0a01d9614db901528239d2db612a991a7385e91ff3e90926c8ab2643b4e1a17cd8b138be2f1eef8ddc7bba3bf0c000299a360390f0e21781e8ec2e7c19e791ac92c970205e9e010be0c0000021d2598b1c503f39a4246f85ea3729e020434cbd14894979f30222bb21ac995cc511147dd980110141a9560197acf1d699a141793c019bcd973258cb9d2f4762b1129db5602668ca7b79f9e33ada752c55b4848a4d8427fb30d67c4a8f037c891c105e10455b0d71c1e4b9531aa5e787ee00fc7a823c573e25298770c6aa05ac9d566febfa357709df93e0d2aac58390b01f5f4f9e4e06ed0c97b76641d77fcfca2dfe58fc87f44fe5d23df18746c193adeb90058a1b6eed59b29c566aeda9c306b69dc69659f9dcb2d5d696bbfb51ed23a63a517acaed3fa1d687071645df400deeb24b355c6f9e0e9a4b40d057512db86726eb7659e904e92db54ce52aadb50480fe16d0cf816e9ad4d7b1eae1b406b935f27fdade6945339e16217f2d45b9d743dc6a5c6b03f50e75268dcdec0a32842adcfe5671477a5e1f5be6284fb29cf382d57b046596bea5ffbafaf73ae50ef1f8da92b936b6ad3dcf6d65e75cd1a3873038d51a138cdce4cd1d3f0517054502215ff8f55c05e46b139ff0d1b1c5b83b639d925611b2309b2d8f1c2a0feb46a055c8ce5a21e234ea995f93b9226a9106c44540678c1779e700d5c0303cdb23c45d0a8ae50c17c6ef93d04f85b16103101632e629005416686d9a5f9f76cca261354c0082e12a2fc7038d4e5a390cb0f3fb61e3d05a9400ab8e02a0ac70a51c8184381b4074faab796cc1a72150d9f86006fa402328a973aefc1acd2add0089420b09cc3679cc1479d63c459baff19671f8124106a2adf70fd0d639e122a1dfe53bb3eb842a52b173d0b47e1a87e4ea832fd6e7c86ea8a47d6cb6d35ed3bc37a462405b1c885f77cd3e7fb3c3f440c420859f6cb425cd0c05fca236c46f30242398b128483b9b206e82a75749c4ea721b36f85524d86952c3d3c3d397efdf6ecf5fe41380a13cad2c0c3570dfae0102eec5027e62f3ecca77eb053734689d32b1816cdaa2bc8a5f6225f1759c694592b28933d2874e398590a61b3fb52a433b84488a540b89cd97d4ee5648231708b0d15ba620ccf59bd4f0ce3ba3d0b970e9962191a7058eb9c116213fbcc9249e08e28fcb7404d2f653cf339d453bdca66ad6eb02ca332a2b8b2f92ea9021b63065828a8cdc52ccf531e59d3869fb46cb3f5bc69b3640420f841e1d868f764b868f70cab2ecfd0719337f366d0f56d7905a3aa93a975d01c8c9eb58d5a9634445531e0e52f5d8e59cf35fdce59e51eb7b66a4dbee9f7986746c9f9d63bdd99d08bd14f2b7d7522ae58ca4d10e405f9ceea5aa57d6a3778c81a5a81e14f4e895f57ac13d81a52ae09e4d8e25fc3945302137e85a254155a158967d85ad1ace7ea9d78f6df73709f3ac67d23c1bda8101f3ab6351cef6670ebef31ba0d947737b88d768fb1fd18db8fb10d6bc776ea353dfa43fa544e7489752e4c159520e89926cc6e17bf76f1af9b69db7cd1767ac054cba643d52cb477326617eda9fb8bd9d14a14eac2767ec6450af38ddca5d06df6b9ee2e767d433abb555d8e8b589a6ac85141220b052c4de514e3ba34f5cadabbf04443c3d58e687566fb9a6a5d46c6a644e702de9f1fc3344101643a8480a5a03b36d05770d3cdee61e3d57150b371dd3d1cd60d5bd085c178fb40db96a265d148bb26d84dd1b76662791779d33db3cb567efc52efd7cdbabefc15a93ced2e67e55fdb62bb95832748e6e879397beb8968fad931aae35663deb2f65c53f6874d9b6dc5edb23fdc73daf5c5e8ea03cb6ab9c6f9b423d87ac8936b591bed9e92cdcde96d6356f3567cb15e134f4882b12cc416e4396f77e7457750bfcfe379aff5febbc9855dad3fc7fd0a416ff79112462010637303728950ead6f2f73743086be7fcce8e97457a67be3f66a9de8584ff5efbeadf0909c4982261270fbcb2c35f89064a5d1e9c06ce13842615e88a0b4a05bf5d2ef82ea13ea83febeb597345afdbb7b3cddbdfbcbad20f9dabeaab83c55d6f79615b3bbb29c94562e0445ac3bc7735f675f5b380e6db784dc6d1e92b1935f7cb97f366c92f0c4cfd6cb577e3a869dfc22cddfea14469dc5215d659befa81437da7dfb5b059f7667033f81f76254c19422f0000",
          ],
          {
            "accept-ranges": "bytes",
            "access-control-allow-origin": "*",
            "cache-control": "max-age=300",
            connection: "keep-alive",
            "content-encoding": "gzip",
            "content-length": "1613",
            "content-security-policy":
              "default-src 'none'; style-src 'unsafe-inline'; sandbox",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-resource-policy": "cross-origin",
            date: "Sun, 18 Jan 2026 21:21:31 GMT",
            etag: 'W/"d14f5678d10798ab5e330ca1b7a73e4027509d8b81a6f165a5451a1cb7179bfb"',
            expires: "Sun, 18 Jan 2026 21:26:31 GMT",
            "source-age": "171",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "HIT",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "e3ea31cd43bbf99f20fa2d0e01bc333aa5d17a51",
            "x-frame-options": "deny",
            "x-github-request-id": "74B6:3E4FC0:5A0C8D:AA73B4:696D4E2D",
            "x-served-by": "cache-lhr-egll1980026-LHR",
            "x-timer": "S1768771292.943904,VS0,VE1",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
        .post("/v2/user/login", { "username": "jack", "password": "p4ssW0rd" })
        .reply(
          200,
          {
            AccessToken,
          },
          {
            "access-control-allow-headers":
              "Content-Type, api_key, Authorization",
            "access-control-allow-methods": "GET, POST, DELETE, PUT",
            "access-control-allow-origin": "*",
            connection: "keep-alive",
            "content-type": "application/json",
            date: "Fri, 16 Jan 2026 14:56:10 GMT",
            server: "Jetty(9.2.9.v20150224)",
            "transfer-encoding": "chunked",
            "x-expires-after": "Fri Jan 16 15:56:10 UTC 2026",
            "x-rate-limit": "5000",
          },
        );

      nock("http://petstore.swagger.io:80", {
        encodedQueryParams: true,
        reqheaders: { Authorization: AccessToken },
      })
        .delete("/v2/user/jack")
        .reply(
          200,
          {},
          {
            "access-control-allow-headers":
              "Content-Type, api_key, Authorization",
            "access-control-allow-methods": "GET, POST, DELETE, PUT",
            "access-control-allow-origin": "*",
            connection: "keep-alive",
            "content-type": "application/json",
            date: "Fri, 16 Jan 2026 14:56:10 GMT",
            server: "Jetty(9.2.9.v20150224)",
            "transfer-encoding": "chunked",
            "x-expires-after": "Fri Jan 16 15:56:10 UTC 2026",
            "x-rate-limit": "5000",
          },
        );

      const inputFile = new Input(
        "./test/mocks/inputs/security/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-security-tests/apiKey/users-arazzo-global-security.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      try {
        await arazzo.runWorkflows(inputFile);
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }
    });

    it(`handles the security requirement when defined at path level only`, async function () {
      const AccessToken =
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ";

      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/security/api-key/users-openapi-path-security-only.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed5add6fdb36107ff75f7150f7b002899ca6d91ef2b4346d8760413b2c29b6212b50463a5b6c255223a9385ee0ff7d20f56192b2643b761a6fcd8b13f3e3789f3fde1d7d370008788e8ce4343886e0657810be0cf6f468c4b39c33644a06c7703700000864946046e6037a9940a2f08344618d02046a9aa3a6c8af3f63a40cc96a26173c47a1284a6707405048148c64e88d5bd4a412948d036b72b66753185121d5bb8d48a464530a98119ade7f7b4ea49c70116f4021e16c03feb5192e1451856f208b06650ac728823d777ac4454654b5e0e5a13f1da38c04cd15e54cafd15e03d5493637cdff165fc16de6eb34a87cc5d09913a8b7379b83ed7827edb1c82aeaf8f1a85fe54f9effe4f9dbf67c2dd0a941e878e7026009dbb2976f220499da6c5385598be34e29fbe45c2ce95259fba5f53cad33567a9dd5565abf02b55f9c18153d82f63ac16c9970bef37442da9a843a816d4d3af7339947a413e4d6a5b310ead624d203786b3b7c0bf456863dcfaf1d476b835f27fc2dc794733ea66c17f2d47bdd743dc2a55ab0df50e69c49dc5cc0932842292ff91764dbe2f0765f1085fb29cda85acc60ed65adad7fecbfb9cda940b97f32525d999ccb8d6bf696adba760dacbd81c4a810544d2f74d1e3e828382954c205fd87548ebd086273fa0b3a185b3badbbd9066113230992d8d2c2a0fe346c05948df8bc1e5354a586e6afa8a4e202c144442580177c9709954025109024cb530489e20605347bcbef21c09fbc808830185116032f14647a9a5ceb7f2f26643c460144c155a2547e3c1cca7228a4fce3f7ada1e7c0057006575444e14820321e63c850edc1b36ad5825d432aa2e1f310e02d17a034e325cf7b30ad782b24824a10484ee10b4ee193cc31a224ddff82d34fa0382894aa5c61eb1b4634552864f857adfae00685ac54f4223c080fea71852293ef4717286e6864b4dc66d3ac19d63b22ce14896cf76e8cded8b9b944b4872824d94f737281e37f298dd08de6b90be5244a100e1b66b5a38bd4e271329984c4ac0ab9180f2b5a72787e76fae6ddc59bfdc3f0204c5496069e7fe5442556c13f2cdcd229c8b9f4c257165946844e3482326383423a77c5423fd426e42c9dc23542cc19c2f5d4182be5e331c6408d81456893d160656c78a661d36e3cd8984604c9505b383886ab8fd68c226333661021b06704fe5da054af783cf581d063bd4a490d6fb0282dd2a4a83049ab12053a73da3b90a936a0923c4f6964441b7e96bc0db94de765c10c40f09dc091e6eed970deb31956ad9aa1a5266fe76cd0f56d711922aaeba5755b1c1ebc680bb5e8e68faa8cde4b42ba14b39a6afa95b34c3d7681d4da3cebd798274609dc463bdde9ccd1c10f4b7575c66e484a7510e485f295d5754afbea75c0c4085a39c3ef54257e71b04a604b48a954c047c6ff254ca84a604c6f9095ac42abacf0045b299a65c3de9927ff0307f7b925dc7f24b8e765de63c7b684d3dd0c6ef92d46b776e5dd0d6ecddd536c3fc5f6536cc3cab19d7a9d8bfe903ee76359fa3a65ba144a10e4542accee17bfe6f0af9b699b7cd1b46b4097bcbacde456cb3b19b3f31ed3c3c5ecc1522f948569df8c8a141a43ee52e8bacdaaedc5ae2f4867cba94b7111495309390a48782180a4299f605c97a65e59bb0d4d381c2e5744abbddad719eb1232d6253a65f0e1f21426093250bacd075812dab2803e83eb1abb078d97c7418dc6750b7058775d4116dac7db17daa610cd0b27ed1a633744df1b89f936f2a60746978df47857db6bb6aa2e7f4655de76d7d3f2afe993dd4bc16354faea79357de79170f56c09d5f134d1f49d3dd5944d5edd665bf244ec4ff7dc767d31bafcc2325cae703fd91e54f7c6b52eee663be2758f79a72d6ab03d501aba3ef0ad8d77de8947abb5f7185730e205db00569b6e765e7487fb873c6ebab00fdf672ecc69fdd9ef57800363479510050c31d60f1cd708256f2d7def14546ca51ab02c5e96ef9d95c088a472174a8107edb87f232010638a0a3b71e0b599fe4a3050f2f2e830709920b850202b2c2819dc6d2c70d286f633fad547d83497f87f47c6a0fe2c1f6bcb07fbb9eb35c9b2fb169c570ffca1f5707d73387ff9358a6d94ed52b21d37b002d311ef7d1d2ab2fa9180bb1a6f955674fa9a47aebd7c3a6f17fcde4017e2867b3bec5cf9e662c9f6cf264ae116b2b0caf1d5cf1dea17feae83f5b9b3c16cf02f85bd7bfe502f0000",
          ],
          {
            "accept-ranges": "bytes",
            "access-control-allow-origin": "*",
            "cache-control": "max-age=300",
            connection: "keep-alive",
            "content-encoding": "gzip",
            "content-length": "1619",
            "content-security-policy":
              "default-src 'none'; style-src 'unsafe-inline'; sandbox",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-resource-policy": "cross-origin",
            date: "Sun, 18 Jan 2026 21:16:25 GMT",
            etag: 'W/"438dd867a8e48c644c89fe4d6eaaa6b3730e6466c07499e3478baf19fc3f3722"',
            expires: "Sun, 18 Jan 2026 21:21:25 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "d9fc41bfb87eed38c02b5757413fcb0b11c58f7d",
            "x-frame-options": "deny",
            "x-github-request-id": "7582:1D7CA:589E3E:A8F655:696D4DA8",
            "x-served-by": "cache-lhr-egll1980085-LHR",
            "x-timer": "S1768770985.179905,VS0,VE126",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
        .post("/v2/user/login", { "username": "jack", "password": "p4ssW0rd" })
        .reply(
          200,
          {
            AccessToken,
          },
          {
            "access-control-allow-headers":
              "Content-Type, api_key, Authorization",
            "access-control-allow-methods": "GET, POST, DELETE, PUT",
            "access-control-allow-origin": "*",
            connection: "keep-alive",
            "content-type": "application/json",
            date: "Fri, 16 Jan 2026 14:56:10 GMT",
            server: "Jetty(9.2.9.v20150224)",
            "transfer-encoding": "chunked",
            "x-expires-after": "Fri Jan 16 15:56:10 UTC 2026",
            "x-rate-limit": "5000",
          },
        );

      nock("http://petstore.swagger.io:80", {
        encodedQueryParams: true,
        reqheaders: { Authorization: AccessToken },
      })
        .delete("/v2/user/jack")
        .reply(
          200,
          {},
          {
            "access-control-allow-headers":
              "Content-Type, api_key, Authorization",
            "access-control-allow-methods": "GET, POST, DELETE, PUT",
            "access-control-allow-origin": "*",
            connection: "keep-alive",
            "content-type": "application/json",
            date: "Fri, 16 Jan 2026 14:56:10 GMT",
            server: "Jetty(9.2.9.v20150224)",
            "transfer-encoding": "chunked",
            "x-expires-after": "Fri Jan 16 15:56:10 UTC 2026",
            "x-rate-limit": "5000",
          },
        );

      const inputFile = new Input(
        "./test/mocks/inputs/security/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-security-tests/apiKey/users-arazzo-path-security-only.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      try {
        await arazzo.runWorkflows(inputFile);
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }
    });

    it(`handles the security requirements`, async function () {
      const AccessToken =
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ";

      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/security/api-key/users-openapi.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed5a5b6fdb36147ecfaf3850f7b00289eca6dd1ef2b4346d8760415b2c29b6212b50463ab6d84aa4461ec5f18afcf781d4c51265c9d724ee9a3c38b6481e9ecb773e9247fcba07e0c914054bb97704de737fe83ff7f6cdd34026a91428487b47f0750f00c0d34184099b3d30dd1432c20f1a55ed298047d3148d4479f51903b2228b9654c9141571d48d11005ea6510996a0f3bc264d93e262ecd51a6ff7eb12465c697abb9188986d2a0113c6e3f587a74ceb8954e10612222936d0df84e19c18656e806a32b8201ca3f2f69bcd23a912464587e7876e73883a503c252e85e9635003c54c756daaef35bdbc9bc4f5a95760c5ca990928875783bdeda093f744641977fcfca2dfe58fc87f44feb6916f0c3ab10c1dee5c022c505bf7eacd9462d3bada9c306969dc69659f9df32d5d686bbfb50ed23a73a517ac75a7f53bd0e0e2d8bae801bcd749668b8c73c1d349692b0aea24b615e5ac1732474827c9ad2a672ed5ad28a487f056067c8bf496a63d07d70da0b5c9af93fe1673ca991c73b10bfbd4b556ba1ee36263d8efa85329346e6ee07110a0d617f20b8a6d697873a018e141cc134ef3152c51d61afae7c1eb9b942bd407c723eadac935b56986bd15abae517bb5b19ec620539ca6e7e6d0d3f091779c512415ff9715c09e47b129ff0d1b1c5b82b639b84ec23647226461cd0b7be5a755cbe3622467e731e2145b99ef913449856033a230c049be8b886be01a186896a4318246758d0aaab1f96f1fe02f9941c0048cb80841660489696657e6ebf9848dc7a880115c4644e9d160a0f3473e971f7f6c3d7a0a52811470c955e08f14a29021fa02691f9e14bde68c1a70150c9efa006fa402328ae73aefc3b4d02dd3081421b094c3179cc2279d62c0597cf005a79f8024106aca7bd4fd0d231e132aedff5dbadebb46a50b173df387feb07c4ea812fd6e748eea9a07d6cb6d356d9f41392290825850877715f42aced522621042c8925f66e2bc06fe621e60339b67104a5910211c56ca1aa0abb8a6e36432f199ede54b351e14b2f4e0ecf4e4f5dbf3d70787fed08f28893d075f25e8bd23b8b44d9d98bffc580dfd6887a68ca25aad6090354f5d5e2ab593f93a4b12a6cc5c5ebed9834c379699b91036d197229ec215422805c2d5d4c63996e33186c02d36945f176378ceea7d6a18b75eb3a8d321532c41030e6b5dad85d858570ea9f1ca8cfbeabd15fe93a1a697329cbabcea9853ec70adbe306f9765447165f7c0a4326cb419b0a1a0363fb3348d7960cd1d7cd6b2cde05521674e0b80f783c291d1eec96056021a14959f41cd75cec8dbbdae5ff34f35aa58ad5a8bcfe1f059dba8791b89a03820387b9a2ec72ce79a7ee72c724ffdbcd51a7cdbef31c78c7c1db0dee9de1dbd18feb4d057a7e29ac5dc24469a91ebacae59da2b79839baca10518fee014b9678d65925d43cc35811c59fc6b98708a60ccaf51e4aa42eb94e218b65486eb4abd53c7fead257c8b33f33f272a1dfce9fa7b3d2639ab79f21b6192d911f5a18944c3c96e3289fe1ea9c440797799c468f748248f44f248243b4a24b153e2e9e78f3339d639d6b93067c608414f3561b21e59d8c91ffe5c6177c7b6d605a65e606a74cd52c34ee6f1ac407777793c5c884c9dd9dad7288ba10aee2ea573b3d2b7bd7c760de9acd775392e6071ac21450591cc14b03896130ccbc3b973b0df86271a1a2e7644ab36dd5756ec323234450a2ee0c3c5094c221440a6460a980bdab281ae82ab06bb87a117e741c9d065fd745096ac416706e3ed456e53da965963df37c66eda5e9b9de537b771bb632adb28685f4b70dc2e1bb85f91f2e5f66a9affb715cdb5a2394632ebdccbe95b474433a8dde1288ba9d51b02c7357939de543517bccc779b7b96d63e4258bc3a5a2d97580cef1bc81dd0b957203fe49a3caf1c7a475bebd5897b65be76667cb15c3156488291ccc406cb42f52a23cdba19e4431a5635f3bb7f5390d9d9fa77f4f7c030368e14310281189ab75b5708b96e2d7f7f77ecb3d5fa471d5e79fda3f3d83462b1de8573d39dbe8cf94e1827c418093b49e7956dbe27cec9757970ceb988109abca30be2c9157c249e4df6efffefbcda2b3fcb4b05e662896edf2968de59488b8b287eed82c5f5e1ec86427ecda011d9d6cd88468abae6bd2b134d1797599abdf1868ca3e3573268c6cb95f366cebd1853f3b0dad793b669dfcc2cddbede931b37578565a62faee5943751ba2636f3deeeddfe076e0f2055f7310000",
          ],
          {
            "accept-ranges": "bytes",
            "access-control-allow-origin": "*",
            "cache-control": "max-age=300",
            connection: "keep-alive",
            "content-encoding": "gzip",
            "content-length": "1638",
            "content-security-policy":
              "default-src 'none'; style-src 'unsafe-inline'; sandbox",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-resource-policy": "cross-origin",
            date: "Fri, 16 Jan 2026 14:56:10 GMT",
            etag: 'W/"d38379461bc9571f3e57ed61b7c4f2b6d189a3b3cf79f0449c1fde6e9379637e"',
            expires: "Fri, 16 Jan 2026 15:01:10 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "7603679b8209bdb71a3d239a3d73658ad77ba4b5",
            "x-frame-options": "deny",
            "x-github-request-id": "8D3C:FF71D:A8864:12273A:696A5188",
            "x-served-by": "cache-lhr-egll1980031-LHR",
            "x-timer": "S1768575370.950328,VS0,VE154",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
        .post("/v2/user/login", { "username": "jack", "password": "p4ssW0rd" })
        .reply(
          200,
          {
            AccessToken,
          },
          {
            "access-control-allow-headers":
              "Content-Type, api_key, Authorization",
            "access-control-allow-methods": "GET, POST, DELETE, PUT",
            "access-control-allow-origin": "*",
            connection: "keep-alive",
            "content-type": "application/json",
            date: "Fri, 16 Jan 2026 14:56:10 GMT",
            server: "Jetty(9.2.9.v20150224)",
            "transfer-encoding": "chunked",
            "x-expires-after": "Fri Jan 16 15:56:10 UTC 2026",
            "x-rate-limit": "5000",
          },
        );

      nock("http://petstore.swagger.io:80", {
        encodedQueryParams: true,
        reqheaders: { Authorization: AccessToken },
      })
        .delete("/v2/user/jack")
        .reply(
          200,
          {},
          {
            "access-control-allow-headers":
              "Content-Type, api_key, Authorization",
            "access-control-allow-methods": "GET, POST, DELETE, PUT",
            "access-control-allow-origin": "*",
            connection: "keep-alive",
            "content-type": "application/json",
            date: "Fri, 16 Jan 2026 14:56:10 GMT",
            server: "Jetty(9.2.9.v20150224)",
            "transfer-encoding": "chunked",
            "x-expires-after": "Fri Jan 16 15:56:10 UTC 2026",
            "x-rate-limit": "5000",
          },
        );

      const inputFile = new Input(
        "./test/mocks/inputs/security/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-security-tests/apiKey/users-arazzo.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      try {
        await arazzo.runWorkflows(inputFile);
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }
    });
  });

  describe(`http`, function () {
    describe(`basic`, function () {
      it(`handles the security requirements when having to pass through more than one security requirement`, async function () {
        // nock.recorder.rec();
        const AccessToken =
          "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ";

        nock("https://raw.githubusercontent.com:443", {
          encodedQueryParams: true,
        })
          .get(
            "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/security/http/basic/users-openapi-path-security-and-apiKey.json",
          )
          .reply(
            200,
            [
              "1f8b0800000000000013ed5a5b6fdb36147ef7af3850f7b002b1eca6dd1ef2b4344d8760415b2c29b6212b505a3ab6d84aa4465271bc22ff7d2075314559f23589d7a40f69228a87e7f29d8f3c47fcd603f0788a8ca4d43b02efa53ff45f7a07fa69c0939433644a7a47f0ad0700e0c920c284cc1fe8d70412851f250aeb2980a766296a897cf4050365441623a9e0290a4551d66600789944c14882ce734b9a5482b289670dde1ed812c65448f56e2b1131d956022684c69b4f4f8994532ec22d24449c6da1bf0ec385222a730364c9a04ce1048577501f1e73911055bcf0f2d01d0e510682a68a72a6dfd1a88162255b9bea774b2fef26717dea15583172e602cae9d5646f37e8a41d1159c51d3fbfea76f913f29f90bf6be46b834e0c43877b97004bd4969d7a1321c8cc569b2a4c1a1ab75ad965e7624b97dada6dad83b4d65ce904abedb46e076a5c1c1b173d80f75ac96c99712e785a296d4d41adc4b6a69ccd42e6086925b975e52ca4ba35857410deda806f90decab4e7e0ba06b426f9b5d2df724e39e713caf6e19cbad14ed7615cac0dfb1d65ca99c4ed0d3c0e0294f2927f45b62b0d6ffa8228ecc734a16ab18225ca1a53ffec9fdea454a0ec1f8f55db49aeae4d3dec8d58b5cdea59733d894126a89a5de8a2a7e623ef38531117f45f52007b81e448a9d476b6299dccc888481a3415bde99394f6bf621b65a7f437ac71769904f38936a19b7c8b908496477be54fb3aa47d998cf6b3b45556ce47d402515170826bb0a6738897c195109540201499234469028ae51403537ffdb07f88b6710100663ca42e09982440f9391fef5624a26131440145c697f1d0d06327fe453fee9c7c6a3e7c0057006575404fe5820321ea2cf501dc0b3e2ad05b306540483e73ec05b2e4069c5739d0f6056e896490415219094c2579cc16799624049ac9dfa1914078552e56fd88187318d150ae9ffcd4a375da390858b5ef8437f583e572812f97e7c81e29a06153eea6a9a7706e58c803345023b55aa805771ae36248d0e8524f9652eceab6139a601d699a192769c92204238ac94d54923624bc7e974ea13f396cfc56450c89283f3b393d37717a7fd437fe8472a893d075f650279477065865af3e7ea5335f593999a1215597d874156afe0bc944b874564962444e8b5bcfce00899ac6d590b21aca3cf593c831142c819c26866e21cf3c90443a0061bc2b7c568ce347a9f69f6b6fb1f36b5124112d4e030d659238a4ccc33434c9e3d22f09f0ca57acdc399cbc78eeac5c9d8e8068b4e675a1415e6ecac4486b5310d2c64aac9eb244d631a18d3065f246f327fd5005a3002e0fd2070acb57b3698b78e0645c76860b9c99979db6bfb6b7135248a5daeb1691d0e5f348d5a7400098ac2c2390bb5396635d7743b67997bec3aad31f9b6db638e1939e71befb49faa5e0d7f5aeaab33764d62aa9320cd94ebacb6559a27801a0f19430b30fc4155e4d628ab24b684984a057c6cf02f614a5504137a8d2c57151ad58d63d84ad92c2bf5ce1cfb374aee0617e6ff9c08b4f0a2ebdbcd58e3dcf2daff8435e665ec4393868493fd640df918694343797f59436bf7441a4fa4f1441af0f0a4113b2d9f6eae38e71399639d325df74508722615269b118359fc7e6b0373c2357d2ed0f5bdeecfe9913dcfd97973eeee7276b8148532337daf71164315c87d4add7a976f77b9eb1ad2daab6b735c40e258428a02229e092071cca71896c5b45388efc213350d973ba2d197ee6a29b61919eaa60265f0f1f204a6113250ba3f0a980bdab181ae82eb06bb838d97e741c9c665ef7450b6ab41661ae3cd0d6d5b8ae659ed3c37c1768ade9889f95e1fc8ee98b6b60ad0b71208b7ab06e95754f9363a9ae5ff9b6ee346919ba0d27bdaebd93b47443d80ede1281b9dd59700c73579ab5c771c977cb477873bb6d1aee45fbe131a2d57d8f8ee12b42d30b957d03ee45ebba8557947c7e3f509796d1e76567cb55aa3947105639eb12de8befaa49066ed6cf1310dab7ef6dd77ec33b35af7a9fc1ed8c4c451454401430cf557a61142ae5bc3dfdf35d3ecb45f614329ef57b4963e6312cb7da87deef4a3c8236197106354d84a306fccf03df14baecb83f3cb658450e71859904caee0632319c71efbbac53607f4ef3bc17ae5cff28bbebed5219b1ff4eb1706d2e216886fdd6eb83e9c5f0fc8bff19721ae4bb2f1ef59f95d33ef7d9971b2b849527f1b6f947674fc8607f578b972de2eb894a21b18467b3b7bebf6cdcd92cdbb35b9710b555865f9e24e4c790da46d61bdee6defb6f71f0de0ff46c1310000",
            ],
            {
              "accept-ranges": "bytes",
              "access-control-allow-origin": "*",
              "cache-control": "max-age=300",
              connection: "keep-alive",
              "content-encoding": "gzip",
              "content-length": "1665",
              "content-security-policy":
                "default-src 'none'; style-src 'unsafe-inline'; sandbox",
              "content-type": "text/plain; charset=utf-8",
              "cross-origin-resource-policy": "cross-origin",
              date: "Sun, 18 Jan 2026 21:46:53 GMT",
              etag: 'W/"660883ee6d345d13bf0623a928540d669a19ecacdbded0c8f021d2a6f214f27b"',
              expires: "Sun, 18 Jan 2026 21:51:53 GMT",
              "source-age": "0",
              "strict-transport-security": "max-age=31536000",
              vary: "Authorization,Accept-Encoding",
              via: "1.1 varnish",
              "x-cache": "MISS",
              "x-cache-hits": "0",
              "x-content-type-options": "nosniff",
              "x-fastly-request-id": "057015b17fe7a741699b3cf506681e683e97e884",
              "x-frame-options": "deny",
              "x-github-request-id": "A353:3933A7:58F58B:A9FBFF:696D54CC",
              "x-served-by": "cache-lhr-egll1980076-LHR",
              "x-timer": "S1768772813.357592,VS0,VE126",
              "x-xss-protection": "1; mode=block",
            },
          );

        nock("http://petstore.swagger.io:80", {
          encodedQueryParams: true,
          reqheaders: {
            Authorization: `Basic amFjazpwNHNzVzByZA==`,
            "x-api-key": AccessToken,
          },
        })
          .delete("/v2/user/jack")
          .reply(
            200,
            {},
            {
              "access-control-allow-headers":
                "Content-Type, api_key, Authorization",
              "access-control-allow-methods": "GET, POST, DELETE, PUT",
              "access-control-allow-origin": "*",
              connection: "keep-alive",
              "content-type": "application/json",
              date: "Fri, 16 Jan 2026 14:56:10 GMT",
              server: "Jetty(9.2.9.v20150224)",
              "transfer-encoding": "chunked",
              "x-expires-after": "Fri Jan 16 15:56:10 UTC 2026",
              "x-rate-limit": "5000",
            },
          );

        const inputFile = new Input(
          "./test/mocks/inputs/security/input.json",
          "inputs",
        );

        const arazzo = new Arazzo(
          "./test/mocks/arazzo/openapi-security-tests/http/basic/users-arazzo-path-security-and-apiKey.json",
          "arazzo",
          { logger: logger },
          docFactory,
        );
        arazzo.setMainArazzo();

        try {
          await arazzo.runWorkflows(inputFile);
        } catch (err) {
          console.error(err);
          expect(err).to.not.be.instanceOf(Error);
        }
      });

      it(`handles the security requirements`, async function () {
        // nock.recorder.rec();
        nock("https://raw.githubusercontent.com:443", {
          encodedQueryParams: true,
        })
          .get(
            "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/security/http/basic/users-openapi.json",
          )
          .reply(
            200,
            [
              "1f8b0800000000000013ed5a4b6fdc3610beefaf18283d3480addd38690f3ed57192c2809114b583b67003842bcdae9848a44a525e6f0dfff782d46329eab14fdbdbc43938b6280ee7f1cdc7e188b703008fa7c8484abd63f05efa23ffa577a09f063c493943a6a4770cb70300004f06112664f140bf269028fc2851584f013c354f514be4e32f182823b21849054f51288ab23603c0cb240a4612749e5bd2a412944d3d6bf0eec09630a142aaf75b8988c9b612302134de7c7a4aa49c71116e2121e26c0bfd75182e1451991b204b06650aa728bc83faf0848b84a8e2859747ee7088321034559433fd8e460d142bd9da54bf5b7a793789eb53afc08a91b310504eaf267bbb4127ed89c82aeef8f955bfcb9f90ff84fc5d235f1b746a183adcbb0458a2b6ecd59b0841e6b6da5461d2d0b8d3ca3e3bdb2d5d6a6bbfb50ed23a73a517acb6d3fa1da87171625cf408deeb24b365c6b9e0e9a4b435057512db9a72360b9923a493e4d695d34a756b0ae921bcb501df20bd9569cfc1750d684df2eba4bfe59c72cea794ed439dbad14ed7635cac0dfb1d65ca99c4ed0d3c090294f2927f45b62b0d6f0e05517818d384aa76054b9435a6fe79f8f626a502e5e1c944755572756dea616fc4aa6bd6c09aeb490c3241d5fc421f7a6a3ef24e32157141ff2505b05b24474aa5b6b3cdd1c98c8c89a481b3e4a058d6a36cc217e72d45556ce6fc864a2a2e100ce20b059de4ba8ca8042a818024491a234814d728a09a9bffed03fcc533080883096521f04c41a287c958ff7a3123d3290a200aaeb40dc7c3a1cc1ff9947ffab1f1e83970019cc11515813f11888c87e8335407f0ac78ab65d6908a60f8dc0778c70528ad78aef301cc0bdd3289a022049252f88a73f82c530c28890fbfe2fc33280e0aa5cadfb08301131a2b14d2ff9b956eba46210b17bdf047fea87cae5024f2c3e402c5350daa98d5d534ef0ccb1901678a04367c2b26aa425d6d121e49a94292fcb210e7d5f015d300ebd95a493b494910211c55ca6a208bd8d271369bf9c4bce573311d16b2e4f0fcecf4edfb8bb78747fec88f54127b0ebe4a507bc77065863a317df5a99afac94c4d898aac5ec030ab9faabc944b27b365962444e8b5bcbc98834cd6b6915608ebe87316cf618c107286309e9b38c77c3ac510a8c186f06d319ac78cde679a51ed9e844d7744900435388c75d6882253f3cc9085678f08fc2743a95ef370ee72a4a37a51ad1adda0ad62d2a2a830f5ac1219d6c634b090a926d792348d69604c1b7e91bcc9c65553a66504c0fb41e0446bf76cb868e70c8b2eced0729333f36ed0f557fb0945143b4f6323391abd681ad556140445b1efd4275d8e59cd35fdce59e61efbecd4987cd7ef31c78c084998e3eeb6bbd27935fa69a9afced83589a94e823453aeb3ba5669eeca351e32861660f883aac83d37ac92d812622a15f089c1bf841955114ce935b25c55689c381cc356ca6659a977e6d8bf517237b830ffe744a083175ddf6ec61ae796d7fe27acb1385a3e36694838dd4fd690df236d6828ef2f6b68ed9e48e389349e48031e9f3462a70dd3cf15e77c2a73ac53a6cf7d11829c4b85c966c460167fd8b381a9704def09f4f95ef7ccf4c89ee7eca261767f393b5a8a4299995ed4248ba10ae43ea56ebdf3b6bbdc750de9ec9f75392e20712c21450111cf049038e6330ccbc3b47310df85276a1a2e7744a357dcd7e6eb3232d44d05cae0e3e529cc2264a074cf123017b463035d05d70d760f1b2fcf83928dcb7ee6b06c2183cc34c69b1bdab614cdb35a3d37c56e8ade9889f95e1764f74c5b5b05e8b604c2ddaa41fa1555be8d8ee7f9ffa6dbb851e4a6a8f49ef67afede11510f607738ca4667d59d775c63ca03d3715cf221dd1deed946fb927ff94e68b45c61e3bb4fd076c0e44141fb987b6d5babf29ecae3f509796d1e76567cb55aa3947105139eb12de8befaa49066dd6cf1310dab7ef6fd77ec33b35a7f55fe006c62e2a822a2802186fa2bd31821d7ade1ef6f9a6976daafb0a194f72b3a8f3e1312cb7d38fbdceb4791ef845d428c516127c1bc31c30fc42fb92e8fce2f9711429d63644132b9824f24b36a39f36de7d0a0fc597eb4d7173764f39b7dfd4e405a5cf4f0ad0b0cd7478b1b00f967fc328a754936c43d2b856be67d28934a169745ea6fe38dd28e8edff0a01e2f57cebb967b27ba4761b4b713b46edfc22cd9bc3e931bd7aac22acb17d75eca9b1e5d0beb75ef067783ff00fea2b54f38310000",
            ],
            {
              "accept-ranges": "bytes",
              "access-control-allow-origin": "*",
              "cache-control": "max-age=300",
              connection: "keep-alive",
              "content-encoding": "gzip",
              "content-length": "1633",
              "content-security-policy":
                "default-src 'none'; style-src 'unsafe-inline'; sandbox",
              "content-type": "text/plain; charset=utf-8",
              "cross-origin-resource-policy": "cross-origin",
              date: "Fri, 16 Jan 2026 15:36:07 GMT",
              etag: 'W/"bc80d42998c1966edc5486b822a6e9e7bf476b40890dc828353024564dc1a40b"',
              expires: "Fri, 16 Jan 2026 15:41:07 GMT",
              "source-age": "0",
              "strict-transport-security": "max-age=31536000",
              vary: "Authorization,Accept-Encoding",
              via: "1.1 varnish",
              "x-cache": "MISS",
              "x-cache-hits": "0",
              "x-content-type-options": "nosniff",
              "x-fastly-request-id": "8d0cf7e68ec3e2cd0e606a7cf748f4802b8c9390",
              "x-frame-options": "deny",
              "x-github-request-id": "7832:1D7CA:BB6E2:143763:696A5AE7",
              "x-served-by": "cache-lhr-egll1980097-LHR",
              "x-timer": "S1768577767.079582,VS0,VE124",
              "x-xss-protection": "1; mode=block",
            },
          );

        nock("http://petstore.swagger.io:80", {
          encodedQueryParams: true,
          reqheaders: { Authorization: `Basic amFjazpwNHNzVzByZA==` },
        })
          .delete("/v2/user/jack")
          .reply(
            200,
            {},
            {
              "access-control-allow-headers":
                "Content-Type, api_key, Authorization",
              "access-control-allow-methods": "GET, POST, DELETE, PUT",
              "access-control-allow-origin": "*",
              connection: "keep-alive",
              "content-type": "application/json",
              date: "Fri, 16 Jan 2026 14:56:10 GMT",
              server: "Jetty(9.2.9.v20150224)",
              "transfer-encoding": "chunked",
              "x-expires-after": "Fri Jan 16 15:56:10 UTC 2026",
              "x-rate-limit": "5000",
            },
          );

        const inputFile = new Input(
          "./test/mocks/inputs/security/input.json",
          "inputs",
        );

        const arazzo = new Arazzo(
          "./test/mocks/arazzo/openapi-security-tests/http/basic/users-arazzo.json",
          "arazzo",
          { logger: logger },
          docFactory,
        );
        arazzo.setMainArazzo();

        try {
          await arazzo.runWorkflows(inputFile);
        } catch (err) {
          console.error(err);
          expect(err).to.not.be.instanceOf(Error);
        }
      });
    });

    describe(`bearer`, function () {
      it(`handles the security requirements`, async function () {
        nock("https://raw.githubusercontent.com:443", {
          encodedQueryParams: true,
        })
          .get(
            "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/security/http/bearer/users-openapi.json",
          )
          .reply(
            200,
            [
              "1f8b0800000000000013ed5a5b6fdb36147ef7af3850f7b00289eca6d91ef2b4344d860c413b2c29ba212b505a3ab6d84aa4465271bc20ff7d2075314559f23589d7a60f69c2cbe1b97ce72379c4bb1e80c7536424a5de1178affd81ffdadbd3ad014f52ce9029e91dc15d0f00c0934184099935e8610289c20f1285d50ae0a9698a5a221f7ec1401991454f2a788a425194b519005e26513092a0d36e49934a5036f6accefb3d5bc2880aa9de6d2422269b4ac084d078fde9299172c245b8818488b30df4d761b85444656e802c1994291ca3f0f6eadd232e12a28a01af0fdcee10652068aa28677a8c460d142bd9da54bf5b7a79b789eb53afc08a913313504eaf267bdb4127ed88c832eef8f9b0dbe5cfc87f46feb691af0d3a310c1dee5c022c505b76ea4d8420535b6daa306968dc6a65979df32d5d686bb7b50ed25a73a513acb6d3ba1da871716c5cf404de6b25b345c6b9e069a5b41505b512db8a72d60b9923a495e456953397ea5614d241782b03be417a4bd39e83eb1ad09ae4d74a7f8b39e5828f29db8573ea5a3b5d8771b136ec0f942967123737f0380850ca2bfe15d9b634bcdd1744e17e4c13aae62b58a2ac31f5cffdd3db940a94fbc723d57692ab6b530f7b23566db37ad65c4f629009aaa697fad253f391779ca9880bfa2f29803d4772a4546a3bdb5c9d4ccf1089a82553d1725625d36f1faf1c957a855a1e65233ebb8f29aa6223f377545271816032a230c049beab884aa012084892a4318244718302aab9f9df3ec05f3c83803018511602cf1424ba9b0cf5af9713321ea300a2e05adb78d4efcbbcc9a7fcd38f8da697c0057006d75404fe4820321ea2cf50edc18b62d49c597d2a82fe4b1fe08c0b505af15ce73d9816ba651241450824a5f015a7f059a6185012ef7fc5e967501c144a958fb08305231a2b14d2ff9b956eba41210b17bdf207fea06c572812f97e7489e28606554ceb6a9a31fd7246c09922810def8aa9aa70579b884752aa9024bfccc47935fcc534c07a3657d28e531244080795b21ae822b6749c4c263e31a37c2ec6fd4296ec5f9c9f9cbebb3cdd3ff0077ea492d873f05582de3b826bd3d58af9eb4fd5d44f666a4a5464d50afa59fdd6e5a55c3a992fb3242142afe5e5873dc8643d33e64158479fb3780a4384903384e1d4c439e6e33186400d36846f8bd13c67f43ed78c6bd72c6c3a248224a8c161acb37a14199b3643269edd23f09f0ca57ac3c3a9cba18eeac569d6e806f34e545a1415e6bcab4486b53e0d2c64aac9c5244d631a18d3fa5f246fb27555b499d303e0fd2070a4b57bd19f957bfa4595a76fb9c99979df6bfb6bfe0d46143b5363a33918bc6a1a35efd010149701e7fcd2e698e55cd3ed9c45eeb1ef568dc9f7dd1e73cc88908439eeeeda4f4287839f16faea9cdd9098ea244833e53aab6d95e6ae5de321636801868f5445eebd6299c4961053a9808f0cfe254ca88a604c6f90e5aa42e346e218b65436cb4abd73c7feb592bbc185f93f27022dbce8fa763dd6b8b0bcf63f618dd9d5f3a94943c2c96eb286fc1e694343797759436bf74c1acfa4f14c1af0f4a4113b659a6eaeb8e06399639d327def8b10e4542a4cd62306b3f8e3de0dcc09d7d4a640dfef751940f7ec78cece0a6a0f97b38385289499a9558db218aa40ee52ead62b73dbcb5dd790d6fa5a9be30212c712521410f14c0089633ec1b0bc4c3b17f16d78a2a6e16247346ac95d65c03623435d54a00c3e5c9dc02442064ad7340173415b36d05570d56077b0f1e23c28d9b8ac77f6cb1233c84c63bcb9a16d4ad13cab9de7c6d84ed16b3331dfe903d903d3d64601ba2b8170bf6c907e45956fa3c369febfa936ae15b9312abda7bd99be7344d403d81e8eb2d05955ef1dd798e381a9382ef8d0ee76776ca35dc9bf7827345a2eb1f13d24685b60f2a8a07dcabd765ea9f2818ec7ab13f2ca3cecac78b85ca1947105239eb10de8befaa49066ed6cf1210dab7af6c357ec33b35af7a9fc11d8c4c451454401430cf557a62142ae5bc3dfdf34d36cb55e614329af57b45e7d462496bb70f779d08f22df09bb8418a3c25682796bba1f895f725d9e9c5fae22843ac7c8826472059f4966d9e3ccb79d43bdf267f9d15e3fdc90cd6ff6f5370169f1d0c3b71e30dc1ccc5e00e49ff1cb28d625d910f7ac14ae99f7be4c2a593c16a98fc65ba51d1dbfe5413d5eae9cb339ef4e748dc2686f2768ddbe9959b2f97c26376eae0acb2c5f3c7b295f7ab42dacd7bdefddf7fe03be4bb7d258310000",
            ],
            {
              "accept-ranges": "bytes",
              "access-control-allow-origin": "*",
              "cache-control": "max-age=300",
              connection: "keep-alive",
              "content-encoding": "gzip",
              "content-length": "1643",
              "content-security-policy":
                "default-src 'none'; style-src 'unsafe-inline'; sandbox",
              "content-type": "text/plain; charset=utf-8",
              "cross-origin-resource-policy": "cross-origin",
              date: "Fri, 16 Jan 2026 17:55:20 GMT",
              etag: 'W/"7686ad1227cbec190e431ea71a7b312ec943f9c991577114da6f3c151ffc8c94"',
              expires: "Fri, 16 Jan 2026 18:00:20 GMT",
              "source-age": "0",
              "strict-transport-security": "max-age=31536000",
              vary: "Authorization,Accept-Encoding",
              via: "1.1 varnish",
              "x-cache": "MISS",
              "x-cache-hits": "0",
              "x-content-type-options": "nosniff",
              "x-fastly-request-id": "ae13deccd9c052ab1c2080e24ac3c5206dafb26f",
              "x-frame-options": "deny",
              "x-github-request-id": "6C7A:376A35:1066FC:1C01EB:696A7B88",
              "x-served-by": "cache-lhr-egll1980051-LHR",
              "x-timer": "S1768586120.209272,VS0,VE139",
              "x-xss-protection": "1; mode=block",
            },
          );

        nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
          .post("/v2/user/login", { "username": "jack", "password": "p4ssW0rd" })
          .reply(
            200,
            {
              AccessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
              token_type: "Bearer",
              expires_in: 3600,
            },
            {
              "access-control-allow-headers":
                "Content-Type, api_key, Authorization",
              "access-control-allow-methods": "GET, POST, DELETE, PUT",
              "access-control-allow-origin": "*",
              connection: "keep-alive",
              "content-type": "application/json",
              date: "Fri, 16 Jan 2026 17:55:20 GMT",
              server: "Jetty(9.2.9.v20150224)",
              "transfer-encoding": "chunked",
              "x-expires-after": "Fri Jan 16 18:55:20 UTC 2026",
              "x-rate-limit": "5000",
            },
          );

        nock("http://petstore.swagger.io:80", {
          encodedQueryParams: true,
          reqheaders: {
            authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
          },
        })
          .delete("/v2/user/jack")
          .reply(
            200,
            { id: 1 },
            {
              "access-control-allow-headers":
                "Content-Type, api_key, Authorization",
              "access-control-allow-methods": "GET, POST, DELETE, PUT",
              "access-control-allow-origin": "*",
              connection: "keep-alive",
              "content-type": "application/json",
              date: "Fri, 16 Jan 2026 09:50:55 GMT",
              server: "Jetty(9.2.9.v20150224)",
              "transfer-encoding": "chunked",
            },
          );

        const inputFile = new Input(
          "./test/mocks/inputs/security/input.json",
          "inputs",
        );

        const arazzo = new Arazzo(
          "./test/mocks/arazzo/openapi-security-tests/http/bearer/users-arazzo.json",
          "arazzo",
          { logger: logger },
          docFactory,
        );
        arazzo.setMainArazzo();

        try {
          await arazzo.runWorkflows(inputFile);
        } catch (err) {
          console.error(err);
          expect(err).to.not.be.instanceOf(Error);
        }
      });
    });
  });

  describe(`mutualTLS`, function () {
    it(`handles the security requirements`, async function () {
      const AccessToken =
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ";

      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/security/mutualTLS/users-openapi.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed5a596fdc36107edf5f3150fad000b676e3a47df0531d27290c1849513b680b3740686976c544225572e4f5d6f07f2f481d2b512bede5639b380f8ecd6338c7371fc9116f06009e4c51b0947b87e0bdf447fe4b6fcfb4063249a54041da3b849b010080a7830813366f30c31432c28f1a55ad15c0a3598a46a2bcfc82015991454faa648a8a38eac60c002fd3a8044bd069af49d3a4b89878b5cedbbdba8431579ade6f252266db4ac084f178f3e929d37a2a55b88584488a2df43761382346991ba09a0c2e0827a8bcbd66f758aa845131e0e581db1da20e144f894b61c618d440b1525d9beaf79a5ede75e2fad42bb062e5cc0594d3abc9dedda093f744641577fcfcaadfe54fc87f42fe5d23df18746c193adcb90458a2b6eed59b29c56675b53961d2d2b8d3ca3e3b175bbad4d67e6b1da475e64a2f58eb4eeb77a0c1c59175d12378af93cc9619e782a793d2d614d4496c6bcad92c648e904e925b57ce42aa5b53480fe1ad0df816e9ad4c7b0eae1b406b935f27fd2de7945339e16217cea91bed743dc6c5c6b0df51a75268dcdec0a32040adcfe5571477a5e1f5be6284fb314f382d56b044596bea9ffb6faf53ae50ef1f8da9eb24d7d4a619f656acba660d6a733d8d41a638cdcecca5a7e123ef28a3482afe2f2b80bd40729251c6e2f3d33347f8a058c0e3622ce7372be214db79bf2169920ac162bb50c549a3f3886be01a186896a431824675850aaab9f9df3ec05f3283800918731182cc0812d3cd2ecdaf67533699a00246701111a587c3a1ce9b7c2e3ffdd86a7a0e52811470c155e08f15a29021fa02690f9e15a316cc1a72150c9ffb00efa402328ae73aefc1acd02dd3081421b094c3579cc1679d62c059bcff15679f8124106aca47d4dd0e631e132aedff2d4a375da1d2858b5ef8237f54b613aa447f189fa1bae281f5725b4d3b6658ce08a42016d4815a714e9541d576e0b19413b2e497b938af81a49807d8cccb4ada51ca8208e1a052d64056c5351da7d3a9cfec285faac9b090a587a727c76fdf9fbddd3ff0477e4449ec39f82ae1eb1dc285edea44efc5a76aea273b356514d56efdc3ac797ff252a99d1cd659923065d6f2f2631b64bab1612c84b089be14f10c2e114229102e6736ceb19c4c30046eb1a1fcba18c35856ef13c39df5ea439dd89862091a7058eb6a3dc426b6cdd28257ef51f84f869a5ecb70e6b2a1a37a712eb5bac1a2b39111c5953db992cab0d167808582daaccad234e681356df845cb36ef56e597053d00de0f0ac746bb67c379e16658d46b86353739336f075d7f2dbe8ba8628f696d1907a3176da3166dff4171ac774e225d8e59cd35fdce59e69efa2da935f9b6df638e1911b230c7dd4df799e6d5e8a7a5be3a11572ce62609d28c5c6775add2de7f1b3c640d2dc0f007a7c8bd21ac92d81a62ae09e4d8e25fc3945304137e852257155a770bc7b095b25957ea9d38f66f94dc2d2eccff3911e8e045d7b79bb1c669cd6bff13d6985f221f9b34341cef266be8ef91360c947797358c764fa4f1441a4fa4018f4f1ab15370e9e78a5339d139d6b930f7be0841cf3461b21931d8c51ff66e604fb8b6ca04e67e6faa63a667c773765e1abbbf9c1d2d45a1ce6cd5699cc55005729752b75963bbbbdc750de9ac9475392e6071ac21450591cc14b03896530ccbcbb47311bf0b4f34345cee885655b8afa0d76564688a0a5cc0c7f363984628804c7512301774c706ba0aae1bec1e365e9e07251b9795cb61592c069d198cb737b46d295a668df3dc04bb297a6326963b7d20bb67dada2a403725106e570dd2af48f9367a39cbffb7d5c68d223741327bdaebd97b47443380dde1280b9d551dde718d3d1ed88ae3924fe66e77cf36da97fccb7742abe50a1bdf7d82b603260f0adac7dc6b17952aefe978bc3e21afcdc3ce8aaf562b940a49309699d882eeab4f0a69d6cd161fd3b0aa67df7fc53eb3abf59fca1f804d6c1c2962040231345f992e1172dd5afefea699e64eeb157528e5f58aceabcf98c57a17ee3ef7fa51e43b6197106324ec249837b6fb81f825d7e5d1f9e53c4268728c2e482657f08964563dce7cdb3934287f961fedcdc30dddfe66df7c1390160f3dfcda0386ab83f90b80fc337e19c5a6a43ac4bd5a0a37ccfb5026952e1e8b3447e3351947c76f64d08c972be7dd827727a64661b5af2768d3beb959bafd7c26376ea10aab2c5f3c7b295f7a742d6cd6bd1ddc0efe038ff0858f22310000",
          ],
          {
            "accept-ranges": "bytes",
            "access-control-allow-origin": "*",
            "cache-control": "max-age=300",
            connection: "keep-alive",
            "content-encoding": "gzip",
            "content-length": "1629",
            "content-security-policy":
              "default-src 'none'; style-src 'unsafe-inline'; sandbox",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-resource-policy": "cross-origin",
            date: "Fri, 16 Jan 2026 19:12:59 GMT",
            etag: 'W/"9e425616aa2b30ee9cc2bbb1f0d598e758e316a9e11ef3fb0a856b44b806d226"',
            expires: "Fri, 16 Jan 2026 19:17:59 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "c4c253b444ec1e485b1609f34b5d7acfba748dd7",
            "x-frame-options": "deny",
            "x-github-request-id": "5932:101671:129352:1FE8B8:696A8DBB",
            "x-served-by": "cache-lhr-egll1980027-LHR",
            "x-timer": "S1768590779.378107,VS0,VE134",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("https://petstore.swagger.io:443", { encodedQueryParams: true })
        .post("/v2/user/login")
        .reply(
          200,
          {
            AccessToken: AccessToken,
          },
          {
            "access-control-allow-headers":
              "Content-Type, api_key, Authorization",
            "access-control-allow-methods": "GET, POST, DELETE, PUT",
            "access-control-allow-origin": "*",
            "content-type": "application/json",
            connection: "close",
            "content-length": `${JSON.stringify({ AccessToken }).length}`,
            date: "Fri, 16 Jan 2026 23:49:12 GMT",
            server: "Jetty(9.2.9.v20150224)",
          },
        );

      nock("https://petstore.swagger.io:443", {
        encodedQueryParams: true,
        reqheaders: { Authorization: AccessToken },
      })
        .delete("/v2/user/jack")
        .reply(
          200,
          {},
          {
            "access-control-allow-headers":
              "Content-Type, api_key, Authorization",
            "access-control-allow-methods": "GET, POST, DELETE, PUT",
            "access-control-allow-origin": "*",
            connection: "close",
            "content-length": `${JSON.stringify({}).length}`,
            date: "Fri, 16 Jan 2026 23:49:12 GMT",
            server: "Jetty(9.2.9.v20150224)",
          },
        );

      const inputFile = new Input(
        "./test/mocks/inputs/security/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-security-tests/mutualTLS/users-arazzo.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      try {
        await arazzo.runWorkflows(inputFile);
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }
    });

    it(`throws an error when clientCert has an invalid path`, async function () {
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/security/mutualTLS/users-openapi.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed5a596fdc36107edf5f3150fad000b676e3a47df0531d27290c1849513b680b3740686976c544225572e4f5d6f07f2f481d2b512bede5639b380f8ecd6338c7371fc9116f06009e4c51b0947b87e0bdf447fe4b6fcfb4063249a54041da3b849b010080a7830813366f30c31432c28f1a55ad15c0a3598a46a2bcfc82015991454faa648a8a38eac60c002fd3a8044bd069af49d3a4b89878b5cedbbdba8431579ade6f252266db4ac084f178f3e929d37a2a55b88584488a2df43761382346991ba09a0c2e0827a8bcbd66f758aa845131e0e581db1da20e144f894b61c618d440b1525d9beaf79a5ede75e2fad42bb062e5cc0594d3abc9dedda093f744641577fcfcaadfe54fc87f42fe5d23df18746c193adcb90458a2b6eed59b29c56675b53961d2d2b8d3ca3e3b175bbad4d67e6b1da475e64a2f58eb4eeb77a0c1c59175d12378af93cc9619e782a793d2d614d4496c6bcad92c648e904e925b57ce42aa5b53480fe1ad0df816e9ad4c7b0eae1b406b935f27fd2de7945339e16217cea91bed743dc6c5c6b0df51a75268dcdec0a32040adcfe5571477a5e1f5be6284fb314f382d56b044596bea9ffb6faf53ae50ef1f8da9eb24d7d4a619f656acba660d6a733d8d41a638cdcecca5a7e123ef28a3482afe2f2b80bd40729251c6e2f3d33347f8a058c0e3622ce7372be214db79bf2169920ac162bb50c549a3f3886be01a186896a431824675850aaab9f9df3ec05f3283800918731182cc0812d3cd2ecdaf67533699a00246701111a587c3a1ce9b7c2e3ffdd86a7a0e52811470c155e08f15a29021fa02690f9e15a316cc1a72150c9ffb00efa402328ae73aefc1acd02dd3081421b094c3579cc1679d62c059bcff15679f8124106aca47d4dd0e631e132aedff2d4a375da1d2858b5ef8237f54b613aa447f189fa1bae281f5725b4d3b6658ce08a42016d4815a714e9541d576e0b19413b2e497b938af81a49807d8cccb4ada51ca8208e1a052d64056c5351da7d3a9cfec285faac9b090a587a727c76fdf9fbddd3ff0477e4449ec39f82ae1eb1dc285edea44efc5a76aea273b356514d56efdc3ac797ff252a99d1cd659923065d6f2f2631b64bab1612c84b089be14f10c2e114229102e6736ceb19c4c30046eb1a1fcba18c35856ef13c39df5ea439dd89862091a7058eb6a3dc426b6cdd28257ef51f84f869a5ecb70e6b2a1a37a712eb5bac1a2b39111c5953db992cab0d167808582daaccad234e681356df845cb36ef56e597053d00de0f0ac746bb67c379e16658d46b86353739336f075d7f2dbe8ba8628f696d1907a3176da3166dff4171ac774e225d8e59cd35fdce59e69efa2da935f9b6df638e1911b230c7dd4df799e6d5e8a7a5be3a11572ce62609d28c5c6775add2de7f1b3c640d2dc0f007a7c8bd21ac92d81a62ae09e4d8e25fc3945304137e852257155a770bc7b095b25957ea9d38f66f94dc2d2eccff3911e8e045d7b79bb1c669cd6bff13d6985f221f9b34341cef266be8ef91360c947797358c764fa4f1441a4fa4018f4f1ab15370e9e78a5339d139d6b930f7be0841cf3461b21931d8c51ff66e604fb8b6ca04e67e6faa63a667c773765e1abbbf9c1d2d45a1ce6cd5699cc55005729752b75963bbbbdc750de9ac9475392e6071ac21450591cc14b03896530ccbcbb47311bf0b4f34345cee885655b8afa0d76564688a0a5cc0c7f363984628804c7512301774c706ba0aae1bec1e365e9e07251b9795cb61592c069d198cb737b46d295a668df3dc04bb297a6326963b7d20bb67dada2a403725106e570dd2af48f9367a39cbffb7d5c68d223741327bdaebd97b47443380dde1280b9d551dde718d3d1ed88ae3924fe66e77cf36da97fccb7742abe50a1bdf7d82b603260f0adac7dc6b17952aefe978bc3e21afcdc3ce8aaf562b940a49309699d882eeab4f0a69d6cd161fd3b0aa67df7fc53eb3abf59fca1f804d6c1c2962040231345f992e1172dd5afefea699e64eeb157528e5f58aceabcf98c57a17ee3ef7fa51e43b6197106324ec249837b6fb81f825d7e5d1f9e53c4268728c2e482657f08964563dce7cdb3934287f961fedcdc30dddfe66df7c1390160f3dfcda0386ab83f90b80fc337e19c5a6a43ac4bd5a0a37ccfb5026952e1e8b3447e3351947c76f64d08c972be7dd827727a64661b5af2768d3beb959bafd7c26376ea10aab2c5f3c7b295f7a742d6cd6bd1ddc0efe038ff0858f22310000",
          ],
          {
            "accept-ranges": "bytes",
            "access-control-allow-origin": "*",
            "cache-control": "max-age=300",
            connection: "keep-alive",
            "content-encoding": "gzip",
            "content-length": "1629",
            "content-security-policy":
              "default-src 'none'; style-src 'unsafe-inline'; sandbox",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-resource-policy": "cross-origin",
            date: "Fri, 16 Jan 2026 19:12:59 GMT",
            etag: 'W/"9e425616aa2b30ee9cc2bbb1f0d598e758e316a9e11ef3fb0a856b44b806d226"',
            expires: "Fri, 16 Jan 2026 19:17:59 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "c4c253b444ec1e485b1609f34b5d7acfba748dd7",
            "x-frame-options": "deny",
            "x-github-request-id": "5932:101671:129352:1FE8B8:696A8DBB",
            "x-served-by": "cache-lhr-egll1980027-LHR",
            "x-timer": "S1768590779.378107,VS0,VE134",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("https://petstore.swagger.io:443", { encodedQueryParams: true })
        .delete("/v2/user/jack")
        .reply(200, "", {
          "access-control-allow-headers":
            "Content-Type, api_key, Authorization",
          "access-control-allow-methods": "GET, POST, DELETE, PUT",
          "access-control-allow-origin": "*",
          connection: "close",
          "content-length": "0",
          date: "Fri, 16 Jan 2026 23:49:12 GMT",
          server: "Jetty(9.2.9.v20150224)",
        });

      const inputFile = new Input(
        "./test/mocks/inputs/security/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-security-tests/mutualTLS/users-arazzo-invalid-cert-path.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      try {
        await arazzo.runWorkflows(inputFile);
      } catch (err) {
        console.error(err);
        expect(err).to.be.instanceOf(Error);
      }
    });

    it(`throws an error when clientCert is missing from inputs`, async function () {
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/security/mutualTLS/users-openapi.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed5a596fdc36107edf5f3150fad000b676e3a47df0531d27290c1849513b680b3740686976c544225572e4f5d6f07f2f481d2b512bede5639b380f8ecd6338c7371fc9116f06009e4c51b0947b87e0bdf447fe4b6fcfb4063249a54041da3b849b010080a7830813366f30c31432c28f1a55ad15c0a3598a46a2bcfc82015991454faa648a8a38eac60c002fd3a8044bd069af49d3a4b89878b5cedbbdba8431579ade6f252266db4ac084f178f3e929d37a2a55b88584488a2df43761382346991ba09a0c2e0827a8bcbd66f758aa845131e0e581db1da20e144f894b61c618d440b1525d9beaf79a5ede75e2fad42bb062e5cc0594d3abc9dedda093f744641577fcfcaadfe54fc87f42fe5d23df18746c193adcb90458a2b6eed59b29c56675b53961d2d2b8d3ca3e3b175bbad4d67e6b1da475e64a2f58eb4eeb77a0c1c59175d12378af93cc9619e782a793d2d614d4496c6bcad92c648e904e925b57ce42aa5b53480fe1ad0df816e9ad4c7b0eae1b406b935f27fd2de7945339e16217cea91bed743dc6c5c6b0df51a75268dcdec0a32040adcfe5571477a5e1f5be6284fb314f382d56b044596bea9ffb6faf53ae50ef1f8da9eb24d7d4a619f656acba660d6a733d8d41a638cdcecca5a7e123ef28a3482afe2f2b80bd40729251c6e2f3d33347f8a058c0e3622ce7372be214db79bf2169920ac162bb50c549a3f3886be01a186896a431824675850aaab9f9df3ec05f3283800918731182cc0812d3cd2ecdaf67533699a00246701111a587c3a1ce9b7c2e3ffdd86a7a0e52811470c155e08f15a29021fa02690f9e15a316cc1a72150c9ffb00efa402328ae73aefc1acd02dd3081421b094c3579cc1679d62c059bcff15679f8124106aca47d4dd0e631e132aedff2d4a375da1d2858b5ef8237f54b613aa447f189fa1bae281f5725b4d3b6658ce08a42016d4815a714e9541d576e0b19413b2e497b938af81a49807d8cccb4ada51ca8208e1a052d64056c5351da7d3a9cfec285faac9b090a587a727c76fdf9fbddd3ff0477e4449ec39f82ae1eb1dc285edea44efc5a76aea273b356514d56efdc3ac797ff252a99d1cd659923065d6f2f2631b64bab1612c84b089be14f10c2e114229102e6736ceb19c4c30046eb1a1fcba18c35856ef13c39df5ea439dd89862091a7058eb6a3dc426b6cdd28257ef51f84f869a5ecb70e6b2a1a37a712eb5bac1a2b39111c5953db992cab0d167808582daaccad234e681356df845cb36ef56e597053d00de0f0ac746bb67c379e16658d46b86353739336f075d7f2dbe8ba8628f696d1907a3176da3166dff4171ac774e225d8e59cd35fdce59e69efa2da935f9b6df638e1911b230c7dd4df799e6d5e8a7a5be3a11572ce62609d28c5c6775add2de7f1b3c640d2dc0f007a7c8bd21ac92d81a62ae09e4d8e25fc3945304137e852257155a770bc7b095b25957ea9d38f66f94dc2d2eccff3911e8e045d7b79bb1c669cd6bff13d6985f221f9b34341cef266be8ef91360c947797358c764fa4f1441a4fa4018f4f1ab15370e9e78a5339d139d6b930f7be0841cf3461b21931d8c51ff66e604fb8b6ca04e67e6faa63a667c773765e1abbbf9c1d2d45a1ce6cd5699cc55005729752b75963bbbbdc750de9ac9475392e6071ac21450591cc14b03896530ccbcbb47311bf0b4f34345cee885655b8afa0d76564688a0a5cc0c7f363984628804c7512301774c706ba0aae1bec1e365e9e07251b9795cb61592c069d198cb737b46d295a668df3dc04bb297a6326963b7d20bb67dada2a403725106e570dd2af48f9367a39cbffb7d5c68d223741327bdaebd97b47443380dde1280b9d551dde718d3d1ed88ae3924fe66e77cf36da97fccb7742abe50a1bdf7d82b603260f0adac7dc6b17952aefe978bc3e21afcdc3ce8aaf562b940a49309699d882eeab4f0a69d6cd161fd3b0aa67df7fc53eb3abf59fca1f804d6c1c2962040231345f992e1172dd5afefea699e64eeb157528e5f58aceabcf98c57a17ee3ef7fa51e43b6197106324ec249837b6fb81f825d7e5d1f9e53c4268728c2e482657f08964563dce7cdb3934287f961fedcdc30dddfe66df7c1390160f3dfcda0386ab83f90b80fc337e19c5a6a43ac4bd5a0a37ccfb5026952e1e8b3447e3351947c76f64d08c972be7dd827727a64661b5af2768d3beb959bafd7c26376ea10aab2c5f3c7b295f7a742d6cd6bd1ddc0efe038ff0858f22310000",
          ],
          {
            "accept-ranges": "bytes",
            "access-control-allow-origin": "*",
            "cache-control": "max-age=300",
            connection: "keep-alive",
            "content-encoding": "gzip",
            "content-length": "1629",
            "content-security-policy":
              "default-src 'none'; style-src 'unsafe-inline'; sandbox",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-resource-policy": "cross-origin",
            date: "Fri, 16 Jan 2026 19:12:59 GMT",
            etag: 'W/"9e425616aa2b30ee9cc2bbb1f0d598e758e316a9e11ef3fb0a856b44b806d226"',
            expires: "Fri, 16 Jan 2026 19:17:59 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "c4c253b444ec1e485b1609f34b5d7acfba748dd7",
            "x-frame-options": "deny",
            "x-github-request-id": "5932:101671:129352:1FE8B8:696A8DBB",
            "x-served-by": "cache-lhr-egll1980027-LHR",
            "x-timer": "S1768590779.378107,VS0,VE134",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("https://petstore.swagger.io:443", { encodedQueryParams: true })
        .delete("/v2/user/jack")
        .reply(200, "", {
          "access-control-allow-headers":
            "Content-Type, api_key, Authorization",
          "access-control-allow-methods": "GET, POST, DELETE, PUT",
          "access-control-allow-origin": "*",
          connection: "close",
          "content-length": "0",
          date: "Fri, 16 Jan 2026 23:49:12 GMT",
          server: "Jetty(9.2.9.v20150224)",
        });

      const inputFile = new Input(
        "./test/mocks/inputs/security/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-security-tests/mutualTLS/users-arazzo-missing-cert.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      try {
        await arazzo.runWorkflows(inputFile);
      } catch (err) {
        console.error(err);
        expect(err).to.be.instanceOf(Error);
      }
    });

    it(`throws an error when clientKey is missing from inputs`, async function () {
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/security/mutualTLS/users-openapi.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed5a596fdc36107edf5f3150fad000b676e3a47df0531d27290c1849513b680b3740686976c544225572e4f5d6f07f2f481d2b512bede5639b380f8ecd6338c7371fc9116f06009e4c51b0947b87e0bdf447fe4b6fcfb4063249a54041da3b849b010080a7830813366f30c31432c28f1a55ad15c0a3598a46a2bcfc82015991454faa648a8a38eac60c002fd3a8044bd069af49d3a4b89878b5cedbbdba8431579ade6f252266db4ac084f178f3e929d37a2a55b88584488a2df43761382346991ba09a0c2e0827a8bcbd66f758aa845131e0e581db1da20e144f894b61c618d440b1525d9beaf79a5ede75e2fad42bb062e5cc0594d3abc9dedda093f744641577fcfcaadfe54fc87f42fe5d23df18746c193adcb90458a2b6eed59b29c56675b53961d2d2b8d3ca3e3b175bbad4d67e6b1da475e64a2f58eb4eeb77a0c1c59175d12378af93cc9619e782a793d2d614d4496c6bcad92c648e904e925b57ce42aa5b53480fe1ad0df816e9ad4c7b0eae1b406b935f27fd2de7945339e16217cea91bed743dc6c5c6b0df51a75268dcdec0a32040adcfe5571477a5e1f5be6284fb314f382d56b044596bea9ffb6faf53ae50ef1f8da9eb24d7d4a619f656acba660d6a733d8d41a638cdcecca5a7e123ef28a3482afe2f2b80bd40729251c6e2f3d33347f8a058c0e3622ce7372be214db79bf2169920ac162bb50c549a3f3886be01a186896a431824675850aaab9f9df3ec05f3283800918731182cc0812d3cd2ecdaf67533699a00246701111a587c3a1ce9b7c2e3ffdd86a7a0e52811470c155e08f15a29021fa02690f9e15a316cc1a72150c9ffb00efa402328ae73aefc1acd02dd3081421b094c3579cc1679d62c059bcff15679f8124106aca47d4dd0e631e132aedff2d4a375da1d2858b5ef8237f54b613aa447f189fa1bae281f5725b4d3b6658ce08a42016d4815a714e9541d576e0b19413b2e497b938af81a49807d8cccb4ada51ca8208e1a052d64056c5351da7d3a9cfec285faac9b090a587a727c76fdf9fbddd3ff0477e4449ec39f82ae1eb1dc285edea44efc5a76aea273b356514d56efdc3ac797ff252a99d1cd659923065d6f2f2631b64bab1612c84b089be14f10c2e114229102e6736ceb19c4c30046eb1a1fcba18c35856ef13c39df5ea439dd89862091a7058eb6a3dc426b6cdd28257ef51f84f869a5ecb70e6b2a1a37a712eb5bac1a2b39111c5953db992cab0d167808582daaccad234e681356df845cb36ef56e597053d00de0f0ac746bb67c379e16658d46b86353739336f075d7f2dbe8ba8628f696d1907a3176da3166dff4171ac774e225d8e59cd35fdce59e69efa2da935f9b6df638e1911b230c7dd4df799e6d5e8a7a5be3a11572ce62609d28c5c6775add2de7f1b3c640d2dc0f007a7c8bd21ac92d81a62ae09e4d8e25fc3945304137e852257155a770bc7b095b25957ea9d38f66f94dc2d2eccff3911e8e045d7b79bb1c669cd6bff13d6985f221f9b34341cef266be8ef91360c947797358c764fa4f1441a4fa4018f4f1ab15370e9e78a5339d139d6b930f7be0841cf3461b21931d8c51ff66e604fb8b6ca04e67e6faa63a667c773765e1abbbf9c1d2d45a1ce6cd5699cc55005729752b75963bbbbdc750de9ac9475392e6071ac21450591cc14b03896530ccbcbb47311bf0b4f34345cee885655b8afa0d76564688a0a5cc0c7f363984628804c7512301774c706ba0aae1bec1e365e9e07251b9795cb61592c069d198cb737b46d295a668df3dc04bb297a6326963b7d20bb67dada2a403725106e570dd2af48f9367a39cbffb7d5c68d223741327bdaebd97b47443380dde1280b9d551dde718d3d1ed88ae3924fe66e77cf36da97fccb7742abe50a1bdf7d82b603260f0adac7dc6b17952aefe978bc3e21afcdc3ce8aaf562b940a49309699d882eeab4f0a69d6cd161fd3b0aa67df7fc53eb3abf59fca1f804d6c1c2962040231345f992e1172dd5afefea699e64eeb157528e5f58aceabcf98c57a17ee3ef7fa51e43b6197106324ec249837b6fb81f825d7e5d1f9e53c4268728c2e482657f08964563dce7cdb3934287f961fedcdc30dddfe66df7c1390160f3dfcda0386ab83f90b80fc337e19c5a6a43ac4bd5a0a37ccfb5026952e1e8b3447e3351947c76f64d08c972be7dd827727a64661b5af2768d3beb959bafd7c26376ea10aab2c5f3c7b295f7a742d6cd6bd1ddc0efe038ff0858f22310000",
          ],
          {
            "accept-ranges": "bytes",
            "access-control-allow-origin": "*",
            "cache-control": "max-age=300",
            connection: "keep-alive",
            "content-encoding": "gzip",
            "content-length": "1629",
            "content-security-policy":
              "default-src 'none'; style-src 'unsafe-inline'; sandbox",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-resource-policy": "cross-origin",
            date: "Fri, 16 Jan 2026 19:12:59 GMT",
            etag: 'W/"9e425616aa2b30ee9cc2bbb1f0d598e758e316a9e11ef3fb0a856b44b806d226"',
            expires: "Fri, 16 Jan 2026 19:17:59 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "c4c253b444ec1e485b1609f34b5d7acfba748dd7",
            "x-frame-options": "deny",
            "x-github-request-id": "5932:101671:129352:1FE8B8:696A8DBB",
            "x-served-by": "cache-lhr-egll1980027-LHR",
            "x-timer": "S1768590779.378107,VS0,VE134",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("https://petstore.swagger.io:443", { encodedQueryParams: true })
        .delete("/v2/user/jack")
        .reply(200, "", {
          "access-control-allow-headers":
            "Content-Type, api_key, Authorization",
          "access-control-allow-methods": "GET, POST, DELETE, PUT",
          "access-control-allow-origin": "*",
          connection: "close",
          "content-length": "0",
          date: "Fri, 16 Jan 2026 23:49:12 GMT",
          server: "Jetty(9.2.9.v20150224)",
        });

      const inputFile = new Input(
        "./test/mocks/inputs/security/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-security-tests/mutualTLS/users-arazzo-invalid-key-path.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      try {
        await arazzo.runWorkflows(inputFile);
      } catch (err) {
        console.error(err);
        expect(err).to.be.instanceOf(Error);
      }
    });

    it(`throws an error when clientKey is missing from inputs`, async function () {
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/security/mutualTLS/users-openapi.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed5a596fdc36107edf5f3150fad000b676e3a47df0531d27290c1849513b680b3740686976c544225572e4f5d6f07f2f481d2b512bede5639b380f8ecd6338c7371fc9116f06009e4c51b0947b87e0bdf447fe4b6fcfb4063249a54041da3b849b010080a7830813366f30c31432c28f1a55ad15c0a3598a46a2bcfc82015991454faa648a8a38eac60c002fd3a8044bd069af49d3a4b89878b5cedbbdba8431579ade6f252266db4ac084f178f3e929d37a2a55b88584488a2df43761382346991ba09a0c2e0827a8bcbd66f758aa845131e0e581db1da20e144f894b61c618d440b1525d9beaf79a5ede75e2fad42bb062e5cc0594d3abc9dedda093f744641577fcfcaadfe54fc87f42fe5d23df18746c193adcb90458a2b6eed59b29c56675b53961d2d2b8d3ca3e3b175bbad4d67e6b1da475e64a2f58eb4eeb77a0c1c59175d12378af93cc9619e782a793d2d614d4496c6bcad92c648e904e925b57ce42aa5b53480fe1ad0df816e9ad4c7b0eae1b406b935f27fd2de7945339e16217cea91bed743dc6c5c6b0df51a75268dcdec0a32040adcfe5571477a5e1f5be6284fb314f382d56b044596bea9ffb6faf53ae50ef1f8da9eb24d7d4a619f656acba660d6a733d8d41a638cdcecca5a7e123ef28a3482afe2f2b80bd40729251c6e2f3d33347f8a058c0e3622ce7372be214db79bf2169920ac162bb50c549a3f3886be01a186896a431824675850aaab9f9df3ec05f3283800918731182cc0812d3cd2ecdaf67533699a00246701111a587c3a1ce9b7c2e3ffdd86a7a0e52811470c155e08f15a29021fa02690f9e15a316cc1a72150c9ffb00efa402328ae73aefc1acd02dd3081421b094c3579cc1679d62c059bcff15679f8124106aca47d4dd0e631e132aedff2d4a375da1d2858b5ef8237f54b613aa447f189fa1bae281f5725b4d3b6658ce08a42016d4815a714e9541d576e0b19413b2e497b938af81a49807d8cccb4ada51ca8208e1a052d64056c5351da7d3a9cfec285faac9b090a587a727c76fdf9fbddd3ff0477e4449ec39f82ae1eb1dc285edea44efc5a76aea273b356514d56efdc3ac797ff252a99d1cd659923065d6f2f2631b64bab1612c84b089be14f10c2e114229102e6736ceb19c4c30046eb1a1fcba18c35856ef13c39df5ea439dd89862091a7058eb6a3dc426b6cdd28257ef51f84f869a5ecb70e6b2a1a37a712eb5bac1a2b39111c5953db992cab0d167808582daaccad234e681356df845cb36ef56e597053d00de0f0ac746bb67c379e16658d46b86353739336f075d7f2dbe8ba8628f696d1907a3176da3166dff4171ac774e225d8e59cd35fdce59e69efa2da935f9b6df638e1911b230c7dd4df799e6d5e8a7a5be3a11572ce62609d28c5c6775add2de7f1b3c640d2dc0f007a7c8bd21ac92d81a62ae09e4d8e25fc3945304137e852257155a770bc7b095b25957ea9d38f66f94dc2d2eccff3911e8e045d7b79bb1c669cd6bff13d6985f221f9b34341cef266be8ef91360c947797358c764fa4f1441a4fa4018f4f1ab15370e9e78a5339d139d6b930f7be0841cf3461b21931d8c51ff66e604fb8b6ca04e67e6faa63a667c773765e1abbbf9c1d2d45a1ce6cd5699cc55005729752b75963bbbbdc750de9ac9475392e6071ac21450591cc14b03896530ccbcbb47311bf0b4f34345cee885655b8afa0d76564688a0a5cc0c7f363984628804c7512301774c706ba0aae1bec1e365e9e07251b9795cb61592c069d198cb737b46d295a668df3dc04bb297a6326963b7d20bb67dada2a403725106e570dd2af48f9367a39cbffb7d5c68d223741327bdaebd97b47443380dde1280b9d551dde718d3d1ed88ae3924fe66e77cf36da97fccb7742abe50a1bdf7d82b603260f0adac7dc6b17952aefe978bc3e21afcdc3ce8aaf562b940a49309699d882eeab4f0a69d6cd161fd3b0aa67df7fc53eb3abf59fca1f804d6c1c2962040231345f992e1172dd5afefea699e64eeb157528e5f58aceabcf98c57a17ee3ef7fa51e43b6197106324ec249837b6fb81f825d7e5d1f9e53c4268728c2e482657f08964563dce7cdb3934287f961fedcdc30dddfe66df7c1390160f3dfcda0386ab83f90b80fc337e19c5a6a43ac4bd5a0a37ccfb5026952e1e8b3447e3351947c76f64d08c972be7dd827727a64661b5af2768d3beb959bafd7c26376ea10aab2c5f3c7b295f7a742d6cd6bd1ddc0efe038ff0858f22310000",
          ],
          {
            "accept-ranges": "bytes",
            "access-control-allow-origin": "*",
            "cache-control": "max-age=300",
            connection: "keep-alive",
            "content-encoding": "gzip",
            "content-length": "1629",
            "content-security-policy":
              "default-src 'none'; style-src 'unsafe-inline'; sandbox",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-resource-policy": "cross-origin",
            date: "Fri, 16 Jan 2026 19:12:59 GMT",
            etag: 'W/"9e425616aa2b30ee9cc2bbb1f0d598e758e316a9e11ef3fb0a856b44b806d226"',
            expires: "Fri, 16 Jan 2026 19:17:59 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "c4c253b444ec1e485b1609f34b5d7acfba748dd7",
            "x-frame-options": "deny",
            "x-github-request-id": "5932:101671:129352:1FE8B8:696A8DBB",
            "x-served-by": "cache-lhr-egll1980027-LHR",
            "x-timer": "S1768590779.378107,VS0,VE134",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("https://petstore.swagger.io:443", { encodedQueryParams: true })
        .delete("/v2/user/jack")
        .reply(200, "", {
          "access-control-allow-headers":
            "Content-Type, api_key, Authorization",
          "access-control-allow-methods": "GET, POST, DELETE, PUT",
          "access-control-allow-origin": "*",
          connection: "close",
          "content-length": "0",
          date: "Fri, 16 Jan 2026 23:49:12 GMT",
          server: "Jetty(9.2.9.v20150224)",
        });

      const inputFile = new Input(
        "./test/mocks/inputs/security/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-security-tests/mutualTLS/users-arazzo-missing-key.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      try {
        await arazzo.runWorkflows(inputFile);
      } catch (err) {
        console.error(err);
        expect(err).to.be.instanceOf(Error);
      }
    });
  });

  xdescribe(`oauth2`, function () {
    it(`handles the security requirements`, async function () {
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/security/oauth2/users-openapi.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed59c16edc3610bdfb2b064c0f0de0685d27e8c1a7ba710c2c5a34469d1c0ad768686976978944b2e4c8ce36f0bf17a4b4bb1249491bc79700ded34a2267868f6fe60da52f07004c69945c0b7602ec657694bd6487ee6eae2aad244ab2ec04be1c0000309bafb0e2bb1b6e98414e7881d4b909c068add11954371f31276fb17da28dd26848a0edcd70a638e1529975707fccdab845ff541489bb1d9b42122ed10446fd90853215a776d0cfaf5830e23e9cc224af70dc9b2523e432b2d4bb0eecb2cf55995a58eb8cbddec0d637d2b9ea194c0719061884809f79a54b3fa050cba54036685eaf14a9f7a68c3763eb831bc3d7a10b41582537700cbaaf846a135bb4d9ecce70add151854c8d7b22497cf9e8ab4c527c8ae4c334df8be8d3544f907d8cee93840f299f4aa6f45e7676f31d7fdc44221ef2fea1c4b0c4a91ea1463ac90ab4b9119a84929eac48d01802218156089694c12835655db113b862fc968b92df94c80edd64597817c0ac2a0b76dd8d75fbbf133533f86f2d8c5fe95503c9613799af3b43631cb7183a2138081d6dddb46a513c8a5c24183fc1f588e5c16383bc782bcb75bcd9f7236bfafe16d3e3ea93ea26ed3ea9ee93ea3ea96eecf64975e1bb53dd0ba4539f1649990a3326992d6399329625e90c99cc8e09711b95b798818312f754011e5201d2d237550606821ecfce29118cdd0c0be184488cc8c47427f1f5200e8ae278f59b4239298e8fb2f28104994e91b124d9334df6499464aa8c27cb1ee912274c3a2587f67b5c381f251d5302fa6d241a10d23d92f54162fa20391d6b04f617d5017cd3c23a790c3c57a6faf6a3e0434e0a01eeef75e18ed9e04c815a78e475b094c76f9d365edb1d1ff03b02e17b5d2a5e60712e4afc761c73558ce0b8cfa1fae5f13062ad9d71bc066757682d5f7e9d8149e086e9176d5f679d3742f29d96ef6c464af2c086315c491cbd469a176957f12e0d09c1ce1cd7e29f4f38d0ecf6a3696269a7328b796d04ad2fdd578e1e9fd8694d2b65c47fbce57a0a152d7ec31e2c9b22d29fdcc5cda7cd0a79812608e9a00d8b09b950bb0f3024a869852eeff87289062e90ba25354cc9772b614158e0607d170516cd6d675a7b9d01fca56ac8b984859005a89aa0728ff98dfbbb71c609ae5644fa6436b3cdad4ca8eb1fa35bcf41195012ae84c9b3854194aac04c221dc2b3765462d64c987cf63c03385706c805dec47c08eb36b6daa22f295c0bf8846bf86035e682972f3ee1fa039002424bcd882ee4b01025a1b1d9df1bf4d92d1adb42f45376941d6dee139acabe5d5ca2b915b9073a0ed38f996d66e44a12cfbb6f00b7fbbedd6a861517654b12425efdb233c77a142c458ed262cadaa9e6f90ae1781b2c00ab4dd989f1eeee2ee37e54a6cc72d6dab2b3dfe7afdffc71f9e6c5717694ada82a5940b10def9d5cfa4783b4bfbade4ef522ca34a755e7fbe04c23cdbef87cbeefae6119be22b57555717f2063e78e70ae51b859c3fcac9b1e0197ff44aa8df45c16725936cad219ee74c007ea8b89f37981f4eb7a5ef4e4821b5ea163c376b5cd6fa001686a53f83aa9696e38ad2614717ee654d02d8e14181f7ffc9a76dbabb83e2d7a03a8cb46c616bcb4e1d3e6736caa4ffbc1e0c205f06cb6fb8c3b6bbfdece9a350df752dbffddb70fad1c5c39447aaf2522f624f11c60d2984783562b47e050598e8f8e62e10c90b7759ea3b58bba842d2f42e85deaa2a4147e5ceb52e47ed6eca30d4afe34fed37b103496210ea9ebb04b6f74c3a333dc0abfda03abb9bce5a528607e06b6760bc788f17bfa7a35e9eb0209a42258a85aeeed25ee1da20ae654ccc605ac5f2075ab7a59a79adf1eefca6153d3364cef5bea14845dfd0d16f7e616cd9a56422e5be15cabbad1da8e147c26349297672a0fdaab7eac1d85182e89e75db14e363551fcfd035868f0d4678dab56db0e4119bf27a3466bdbe9d1429b6f37f9675b54faa38701195b6c6bcae11b1e290781b4718fd5ec7832847ddcb78dd1a61718dc4147d483fb83ff012fe13f3f6e230000",
          ],
          {
            "accept-ranges": "bytes",
            "access-control-allow-origin": "*",
            "cache-control": "max-age=300",
            connection: "keep-alive",
            "content-encoding": "gzip",
            "content-length": "1477",
            "content-security-policy":
              "default-src 'none'; style-src 'unsafe-inline'; sandbox",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-resource-policy": "cross-origin",
            date: "Fri, 16 Jan 2026 09:50:54 GMT",
            etag: 'W/"1422fa48d6726aaf62e6e6e6d31e64546b6439f3dfcca6b446461c92b5e336fd"',
            expires: "Fri, 16 Jan 2026 09:55:54 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "bbbde69c2a20818de18ee587ce1af5282916ac55",
            "x-frame-options": "deny",
            "x-github-request-id": "A698:3A391E:13A40:21033:696A09FE",
            "x-served-by": "cache-lhr-egll1980058-LHR",
            "x-timer": "S1768557054.312739,VS0,VE123",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
        .get("/v2/pet/1")
        .reply(
          200,
          { id: 1 },
          {
            "access-control-allow-headers":
              "Content-Type, api_key, Authorization",
            "access-control-allow-methods": "GET, POST, DELETE, PUT",
            "access-control-allow-origin": "*",
            connection: "keep-alive",
            "content-type": "application/json",
            date: "Fri, 16 Jan 2026 09:50:55 GMT",
            server: "Jetty(9.2.9.v20150224)",
            "transfer-encoding": "chunked",
          },
        );

      const inputFile = new Input(
        "./test/mocks/inputs/security/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-security-tests/oauth2/users-arazzo.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      try {
        await arazzo.runWorkflows(inputFile);
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }
    });
  });

  xdescribe(`openIdConnect`, function () {
    it(`handles the security requirements`, async function () {
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/security/openIdConnect/users-openapi.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed59c16edc3610bdfb2b064c0f0de0685d27e8c1a7ba710c2c5a34469d1c0ad768686976978944b2e4c8ce36f0bf17a4b4bb1249491bc79700ded34a2267868f6fe60da52f07004c69945c0b7602ec657694bd6487ee6eae2aad244ab2ec04be1c0000309bafb0e2bb1b6e98414e7881d4b909c068add11954371f31276fb17da28dd26848a0edcd70a638e1529975707fccdab845ff541489bb1d9b42122ed10446fd90853215a776d0cfaf5830e23e9cc224af70dc9b2523e432b2d4bb0eecb2cf55995a58eb8cbddec0d637d2b9ea194c0719061884809f79a54b3fa050cba54036685eaf14a9f7a68c3763eb831bc3d7a10b41582537700cbaaf846a135bb4d9ecce70add151854c8d7b22497cf9e8ab4c527c8ae4c334df8be8d3544f907d8cee93840f299f4aa6f45e7676f31d7fdc44221ef2fea1c4b0c4a91ea1463ac90ab4b9119a84929eac48d01802218156089694c12835655db113b862fc968b92df94c80edd64597817c0ac2a0b76dd8d75fbbf133533f86f2d8c5fe95503c9613799af3b43631cb7183a2138081d6dddb46a513c8a5c24183fc1f588e5c16383bc782bcb75bcd9f7236bfafe16d3e3ea93ea26ed3ea9ee93ea3ea96eecf64975e1bb53dd0ba4539f1649990a3326992d6399329625e90c99cc8e09711b95b798818312f754011e5201d2d237550606821ecfce29118cdd0c0be184488cc8c47427f1f5200e8ae278f59b4239298e8fb2f28104994e91b124d9334df6499464aa8c27cb1ee912274c3a2587f67b5c381f251d5302fa6d241a10d23d92f54162fa20391d6b04f617d5017cd3c23a790c3c57a6faf6a3e0434e0a01eeef75e18ed9e04c815a78e475b094c76f9d365edb1d1ff03b02e17b5d2a5e60712e4afc761c73558ce0b8cfa1fae5f13062ad9d71bc066757682d5f7e9d8149e086e9176d5f679d3742f29d96ef6c464af2c086315c491cbd469a176957f12e0d09c1ce1cd7e29f4f38d0ecf6a3696269a7328b796d04ad2fdd578e1e9fd8694d2b65c47fbce57a0a152d7ec31e2c9b22d29fdcc5cda7cd0a79812608e9a00d8b09b950bb0f3024a869852eeff87289062e90ba25354cc9772b614158e0607d170516cd6d675a7b9d01fca56ac8b984859005a89aa0728ff98dfbbb71c609ae5644fa6436b3cdad4ca8eb1fa35bcf41195012ae84c9b3854194aac04c221dc2b3765462d64c987cf63c03385706c805dec47c08eb36b6daa22f295c0bf8846bf86035e682972f3ee1fa039002424bcd882ee4b01025a1b1d9df1bf4d92d1adb42f45376941d6dee139acabe5d5ca2b915b9073a0ed38f996d66e44a12cfbb6f00b7fbbedd6a861517654b12425efdb233c77a142c458ed262cadaa9e6f90ae1781b2c00ab4dd989f1eeee2ee37e54a6cc72d6dab2b3dfe7afdffc71f9e6c5717694ada82a5940b10def9d5cfa4783b4bfbade4ef522ca34a755e7fbe04c23cdbef87cbeefae6119be22b57555717f2063e78e70ae51b859c3fcac9b1e0197ff44aa8df45c16725936cad219ee74c007ea8b89f37981f4eb7a5ef4e4821b5ea163c376b5cd6fa001686a53f83aa9696e38ad2614717ee654d02d8e14181f7ffc9a76dbabb83e2d7a03a8cb46c616bcb4e1d3e6736caa4ffbc1e0c205f06cb6fb8c3b6bbfdece9a350df752dbffddb70fad1c5c39447aaf2522f624f11c60d2984783562b47e050598e8f8e62e10c90b7759ea3b58bba842d2f42e85deaa2a4147e5ceb52e47ed6eca30d4afe34fed37b103496210ea9ebb04b6f74c3a333dc0abfda03abb9bce5a528607e06b6760bc788f17bfa7a35e9eb0209a42258a85aeeed25ee1da20ae654ccc605ac5f2075ab7a59a79adf1eefca6153d3364cef5bea14845dfd0d16f7e616cd9a56422e5be15cabbad1da8e147c26349297672a0fdaab7eac1d85182e89e75db14e363551fcfd035868f0d4678dab56db0e4119bf27a3466bdbe9d1429b6f37f9675b54faa38701195b6c6bcae11b1e290781b4718fd5ec7832847ddcb78dd1a61718dc4147d483fb83ff012fe13f3f6e230000",
          ],
          {
            "accept-ranges": "bytes",
            "access-control-allow-origin": "*",
            "cache-control": "max-age=300",
            connection: "keep-alive",
            "content-encoding": "gzip",
            "content-length": "1477",
            "content-security-policy":
              "default-src 'none'; style-src 'unsafe-inline'; sandbox",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-resource-policy": "cross-origin",
            date: "Fri, 16 Jan 2026 09:50:54 GMT",
            etag: 'W/"1422fa48d6726aaf62e6e6e6d31e64546b6439f3dfcca6b446461c92b5e336fd"',
            expires: "Fri, 16 Jan 2026 09:55:54 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "bbbde69c2a20818de18ee587ce1af5282916ac55",
            "x-frame-options": "deny",
            "x-github-request-id": "A698:3A391E:13A40:21033:696A09FE",
            "x-served-by": "cache-lhr-egll1980058-LHR",
            "x-timer": "S1768557054.312739,VS0,VE123",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
        .get("/v2/pet/1")
        .reply(
          200,
          { id: 1 },
          {
            "access-control-allow-headers":
              "Content-Type, api_key, Authorization",
            "access-control-allow-methods": "GET, POST, DELETE, PUT",
            "access-control-allow-origin": "*",
            connection: "keep-alive",
            "content-type": "application/json",
            date: "Fri, 16 Jan 2026 09:50:55 GMT",
            server: "Jetty(9.2.9.v20150224)",
            "transfer-encoding": "chunked",
          },
        );

      const inputFile = new Input(
        "./test/mocks/inputs/security/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-security-tests/openIdConnect/users-arazzo.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      try {
        await arazzo.runWorkflows(inputFile);
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }
    });
  });
});

/**
 * Retry After test ideas
console.log('Seconds format:');
console.log(parseRetryAfter('120')); // 120
console.log(parseRetryAfter('0')); // 0
console.log(parseRetryAfter('3600')); // 3600

console.log('\nDate format:');
const futureDate = new Date(Date.now() + 60000); // 60 seconds from now
console.log(parseRetryAfter(futureDate.toUTCString())); // ~60

console.log('\nHTTP date format:');
console.log(parseRetryAfter('Fri, 31 Dec 2099 23:59:59 GMT')); // seconds until that date

console.log('\nInvalid values:');
console.log(parseRetryAfter('invalid')); // null
console.log(parseRetryAfter('')); // null
console.log(parseRetryAfter(null)); // null
console.log(parseRetryAfter(undefined)); // null
console.log(parseRetryAfter('120.5')); // null (not a valid integer format)
console.log(parseRetryAfter('-10'));
 */
