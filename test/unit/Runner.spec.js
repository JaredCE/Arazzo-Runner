"use strict";

const expect = require("chai").expect;
const nock = require("nock");

const Runner = require("../../src/Runner");

describe(`Runner`, function () {
  describe(`runArazzo`, function () {
    it(`should run an arrazo collection and resolve if the outputs resolve on a 201`, async function () {
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/single-workflow/single-step/arazzoMock-user-single-workflow-single-step.json",
        )
        .reply(
          200,
          [
            "1f8b08000000000000139553b172db300cddf51538a6632326ab3737ed900eb95c935e875e065a826d2612c902507d8ecfffde23259b96ebe41c4d14f11e80073c6e0a0065c8bcbe7a3501755d5e95d7ea73bcb46e1eaf36050080122b0d4644c7489c1000aa46aec806b1dec5d8e312619a72c12f4f2ff3c6af60ee090cdca3c0837842f8c9483b3a776d6b681da95332e698769af41789877ab1db2b55006c53c7ec3baaf06bee89d5047e2756af024039d36619973ea09bdedf0ea90154474d8c2e45024fb426b32a175696dd2ce22bef049d94956ff5774358df7cd3bddccb1f9d73489a70ce7a89a666dd1aebb4208b6e7df5c23a9632c1ea5cd8045b3eb377b9baac436a6e88aa74bf2d009e92bed5309c13b276a1db3af22b42237830b4f1ac6f52180c385cc11875b4d0695e8878a8dee659173ae1bd5dc66a66cf58c91e0ba002f9802416c70ce8d77274f75ea6f7b3ed330e4bdfe44c2c64dd42f5c619e1e79658ee3e4068ccc7f0d81adb9c0b0e8679e5a93e1bbff4eeec4ee2681ec448c7638675820b2495ac97bfc3bf7cde9db6d96982215b140e6cba0f1fda743a725282c47d9ae8c137ed9c60847f3a64f9e2ebf5ff9e191eebe3a0c984d0d82a25d5a347b71ff4baf12695fbd49bb94c5e3cd43ceeb1939de541d99e48c8c13bc672e6ebf585b6b53a31a8a7fcaa8b6df10f42f86f7f80050000",
          ],
          {
            "accept-ranges": "bytes",
            "access-control-allow-origin": "*",
            "cache-control": "max-age=300",
            connection: "keep-alive",
            "content-encoding": "gzip",
            "content-length": "510",
            "content-security-policy":
              "default-src 'none'; style-src 'unsafe-inline'; sandbox",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-resource-policy": "cross-origin",
            date: "Wed, 14 Jan 2026 15:28:52 GMT",
            etag: 'W/"92f9a0783c41491dd6ace8818df8d07c359dca87d21d472a7d1038dc51736661"',
            expires: "Wed, 14 Jan 2026 15:33:52 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "166c80c877e179616f36988af770cb759d9d9363",
            "x-frame-options": "deny",
            "x-github-request-id": "29AB:37AEF1:11C32:1EE31:6967B633",
            "x-served-by": "cache-lhr-egll1980020-LHR",
            "x-timer": "S1768404533.745660,VS0,VE128",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/users-openapi.json",
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
            date: "Wed, 14 Jan 2026 15:28:52 GMT",
            etag: 'W/"d38379461bc9571f3e57ed61b7c4f2b6d189a3b3cf79f0449c1fde6e9379637e"',
            expires: "Wed, 14 Jan 2026 15:33:52 GMT",
            "source-age": "95",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "HIT",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "43babc4d80b7096c92ad0e48d75c5372c81569c1",
            "x-frame-options": "deny",
            "x-github-request-id": "71BA:2BAC73:289635:4D4859:6967AB80",
            "x-served-by": "cache-lhr-egll1980020-LHR",
            "x-timer": "S1768404533.931263,VS0,VE2",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("http://petstore.swagger.io:80", {
        encodedQueryParams: true,
      })
        .post("/v2/user", "[object Object]")
        .reply(201, { id: 123 });

      const runner = new Runner();

      try {
        await runner.runArazzo(
          "https://raw.githubusercontent.com/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/single-workflow/single-step/arazzoMock-user-single-workflow-single-step.json",
          "./test/mocks/inputs/userInput.json",
        );
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }
    });
  });
});
