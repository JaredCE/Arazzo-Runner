'use strict';

const expect = require("chai").expect;
const nock = require("nock");
const sinon = require("sinon");

const docFactory = require("../../src/DocFactory.js");
const Input = require("../../src/Input.js");
const Logger = require("../../src/Logger.js");

const Arazzo = require("../../src/Arazzo.js");

describe(`Arazzo Rules`, function () {
  const logger = new Logger();
  const AccessToken =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ";

  describe(`onFailure`, function () {
    describe(`end`, function () {
      describe(`step`, function () {
        it(`should end the workflow if the first step hits a onFailure end rule at step level that matches`, async function () {
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
            .post("/v2/user/login", {
              "username": "DannyB", "password": "P4ssW0rd"
            })
            .reply(
              400,
              {
                error: 'Could not login', errorCode: 400,
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

          const inputFile = new Input(
            "./test/mocks/inputs/outputs/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-rules/onFailure/end/step/first-step.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`should end the workflow if the middle step hits a onFailure end rule at step level that matches`, async function () {
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
            .post("/v2/user/login", {
              "username": "DannyB", "password": "P4ssW0rd"
            })
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
            .get("/v2/user/DannyB")
            .reply(
              404,
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
            "./test/mocks/inputs/outputs/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-rules/onFailure/end/step/middle-step.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });

      describe(`workflow`, function () {
        it(`should end the workflow if the first step hits a failureActions end rule at workflow level that matches`, async function () {
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
            .post("/v2/user/login", {
              "username": "DannyB", "password": "P4ssW0rd"
            })
            .reply(
              400,
              {
                error: 'Could not login', errorCode: 400,
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

          const inputFile = new Input(
            "./test/mocks/inputs/outputs/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-rules/onFailure/end/workflow/first-step.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`should end the workflow if the middle step hits a failureActions end rule at workflow level that matches`, async function () {
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
            .post("/v2/user/login", {
              "username": "DannyB", "password": "P4ssW0rd"
            })
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
            .get("/v2/user/DannyB")
            .reply(
              404,
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
            "./test/mocks/inputs/outputs/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-rules/onFailure/end/workflow/middle-step.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`a step level onFailure end rule should override a workflow level failureActions rule`, async function () {
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
            .post("/v2/user/login", {
              "username": "DannyB", "password": "P4ssW0rd"
            })
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
            .get("/v2/user/DannyB")
            .reply(
              404,
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

          nock("http://petstore.swagger.io:80", {
            encodedQueryParams: true,
            reqheaders: { Authorization: AccessToken },
          })
            .delete("/v2/user/DannyB")
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
            "./test/mocks/inputs/outputs/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-rules/onFailure/end/workflow/step-override.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });
    });

    describe(`goto`, function () {
      describe(`step`, function () {
        it(`should goto a different step if the first step hits a onFailure goto rule at step level`, async function () {
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
            .post("/v2/user/login", {
              "username": "DannyB", "password": "P4ssW0rd"
            })
            .reply(
              400,
              {
                error: 'Could not login', errorCode: 400,
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

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .post("/v2/user", {
              "user": { "username": "KanyeW", "firstName": "Kanye", "lastName": "West", "email": "Kanye.west@yeezy.com", "password": "K4nY3", "phone": "+1745376573454", "userStatus": 1 }
            })
            .reply(
              201,
              {
                id: 1,
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

          const inputFile = new Input(
            "./test/mocks/inputs/rules/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-rules/onFailure/goto/step/first-step-to-step.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`should goto a different workflow if the first step hits a onFailure goto rule at step level`, async function () {
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
            .post("/v2/user/login", {
              "username": "DannyB", "password": "P4ssW0rd"
            })
            .reply(
              400,
              {
                error: 'Could not login', errorCode: 400,
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

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .post("/v2/user", {
              "user": { "username": "KanyeW", "firstName": "Kanye", "lastName": "West", "email": "Kanye.west@yeezy.com", "password": "K4nY3", "phone": "+1745376573454", "userStatus": 1 }
            })
            .reply(
              201,
              {
                id: 1,
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

          const inputFile = new Input(
            "./test/mocks/inputs/rules/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-rules/onFailure/goto/step/first-step-to-workflow.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`should goto a different step if a middle step hits a onFailure goto rule at step level`, async function () {
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
            .post("/v2/user/login", {
              "username": "DannyB", "password": "P4ssW0rd"
            })
            .times(2)
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
            .get("/v2/user/DannyB")
            .reply(
              404,
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

          nock("http://petstore.swagger.io:80", {
            encodedQueryParams: true,
            reqheaders: { Authorization: AccessToken },
          })
            .get("/v2/user/DannyB")
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
            .delete("/v2/user/DannyB")
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
            "./test/mocks/inputs/outputs/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-rules/onFailure/goto/step/middle-step-to-step.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`should goto a different workflow if a middle step hits a onFailure goto rule at step level`, async function () {
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
            .post("/v2/user/login", {
              "username": "DannyB", "password": "P4ssW0rd"
            })
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
            .get("/v2/user/DannyB")
            .reply(
              404,
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

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .post("/v2/user", {
              "user": { "username": "KanyeW", "firstName": "Kanye", "lastName": "West", "email": "Kanye.west@yeezy.com", "password": "K4nY3", "phone": "+1745376573454", "userStatus": 1 }
            })
            .reply(
              201,
              {
                id: 1,
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

          const inputFile = new Input(
            "./test/mocks/inputs/rules/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-rules/onFailure/goto/step/middle-step-to-worklfow.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });

      describe(`workflow`, function () {
        it(`should goto a different step if the first step hits a onFailure goto rule at workflow level`, async function () {
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
            .post("/v2/user/login", {
              "username": "DannyB", "password": "P4ssW0rd"
            })
            .reply(
              400,
              {
                error: 'Could not login', errorCode: 400,
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

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .post("/v2/user/login", {
              "username": "DannyB", "password": "P4ssW0rd"
            })
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

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .delete("/v2/user/DannyB")
            .reply(
              201,
              {
                id: 1,
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

          const inputFile = new Input(
            "./test/mocks/inputs/rules/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-rules/onFailure/goto/workflow/first-step.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`a step level onFailure goto rule should override a workflow level failureActions rule`, async function () {
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
            .post("/v2/user/login", {
              "username": "DannyB", "password": "P4ssW0rd"
            })
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
            .get("/v2/user/DannyB")
            .reply(
              404,
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


          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .delete("/v2/user/DannyB")
            .reply(
              201,
              {
                id: 1,
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

          const inputFile = new Input(
            "./test/mocks/inputs/rules/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-rules/onFailure/goto/workflow/step-override.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });
    });

    describe(`retry`, function () {
      describe(`step`, function () {
        it(`should retry the current step once if step rule set to retry and no retryLimit have been set`, async function () {
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
            .post("/v2/user/login", {
              "username": "DannyB", "password": "P4ssW0rd"
            })
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
            .get("/v2/user/DannyB")
            .reply(
              404,
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

          nock("http://petstore.swagger.io:80", {
            encodedQueryParams: true,
            reqheaders: { Authorization: AccessToken },
          })
            .get("/v2/user/DannyB")
            .reply(
              200,
              { Id: 1 },
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


          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .delete("/v2/user/DannyB")
            .reply(
              201,
              {
                id: 1,
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

          const inputFile = new Input(
            "./test/mocks/inputs/rules/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-rules/onFailure/retry/step/retryLimit-not-set.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`should retry the current step as many times as retryLimit is set to when retryLimit has been set and retry rule has been triggered`, async function () {
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
            .post("/v2/user/login", {
              "username": "DannyB", "password": "P4ssW0rd"
            })
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
            .get("/v2/user/DannyB")
            .times(3)
            .reply(
              404,
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

          nock("http://petstore.swagger.io:80", {
            encodedQueryParams: true,
            reqheaders: { Authorization: AccessToken },
          })
            .get("/v2/user/DannyB")
            .reply(
              200,
              { Id: 1 },
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


          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .delete("/v2/user/DannyB")
            .reply(
              201,
              {
                id: 1,
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

          const inputFile = new Input(
            "./test/mocks/inputs/rules/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-rules/onFailure/retry/step/retryLimit-set-to-3.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`should move to the next step when retryLimit has been exhausted and all retries result in errors`, async function () {
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
            .post("/v2/user/login", {
              "username": "DannyB", "password": "P4ssW0rd"
            })
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
            .get("/v2/user/DannyB")
            .times(4)
            .reply(
              404,
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

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .delete("/v2/user/DannyB")
            .reply(
              201,
              {
                id: 1,
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

          const inputFile = new Input(
            "./test/mocks/inputs/rules/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-rules/onFailure/retry/step/retryLimit-set-to-3.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`should use the retryAfter when set and and the server does not provide its own retry-after header`, async function () {
          this.timeout(6000);
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
            .post("/v2/user/login", {
              "username": "DannyB", "password": "P4ssW0rd"
            })
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
            .get("/v2/user/DannyB")
            .times(2)
            .reply(
              404,
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

          nock("http://petstore.swagger.io:80", {
            encodedQueryParams: true,
            reqheaders: { Authorization: AccessToken },
          })
            .get("/v2/user/DannyB")
            .reply(
              200,
              { Id: 1 },
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

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .delete("/v2/user/DannyB")
            .reply(
              201,
              {
                id: 1,
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

          const inputFile = new Input(
            "./test/mocks/inputs/rules/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-rules/onFailure/retry/step/retryLimit-set-to-3-with-3-second-retryAfter.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`should not use the retryAfter when set and and the server provides its own retry-after header`, async function () {
          this.timeout(8000);
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
            .post("/v2/user/login", {
              "username": "DannyB", "password": "P4ssW0rd"
            })
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
            .get("/v2/user/DannyB")
            .times(2)
            .reply(
              404,
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
                "retry-after": "2"
              },
            );

          nock("http://petstore.swagger.io:80", {
            encodedQueryParams: true,
            reqheaders: { Authorization: AccessToken },
          })
            .get("/v2/user/DannyB")
            .reply(
              200,
              { Id: 1 },
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

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .delete("/v2/user/DannyB")
            .reply(
              201,
              {
                id: 1,
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

          const inputFile = new Input(
            "./test/mocks/inputs/rules/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-rules/onFailure/retry/step/retryLimit-set-to-3-with-retry-after-coming-from-header.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        describe(`retry a step first`, function () {
          it(`should retry a step first before retrying the current step when stepId is set on a retry rule`, async function () {
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
              .post("/v2/user", {
                "user": { "username": "KanyeW", "firstName": "Kanye", "lastName": "West", "email": "Kanye.west@yeezy.com", "password": "K4nY3", "phone": "+1745376573454", "userStatus": 1 }
              })
              .times(2)
              .reply(
                201,
                {
                  id: 1,
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

            nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
              .post("/v2/user/login", {
                "username": "DannyB", "password": "P4ssW0rd"
              })
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
              .get("/v2/user/DannyB")
              .reply(
                404,
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

            nock("http://petstore.swagger.io:80", {
              encodedQueryParams: true,
              reqheaders: { Authorization: AccessToken },
            })
              .get("/v2/user/DannyB")
              .reply(
                200,
                { Id: 1 },
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


            nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
              .delete("/v2/user/DannyB")
              .reply(
                201,
                {
                  id: 1,
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

            const inputFile = new Input(
              "./test/mocks/inputs/rules/input.json",
              "inputs",
            );

            const arazzo = new Arazzo(
              "./test/mocks/arazzo/arazzo-rules/onFailure/retry/step/set-to-retry-a-step-before-current-step.json",
              "arazzo",
              { logger: logger },
              docFactory,
            );
            arazzo.setMainArazzo();

            try {
              await arazzo.runWorkflows(inputFile);
            } catch (err) {
              console.error(err)
              expect(err).to.not.be.instanceOf(Error);
            }
          });
        });

        describe(`retry a workflow first`, function () {
          it(`should retry a workflow first before retrying the current step when workflowId is set on a retry rule`, async function () {
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
              .post("/v2/user", {
                "user": { "username": "KanyeW", "firstName": "Kanye", "lastName": "West", "email": "Kanye.west@yeezy.com", "password": "K4nY3", "phone": "+1745376573454", "userStatus": 1 }
              })
              .times(5)
              .reply(
                201,
                {
                  id: 1,
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

            nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
              .post("/v2/user/login", {
                "username": "DannyB", "password": "P4ssW0rd"
              })
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
              .get("/v2/user/DannyB")
              .reply(
                404,
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

            nock("http://petstore.swagger.io:80", {
              encodedQueryParams: true,
              reqheaders: { Authorization: AccessToken },
            })
              .get("/v2/user/DannyB")
              .reply(
                200,
                { Id: 1 },
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


            nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
              .delete("/v2/user/DannyB")
              .reply(
                201,
                {
                  id: 1,
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

            const inputFile = new Input(
              "./test/mocks/inputs/rules/input.json",
              "inputs",
            );

            const arazzo = new Arazzo(
              "./test/mocks/arazzo/arazzo-rules/onFailure/retry/step/set-to-retry-a-workflow-before-current-step.json",
              "arazzo",
              { logger: logger },
              docFactory,
            );
            arazzo.setMainArazzo();

            try {
              await arazzo.runWorkflows(inputFile);
            } catch (err) {
              console.error(err)
              expect(err).to.not.be.instanceOf(Error);
            }
          });
        });
      });

      describe(`workflow`, function () {
        it(`should retry the current step once if step rule set to retry and no retryLimit have been set`, async function () {
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
            .post("/v2/user/login", {
              "username": "DannyB", "password": "P4ssW0rd"
            })
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
            .get("/v2/user/DannyB")
            .reply(
              404,
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

          nock("http://petstore.swagger.io:80", {
            encodedQueryParams: true,
            reqheaders: { Authorization: AccessToken },
          })
            .get("/v2/user/DannyB")
            .reply(
              200,
              { Id: 1 },
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


          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .delete("/v2/user/DannyB")
            .reply(
              201,
              {
                id: 1,
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

          const inputFile = new Input(
            "./test/mocks/inputs/rules/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-rules/onFailure/retry/workflow/retryLimit-not-set.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });
    });
  });
});
