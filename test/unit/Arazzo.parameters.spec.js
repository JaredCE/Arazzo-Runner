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

describe(`OpenAPI Parameter Types`, function () {
  const logger = new Logger();

  describe(`headers`, function () {
    describe(`array`, function () {
      it(`handle when header is styled as simple and is exploded`, async function () {
        nock("https://raw.githubusercontent.com:443", {
          encodedQueryParams: true,
        })
          .get(
            "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/header/simple-array-exploded.json",
          )
          .reply(
            200,
            [
              "1f8b0800000000000013ed59cf6fdb3614bee7af786077588154ced262879c96350d606c5883a63d0c59b032d2b3cd5622399272e215f9df0752b24d51a4e424dea1407cb224f2fdfcdefb1ea56f07004448e454327202e4757694bd2687f66e2e2a293872a3c9097c3b0000203a5f6045b737ec3285d4e0051aef2600312b8956a0b8f982b97112db27520989ca30d49d1d56143538176a15dc1f92362cd13d6545e4ae2793718373548150b7642654454dbbe8e7372458711f6e219c5638ac4d1bc5f8bc27a9731dc82577551973ac5546deaec3d615e25d7504c68d0c0d0c4cc03b5ac9d22d28c47cce9024c5cb8530e2932afbc9d8e8a04ad155a88219aca2091c0add0343b5b6ad976c72aba89468a162548d3b46d2d0f9debd8c427c0ce46998ef04f471a847c03e04f751c087908f15533c975e363fd2fd1692a121ee1f0b0c6da8a907a0112fb20275ae98344c70075634d00802c6c12c10b4110a7ba5c9eb8a9cc015a14bca4a7a532239b49b79e15400d1a22cc8b56febe6bf673551f84fcd94f3f4aa09c9a15fccd7ded27e1c3731b44470102adaa869d9a2d80b5d44103f82f51eca83c70a69f19e97ab7eb2ef077cfafe9ce960f59975a3729f59f799759f59b7aff69975e1bb63dd0b34a7ae2ca23415564cb45a862a65a84ae215325a1d23e436486f7d042629eeb9033ca603c4a96fac0d248c1eaece3112ecab4913e108490cd0c4f824f1f020264971b8fb8d45394a8e7bf13c5120e3253254243b96c92e85122d95e162d9a15cfa05132fc954be8789732fe51823d0a7812841a43b14eba3c8f451743a3408ec4eaa89f8c68975f418782e54f5f4a3e0634e0a41dc3fc9c21eb3c18a0231739197812bfb1f9dd65adb8c27f40e84f0932c052db03867253e3d8eb92806e2b8cba1faf5713a62ad9ce178257757a8359d3f4cc068e0d2f0eba5cff3f38671bae5f2adcc1e933c72600c3de95b2fd14c8bb8aa7e965244b0154725fbfb2b2686ddae358d2ded56a231af1533ab4bfb95a38327725a9b8550ec5fda623d1615c97ec34e58d64da4bbd98f9b2b9b05d2025560d2416b16617c26b61f600c33cd2874794be773547081c66fa961497e5c300d4c0305eda628d0a896deb6f63a03f853d490530e33c60b10b581ca3ea637f6ef5a193570b530469e4c26bab9953171fd63efd64b100a04872ba6f26ca610b92830e3680ee145bb2ab26bc2543e7999019c0b05c61aded87c08abd6b65aa36b295432f88a2bf8ac25e68c96afbee2ea33180106b56956f82187192b0d2a9dfdb58e3e59a2d26d887eca8eb2a3f57d83aad2ef6797a8962c7781ee9be9d64cd63b72c10dcdfd37809bbc6f524db0a2ac6c41629056bf6cc5910e044b9623d71893762a69be4038de180b406a557a36dedede66d4adca849a4f5a597af2fbf4edbb3f2edfbd3ace8eb285a94a12406c8d7b4b97ee5112f657d79bad8e4489a466e17d1f9c4834936fae9eef7d1fe6e12b525d5715750732726e016707859b154ccffcf208b0fc014dadb8c332e3f3b261166fb9e50167a86b2656e7059a5f57d3a2431754d10a2d1a36de36bfc400d0f4a6f0755233dc50b31861c4e9996541eb9c11a09cfdfdd7b49b59c5ce69e124e63eb8c626b11f14ceac8a1793ed87da49fb7d76d258bddbb49470fcee55fc4d9adfb2f6e4caff762a4b0760f3df7fc1d232de954d7ae7cd4baf40a2914b14cb9046855a0a5ba321791e1f1df56783005cbace73d47a5697b0817e9812db9d909b58d4a99425cbddaec9171db0dad6f554d6601484c1ec1cc621761d1e441a9cb9e8a4a7fd373bc46aca97b464054ccf40d7d671ec15f58ebade8ceaba40035c1898899aefaca53f1ef59ab4256addefd15d0e902db1671e612d8fb71dbf69db6ba47725793d6f4b318173ef96a85666c1f8bc9d0d56a26ec6098fedee0c2a4ecb3391071364d7568f04d35dffdc9f47a2735bcffeee19331478eaaac636e4cd102494cbc9a0d05a7b0d2f94f97e5d7fba8d4a77753a2043ceb6a26c7cc353733290ba3f4636198f9ab08bfa76f65b8f3bc90c5aa01edc1ffc07a937df2351240000",
            ],
            {
              "accept-ranges": "bytes",
              "access-control-allow-origin": "*",
              "cache-control": "max-age=300",
              connection: "keep-alive",
              "content-encoding": "gzip",
              "content-length": "1491",
              "content-security-policy":
                "default-src 'none'; style-src 'unsafe-inline'; sandbox",
              "content-type": "text/plain; charset=utf-8",
              "cross-origin-resource-policy": "cross-origin",
              date: "Thu, 15 Jan 2026 13:57:26 GMT",
              etag: 'W/"c70499052dadc2bfa0db9974bef60ba6bee6c55a1a65976b39609e5799a2a9fc"',
              expires: "Thu, 15 Jan 2026 14:02:26 GMT",
              "source-age": "0",
              "strict-transport-security": "max-age=31536000",
              vary: "Authorization,Accept-Encoding",
              via: "1.1 varnish",
              "x-cache": "MISS",
              "x-cache-hits": "0",
              "x-content-type-options": "nosniff",
              "x-fastly-request-id": "e3214974c6e5c4399167d7bcbf3cfb4a81b682a5",
              "x-frame-options": "deny",
              "x-github-request-id": "E767:93F2B:7BB2D:CB92F:6968F246",
              "x-served-by": "cache-lhr-egll1980038-LHR",
              "x-timer": "S1768485447.800110,VS0,VE129",
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
              date: "Thu, 15 Jan 2026 13:58:27 GMT",
              server: "Jetty(9.2.9.v20150224)",
              "transfer-encoding": "chunked",
            },
          );

        const inputFile = new Input(
          "./test/mocks/inputs/parameter-styles/input.json",
          "inputs",
        );

        const arazzo = new Arazzo(
          "./test/mocks/arazzo/openapi-parameter-tests/header/array-exploded.json",
          "arazzo",
          { logger: logger },
          docFactory,
        );
        arazzo.setMainArazzo();

        try {
          await arazzo.runWorkflows(inputFile);
        } catch (err) {
          expect(err).to.not.be.instanceOf(Error);
        }
      });

      it(`handle when header is styled as simple and is unexploded`, async function () {
        nock("https://raw.githubusercontent.com:443", {
          encodedQueryParams: true,
        })
          .get(
            "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/header/simple-array.json",
          )
          .reply(
            200,
            [
              "1f8b0800000000000013ed59cf6fdb3614bee7af786077d88054ced262879c96350d606c5883a53d0c59b032d2b3cd5622399272e215f9df0752b24d51a4a4a4d9a1407cb224f2fde2f7f17b94be1c0010219153c9c8099057d951f68a1cdabbb9a8a4e0c88d2627f0e5000080e87c8515dddfb0c31452831768bc9b00c46c245a83e2e613e6c6596c9f4825242ac35077665853d4e052a84d707fc8dab045f7941591bb9e4dc60d2e510546dd9085501535eda09f5e9360c47d3885705ae1b0376d14e3cb9ea5ce756097dc55652cb1d61979b32d5bd78877d531180f320c300801ef68254b37a010cb254392342f57c2880faaec2fc6ce07558a6e4217cc60155dc0a1d23db054dbd87a8b4d6e1595122d548caa7162250d5d3e799651888f813c0df349401f877a04ec43701f057c08f91899e26be9ade67bfab4443234c4fd6381a10d35f50034e2242b50e78a49c304776045038d21601ccc0a411ba1b0474d5e57e404ae085d5356d29b12c9a19dcc0be70288166541aefd5877ffbda889c27f6aa65ca6574d490e7d325f7b43fb75dcd5d00ac141e868e7a6558be249e42282f811acf7501e3c56488b77bcdcf417fb7e20a76f2f990e569f55376af759759f55f75975fb6e9f5517be39d5bd4073ea681195a9903151b60c3165882571868cb26344dc06e5ad8fc0a4c43def008fd901e2d237b60d24821e66e79808f6dda485704424066462bc9378781193a238bcfb8d55392a8e4f92798220e3141922c9449a4c214a942ac3649940973e61e2944cadf7b0703e091d6302fa75204a08e904b23e4a4c1f25a7438dc074514dd4372eaca3c7c073a1aaaf3f0a3ee6a410d4fd832cec311bac29100b577919a4f2f4add3d66bbbe209bf0325fc204b410b2cce59895f5fc75c1403759c72a87e759cae586b67b85ec9d9156a4d970f33305ab834fc7acbe7e579c338dd6bf9de664f491ed9308699f4a39768e645dc557f955242b0374725fbfb33269add6e344d2ced54a231af15339b4bfb95a38327725a9b9550ec5fda623d5615c97ec54e59b69b4877b25f37479b15d2025510d2411b16617c21f61f600c334d2b74794b974b547081c6df52434abe5f310d4c0305edba28d0a8d6deb4f63a03f853d490530e0bc60b10b581ca3ea637f6efd6193570b532469ecc66bab9953171fd7defd60f2014080e574ce5d94221725160c6d11cc28b765464d68ca97cf64306702e14181b7813f3216cdad86a8d6e4ba192c167dcc0472d3167b47cf919371fc10830a84d33c22f392c586950e9ecaf6df5c91a956e4bf46376941d6def1b54957eb7b844b566b92b743f4c3766b69d910b6e68eebf01dcadfb6ea9095694952d480cd2eae7bd39d28160c972e41a63d64e25cd5708c7bb600148ad4a2fc6dbdbdb8cba519950cb596b4bcf7e9bbf79fbfbe5db97c7d951b632554902886d716fe5d23d4ac2feea7a37d5892891d4acbcef83338966f6c5f1f9decf6119be22d5755551772023e71670b651b8d9c0fccca74780e53fd0d48a3b2c33be2c1b65f1865b1d7081bacdc4fabc40f3cb665e74e4822a5aa145c32edbe69768009abd297c9dd43437d4ac4614717e6655d026670428177fff35edae57b17d5ad889b90faeb14eec3b850bebe2c56cffa176d67e9f9d35514feb961289dfbd8cbf49f3b7ac07a58277b26c1479414b3d3dd1ffedcc962ecfeebffffaa5d5c32b0b89ce7b991e7d9a5f50d70495863c2ad452580687d27a7c74d4ef1c02e8e93acf51eb455dc28e18e182d9bd0bb989559d4a59b2dccd9a7dd281e6ed534fad1a8c4234e8acc33ac4aec3634a8342579df459e0f5845acdf99a96ac80f919e8da268e3dca4ff4f57ad4d7051ae0c2c042d47cb2977ef3d4dbc2ad8cebfe0ede5508d9ca7ee6c9d9fa78af07cda6be457ad792b723ee052848eeed1ad5c6ac185fb69dc346d44db3e169e19d41c5697926f2a0bfecc6ea49645a13cefd6e25dad5f5e2ef9e404383a78e3576bbdeb54842b93519345a6b6f3b0c6dbedbf24fb755e98e4e176428d9d694ad6f78a64e1652f79bcc66c5a3214c71df7686db6628b98216a807f707ff01b288801a6f240000",
            ],
            {
              "accept-ranges": "bytes",
              "access-control-allow-origin": "*",
              "cache-control": "max-age=300",
              connection: "keep-alive",
              "content-encoding": "gzip",
              "content-length": "1502",
              "content-security-policy":
                "default-src 'none'; style-src 'unsafe-inline'; sandbox",
              "content-type": "text/plain; charset=utf-8",
              "cross-origin-resource-policy": "cross-origin",
              date: "Thu, 15 Jan 2026 15:00:36 GMT",
              etag: 'W/"2ff92dfa55f836ab4e5ee077497a9c9bcc0c5050a5ded5fc75358f34415cfa6a"',
              expires: "Thu, 15 Jan 2026 15:05:36 GMT",
              "source-age": "0",
              "strict-transport-security": "max-age=31536000",
              vary: "Authorization,Accept-Encoding",
              via: "1.1 varnish",
              "x-cache": "MISS",
              "x-cache-hits": "0",
              "x-content-type-options": "nosniff",
              "x-fastly-request-id": "17e2827cf9ffda70683a5c39f019b3551ebce95c",
              "x-frame-options": "deny",
              "x-github-request-id": "1D9E:35E8B5:A692A:10CE0F:69690113",
              "x-served-by": "cache-lhr-egll1980041-LHR",
              "x-timer": "S1768489236.139642,VS0,VE123",
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
              date: "Thu, 15 Jan 2026 13:58:27 GMT",
              server: "Jetty(9.2.9.v20150224)",
              "transfer-encoding": "chunked",
            },
          );

        const inputFile = new Input(
          "./test/mocks/inputs/parameter-styles/input.json",
          "inputs",
        );

        const arazzo = new Arazzo(
          "./test/mocks/arazzo/openapi-parameter-tests/header/array.json",
          "arazzo",
          { logger: logger },
          docFactory,
        );
        arazzo.setMainArazzo();

        try {
          await arazzo.runWorkflows(inputFile);
        } catch (err) {
          expect(err).to.not.be.instanceOf(Error);
        }
      });

      describe(`ignores`, function () {
        xdescribe(`Accept`, function () {
          it(`ignores the styling for this header`, async function () {
            nock("https://raw.githubusercontent.com:443", {
              encodedQueryParams: true,
            })
              .get(
                "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/header/ignore-Accept.json",
              )
              .reply(
                200,
                [
                  "1f8b0800000000000013ed594d6fdc3610bdfb570c981e5ac0d1ba4ed0834f75e31858b4688c3a3914aed1d0d2ec2e138964c991ed6de0ff5e90d2ee4a14f561677b08e03dad24723e1edff00da52f07004c69945c0b7602ec557294bc6287ee6eaa0aad244ab2ec04be1c0000309baeb0e0bb1b6e98414e7881d4b809c068add11954379f30256fb17ea28dd26848a06dcd70a638e1529975707fc8dab045ff546491bb0d9b42122ed10446fd90853205a77ad04faf5930e2219cc2242f70d89b2523e4b263a9751dd865f7451e4bac76c6de6c606b1b695cb50cc6830c030c42c07b5ee8dc0fc8d4722990f59ad72b45ea83c9bb8bb1f5c18de1ebd085202ca20b3804dd23a1dac4d6596c7667b8d6e8a842a6c48948125fee3dcb28c5c748de4ff349441fa77a84ec43741f257c48f95831c5d7b2b19aeff97e0b8978c8fba712c312a772801af122cbd0a64668124a7ab22241650884045a215852063ba529cb829dc015e3b75ce4fc264776e826cbccbb0066559eb1eb66acdbff8da899c17f4a617ca657152487cd62be6e0cede2b8c5d009c141e868eba6568b6c2f721161fc08d73b2c0f1e1be4d93b99afbb8bfd3090d3b7974c8babcfaa1bb5fbacbacfaafbacba5db7cfaa0bdf9cea5e209dfab288ca545831d16a19aa94a12a8957c868758c88dba0bc7519d82b71cf3bc0537680b8f48d6d033d410f57e7980876ddf40be188480cc8c47827f178107b457178f71b43392a8e7bc9bca740c64b64a8482696c994428996ca70b14c28976ec1c44bb26fbd8785732fe51813d0af23518f904e28d62789e993e474a811982eaa3df8c68575f41878ae4cf1f547c1a79c1402dc3fe8cc1db3c19902b5f0c8eb2095fdb74e1baff58af7f81d80f083ce15cf303b17397e3d8ea9ca06709c72a87e75dc8f586d6718afded9055acb978f33300a5c3ffd3acbd7c8f34648bed3f29dcd8e923cb1610c33e946af91e659dc557795fa8460678e6bf1f767ec6976dbd154b1d45399c5b43482d697ee2b478b4fecb4a49532e25f5e733d868a16bf620b96cd26d29edcc4cd97cd0a79862608e9a00e8b09b950bb0f3024a86a852eeff87289062e909a5b6a5892ef57c282b0c0c1fa2e0a2c9adbc6b4fa3a01f853959072090b2133502541e11ef31bf777e38c135cad88f4c96c66ab5b8950d7df776efd00ca809270254c9a2c0ca254192612e9105ed4a322b366c2a4b31f12807365805ce055cc87b0ae632b2dfa2d856b019f710d1fadc654f0fce5675c7f04524068a91ad1841c1622273436f96b833ebb45636b887e4c8e92a3cd7d4253d8778b4b34b722f54077c3f463669b19a992c4d3e61bc0edba6f979a61c1455e938490173fefccb116057391a2b418b376aa79ba4238de060bc04a933762bcbbbb4bb81f9528b39cd5b6ececb7f99bb7bf5fbe7d799c1c252b2a7216506cc37b2797fe512fedafaeb753bd8832cd69d5f83e38d348b32fbe9e1f9a392cc357a4b62c0aee0f64ecdc11ce350a376b989f35cb23e0f21f48a5919ecb422ef34a591ac39d0ef840fd66e27c5e20fdb29e672db9e08617e8d8b0cdb6faf53400d5de14be4eaa9a1b4eab11459c9f391574c99102e3e3efbea6ddf62aae4f0b3b31ffc135d6897d6770e15cbc98ed3ed4ceeaefb3b32aea69dd524fe2f72fadf0e7ae68eef59ef5a85cf05ee795242f786ea7673af826f291599da629eaceabecff2d275a57bb75c1c988fbd0f41e52defe6fbe28aa95fbca91b7f506a953e851ac7a8a7ec8a341ab95db6bc226e0f8e8a8dbe3044562cb34456b17650edb120ea172bb2c4a8a61c5b5ce45ea67cd3ed9409dc7b186d1620ace00210eb1ebf0405551cba3d37f6a793d01abb9bce5b9c8607e06b674896367739ae8ebf5a8af0b24908a60a14a39d94bb7cdeb888d6b386c576bda5aa6eb06256908efedf14eb92af9d930bd6da9b177efa43248eeed2d9a35ad845cd63dce5a95555bd450ed7b4223797ea6d2a0136ec7da10f37ef53a6ff655d1feb3137ffbac1c1a3cf555e38465dbcc29e3d764d068691b7b5c68f3dda6fe6c8d4a7b743f2043c9d6a61cbee1e9bf1748db6d87ab158f8630c57dddc36edab6de1574443d7838f80f03345b4619250000",
                ],
                {
                  "accept-ranges": "bytes",
                  "access-control-allow-origin": "*",
                  "cache-control": "max-age=300",
                  connection: "keep-alive",
                  "content-encoding": "gzip",
                  "content-length": "1526",
                  "content-security-policy":
                    "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                  "content-type": "text/plain; charset=utf-8",
                  "cross-origin-resource-policy": "cross-origin",
                  date: "Fri, 16 Jan 2026 12:54:01 GMT",
                  etag: 'W/"a2a59a56775010a0f6d7b09bc701946ec5fc3ec4ac74e6e203d45d266dc7a59f"',
                  expires: "Fri, 16 Jan 2026 12:59:01 GMT",
                  "source-age": "0",
                  "strict-transport-security": "max-age=31536000",
                  vary: "Authorization,Accept-Encoding",
                  via: "1.1 varnish",
                  "x-cache": "MISS",
                  "x-cache-hits": "0",
                  "x-content-type-options": "nosniff",
                  "x-fastly-request-id":
                    "0b0aaa26c0c48c67ffe9c78a6eb595eae98a52dd",
                  "x-frame-options": "deny",
                  "x-github-request-id": "D987:3E4FC0:70639:BEE47:696A34E7",
                  "x-served-by": "cache-lhr-egll1980069-LHR",
                  "x-timer": "S1768568041.004713,VS0,VE122",
                  "x-xss-protection": "1; mode=block",
                },
              );

            nock("http://petstore.swagger.io:80", {
              encodedQueryParams: true,
              reqheaders: { "x-simple": "blue", accept: "blue,black,brown" },
            })
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
                  date: "Thu, 15 Jan 2026 13:58:27 GMT",
                  server: "Jetty(9.2.9.v20150224)",
                  "transfer-encoding": "chunked",
                },
              );

            const inputFile = new Input(
              "./test/mocks/inputs/parameter-styles/input.json",
              "inputs",
            );

            const arazzo = new Arazzo(
              "./test/mocks/arazzo/openapi-parameter-tests/header/ignore-Accept.json",
              "arazzo",
              { logger: logger },
              docFactory,
            );
            arazzo.setMainArazzo();

            try {
              await arazzo.runWorkflows(inputFile);
            } catch (err) {
              expect(err).to.not.be.instanceOf(Error);
            }
          });
        });

        xdescribe(`Authorization`, function () {
          it(`ignores the styling for this header`, async function () {
            nock("https://raw.githubusercontent.com:443", {
              encodedQueryParams: true,
            })
              .get(
                "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/header/ignore-Authorization.json",
              )
              .reply(
                200,
                [
                  "1f8b0800000000000013ed594d6fdc3610bdfb570c981e5ac0d1ba4ed0834f75e31858b4688c3a3914aed1d0d2ec2e138964c991ed6de0ff5e90d2ee4a14f561677b08e03dad2472bef81edf50fa7200c09446c9b56027c05e2547c92b76e8eea6aad04aa224cb4ee0cb010000b3e90a0bbebbe18619e48417488d9b008cd61a9d4175f30953f216eb27da288d8604dad60c678a132e955907f787ac0d5bf44f4516b9dbb02924e1124d60d40f59285370aa07fdf49a05231ec2294cf20287bd5932422e3b965ad7815d765fe4b1c46a67eccda66c6d238dab96c178906180410878cf0b9dfb01995a2e05b25ef37aa5487d30797731b63eb8317c1dba1084457401874af7c8526d62eb2c36bb335c6b74502153e2c44a125fee3dcb28c4c740de0ff349401f877a04ec43701f057c08f91899e26bd958cdf77cbf44221ee2fea9c0b0c4a91c80469c6419dad4084d42490f5624a80c8190402b044bca60879ab22cd8095c317ecb45ce6f7264876eb2ccbc0b6056e519bb6ec6bafddf889a19fca714c6677a5595e4b049e6ebc6d06e1db735744270103adabaa9d522db8b5c44103f82f50eca83c70679f64ee6ebee623f0ce4f4ed25d3c2eab3ea46ed3eabeeb3ea3eab6ed7edb3eac237a7ba1748a79e1651990a191365cb105386581267c8283b46c46d50deba08ec95b8e71de0293b405cfac6b6819ea087d93926825d37fd42382212033231de493cbe88bda238bcfb8d55392a8e7bc9bc8720e3141922c9449a4c214a942ac3649940972e61e294ec5bef61e1dc0b1d6302fa7520ea11d209647d92983e494e871a81e9a2da53dfb8b08e1e03cf9529befe28f894934250f70f3a73c76c70a6402d7ce57590cafe5ba78dd77ac57bfc0e94f083ce15cf303b17397e7d1d53950dd471caa1fad5717fc56a3bc3f5ea9d5da0b57cf93803a385eb875f67f91a79de08c9775abeb3d9519227368c6126dde835d23c8bbbeaae529f10eccc712dfefe8c3dcd6e3b9a2a967a2ab3989646d0fad27de568e1899d96b45246fccb6bacc7aaa2c5afd82acb6613694f6ed6cdd366853c431384745087c5845ca8dd07181254b54297777cb944031748cd2d35a4e4fb95b0202c70b0be8b028be6b631adbe4e00fe5425a45cc242c80c544950b8c7fcc6fddd38e304572b227d329bd9ea5622d4f5f79d5b3f8032a0245c0993260b8328558689443a8417f5a8c8ac9930e9ec8704e05c1920177815f321acebd84a8b7e4be15ac0675cc347ab31153c7ff919d71f8114105aaa46344b0e0b91131a9bfcb5a93ebb4563eb12fd981c25479bfb84a6b0ef1697686e45ea0bdd0dd38f996d66a44a124f9b6f00b7ebbe5d6a860517790d12425efcbc33c75a10cc458ad262ccdaa9e6e90ae1781b2c002b4dde88f1eeee2ee17e54a2cc7256dbb2b3dfe66fdefe7ef9f6e5717294aca8c85900b10dee9d5cfa47bdb0bfbade4ef522ca34a755e3fbe04c23cdbe783e3f34735886af486d5914dc1fc8d8b9039c6b146ed6303f6bd223c0f21f48a5911ecb422ef34a591ac39d0ef840fd66e27c5e20fdb29e672db9e08617e8d0b0cdb6faf53400d5de14be4eaa9a1b4eab11459c9f391574c99102e3e3efbea6ddf62aae4f0b3b31ffc135d6897d6770e15cbc98ed3ed4ceeaefb3b32aea69dd524fe2f72fadf0e7ae68eef59ef5a85cf05ee795242f786ea7673af826f29159f56dc5ff6f6ab4ae36ed829311f7a1e93d64befddf7c5f540bf895c370eb455287efd192f5707fc8a341ab95db72c25ee0f8e8a8dbea045cb1659aa2b58b32872d93c352b9cd1625c56ac5b5ce45ea67cd3ed940a4c76b0da39c0a8e02611d62d7e1b9aa8296af4effe1e5f5845acde52dcf4506f333b0a54b1c3b7bd4445faf477d5d208154040b55cac95ebadd5e47735cdf61bb92d396345df72949437f6f8f770256a9d006e96d4b8d2d7ca79841726f6fd1ac6925e4b26e75d6aaacbaa38678df131ac9f33395060d713bd686a6f78bd879b3bd8ab6a19df8db47e6d0e0a9678dd3976d4fa78c5f9341a3a56dec71a1cd771bfed9ba2aedd1fd05194ab636e5ea1bbe04e82da4ed76c5d58a474398e2be6e6537dd5bef0a3aa01e3c1cfc072723d08420250000",
                ],
                {
                  "accept-ranges": "bytes",
                  "access-control-allow-origin": "*",
                  "cache-control": "max-age=300",
                  connection: "keep-alive",
                  "content-encoding": "gzip",
                  "content-length": "1523",
                  "content-security-policy":
                    "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                  "content-type": "text/plain; charset=utf-8",
                  "cross-origin-resource-policy": "cross-origin",
                  date: "Fri, 16 Jan 2026 13:12:58 GMT",
                  etag: 'W/"590650ef8bd30fbd840b56b3c86c6f2f93075c1700dd4389ebe8179154c88734"',
                  expires: "Fri, 16 Jan 2026 13:17:58 GMT",
                  "source-age": "0",
                  "strict-transport-security": "max-age=31536000",
                  vary: "Authorization,Accept-Encoding",
                  via: "1.1 varnish",
                  "x-cache": "MISS",
                  "x-cache-hits": "0",
                  "x-content-type-options": "nosniff",
                  "x-fastly-request-id":
                    "c1bfa6febdb8c8898584334bf2a5dd7d7d7d2b77",
                  "x-frame-options": "deny",
                  "x-github-request-id": "9340:1057FA:79ABC:CED57:696A3959",
                  "x-served-by": "cache-lhr-egll1980060-LHR",
                  "x-timer": "S1768569178.967013,VS0,VE117",
                  "x-xss-protection": "1; mode=block",
                },
              );

            nock("http://petstore.swagger.io:80", {
              encodedQueryParams: true,
              reqheaders: {
                "x-simple": "blue",
                Authorization: "blue,black,brown",
              },
            })
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
                  date: "Thu, 15 Jan 2026 13:58:27 GMT",
                  server: "Jetty(9.2.9.v20150224)",
                  "transfer-encoding": "chunked",
                },
              );

            const inputFile = new Input(
              "./test/mocks/inputs/parameter-styles/input.json",
              "inputs",
            );

            const arazzo = new Arazzo(
              "./test/mocks/arazzo/openapi-parameter-tests/header/ignore-Authorization.json",
              "arazzo",
              { logger: logger },
              docFactory,
            );
            arazzo.setMainArazzo();

            try {
              await arazzo.runWorkflows(inputFile);
            } catch (err) {
              expect(err).to.not.be.instanceOf(Error);
            }
          });
        });

        describe(`Content-Type`, function () {
          it(`ignores the styling for this header`, async function () {
            nock("https://raw.githubusercontent.com:443", {
              encodedQueryParams: true,
            })
              .get(
                "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/header/ignore-Content-Type.json",
              )
              .reply(
                200,
                [
                  "1f8b0800000000000013ed595d6fdb36147dcfafb860f7b002899ca5c51ef2b4ac690063c31a34edc390052b235ddb6c259223af9c7845fefb404ab6258a929cd41850207eb224f27ef11c9e4be9eb0100531a25d7829d027b951c27afd8a1bb9baa422b89922c3b85af070000cca60b2cf8f6861b6690135e22356e02305a697406d5ed674cc95bac9f68a3341a12685b339c294e38576615dc1fb2366cd13f1559e46ec3a69084733481513f64a64cc1a91ef4f36b168c7808a730c90b1cf666c90839ef586a5d0776d97d91c712ab9db137ebb2b58d34ae5a06e34186010621e03d2f74ee07646a3e17c87acdeb8522f5d1e4ddc5d8f8e0c6f055e8421016d1051c2add234bb58eadb3d8ecce70add141854c893b5692f87cef5946213e06f27e98ef04f471a847c03e04f751c087908f9129be968dd5fcc0f74b24e221ee9f0a0c4b9cca0168c44996a14d8dd02494f4604582ca100809b440b0a40c76a829cb829dc235e34b2e727e9b233b749365e65d00b32acfd84d33d6cdff46d4cce03fa5303ed3ebaa24874d32df348676ebb8a9a1138283d0d1c64dad16d95ee42282f811ac77501e3c36c8b377325f7517fb6120a7ef2f9916569f55376af759759f55f75975bb6e9f5517be3bd5bd443af3b488ca54c898285b869832c492384346d931226e83f2d64560afc43def004fd901e2d237b60df4043dccce3111ecbae917c21191189089f14ee2f145ec15c5e1dd6facca5171dc4be63d0419a7c8104976a4c92e44895265982c3bd0a54b983825fbd67b5838f742c798807e1b887a847407b23e494c9f24a7438dc0eea2da53dfb8b08e1e032f9429befd28f894934250f78f3a73c76c70a640cd7ce57590cafe5ba7b5d77ac57bfc0e94f0a3ce15cf30bb10397e7b1d53950dd4719743f5ab93fe8ad57686ebd53bbb406bf9fc7106460bd70fbfcef235f2bc15926fb57c6bb3a3244f6c18c34cbad16ba4691677d55da53e21d89ae35afcfd057b9add7634552cf55466312d8da0d595fbcad1c2133b2b69a18cf897d7588f55458bdfb05596f526d29edcac9ba7cd0279862608e9a00e8b093953db0f3024a86a85aeeef87c8e062e919a5b6a48c90f0b614158e0607d170516cdb231adbe4e00fe5425a45cc24cc80c544950b8c7fcd6fd5d3be304d70b227d3a99d8ea5622d4cd8f9d5b2f41195012ae8549939941942ac344221dc28b7a5464d6449874f23201b85006c8055ec57c08ab3ab6d2a2df52b816f00557f0c96a4c05cf8fbee0ea139002424bd58866c9612672426393bfd6d5674b34b62ed14fc97172bcbe4f680afb6e76856629525fe86e987ecc643d23559278da7c03b859f7cd52332cb8c86b9010f2e297ad39d682602e52941663d6ce344f1708279b60015869f2468c77777709f7a31265e693da969dfc3e7df3f68fabb74727c971b2a0226701c4d6b87772e91ff5c2fefa6633d58b28d39c168def83138d34f9eaf9fcd0cc611ebe22b56551707f2063170e70ae51b85dc1f4bc498f00cbef914a233d96859ce795b234863b1df081facdc4f9bc44fa7535cd5a72c10d2fd0a161936df5eb6900aabd297c9d5435379c16238a383d772ae8922305c6c7df7d4dbbe9555c9f167662fe836bac13fbc1e0ccb97831d97ea89dd4df672755d4bb754b3d89df1f59e1cf5dd1dceb3deb51b9e0bdce2b499ef1dcee9ee9e09bc84766f546494249471f9ccdff2b335a557b76c1c988fbd0f41e12dffc6fbe2eaaf5fbda41b8f51ea943f768c57aa83fe4d1a0d5caed38612b70727cdced7402aad8324dd1da5999c386c861a9d26af562b5e25ae722f5b3269f6da0d1e3b586514a052781b00eb1ebf0585541cb57a7ffecf27a875a4de592e72283e939d8d2258e9d2d6a475faf477d5d228154043355ca9dbd749bbd8ee4b8b6c37615a7ad68ba6e539286fc2e4fb6fa5589d01ae96d4b8d1d7c2b9841726f976856b410725e773a2b5556cd5143bbef098de4f9b94a837eb81d6b43d2fb35eca2d95d45bbd04efced137368f0ccb3c6c9cba6a553c6afc9a0d1d236f6b8d0e6bb35ff6c5d95f6e8fe820c255b9b72f50ddf01f416d2769be26ac5a321ece2beee64d7cd5bef0a3aa01e3c1cfc072b668bf21f250000",
                ],
                {
                  "accept-ranges": "bytes",
                  "access-control-allow-origin": "*",
                  "cache-control": "max-age=300",
                  connection: "keep-alive",
                  "content-encoding": "gzip",
                  "content-length": "1527",
                  "content-security-policy":
                    "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                  "content-type": "text/plain; charset=utf-8",
                  "cross-origin-resource-policy": "cross-origin",
                  date: "Fri, 16 Jan 2026 13:13:47 GMT",
                  etag: 'W/"6d98f403af37d70194dba119110a55979a28a38e5060bafa653a98367db06155"',
                  expires: "Fri, 16 Jan 2026 13:18:47 GMT",
                  "source-age": "0",
                  "strict-transport-security": "max-age=31536000",
                  vary: "Authorization,Accept-Encoding",
                  via: "1.1 varnish",
                  "x-cache": "MISS",
                  "x-cache-hits": "0",
                  "x-content-type-options": "nosniff",
                  "x-fastly-request-id":
                    "d891bf94af72c1c700071903b98023ac67637bf7",
                  "x-frame-options": "deny",
                  "x-github-request-id": "EE32:3EB603:7F763:D502D:696A398A",
                  "x-served-by": "cache-lhr-egll1980024-LHR",
                  "x-timer": "S1768569227.321689,VS0,VE117",
                  "x-xss-protection": "1; mode=block",
                },
              );

            nock("http://petstore.swagger.io:80", {
              encodedQueryParams: true,
              reqheaders: {
                "x-simple": "blue",
                "Content-Type": "blue,black,brown",
              },
            })
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
                  date: "Thu, 15 Jan 2026 13:58:27 GMT",
                  server: "Jetty(9.2.9.v20150224)",
                  "transfer-encoding": "chunked",
                },
              );

            const inputFile = new Input(
              "./test/mocks/inputs/parameter-styles/input.json",
              "inputs",
            );

            const arazzo = new Arazzo(
              "./test/mocks/arazzo/openapi-parameter-tests/header/ignore-Content-Type.json",
              "arazzo",
              { logger: logger },
              docFactory,
            );
            arazzo.setMainArazzo();

            try {
              await arazzo.runWorkflows(inputFile);
            } catch (err) {
              expect(err).to.not.be.instanceOf(Error);
            }
          });
        });
      });
    });

    describe(`object`, function () {
      it(`handle when header is styled as simple and is exploded`, async function () {
        nock("https://raw.githubusercontent.com:443", {
          encodedQueryParams: true,
        })
          .get(
            "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/header/simple-object-exploded.json",
          )
          .reply(
            200,
            [
              "1f8b0800000000000013ed59cf6fdb3614bee7af786077588154ced262879c9636c9606c5883a63d0c59b032d2b3cd5622399272e216f9df0752b22d51a4a438be14884f9644be5ffc3e7e8fd2f703002224722a193901f23a394a5e93437b371585141cb9d1e404be1f0000109d2eb0a0db1b7698426af0124de32600312b89d6a0b8fd82a97116eb27520989ca30d4ad19d6143538176ae5ddefb3d66fd13d6559e06ec326e306e7a83ca36ec84ca8829a7ad0af6f8837e2c19f42382db0df9b368af179c752ebdab34bee8b3c9458ed8cbc5b97ad6da471d532180ed20fd00b01ef692173372013f3394312352f17c2884f2aef2ec6c607558aae7c17cc60115cc0bed23db254ebd83a8b4dee1495122d548c2a7164250d9def3dcb20c487401e87f928a00f433d00f63eb80f02de877c884ce1b56cace647ba5f2219eae37e576068434dd9038d30c932d4a962d230c11d58d14065081807b340d04628ec5093970539816b429794e5f43647726827f3ccb900a2459e919b66ac9bff8da889c2ff4aa65ca6d755490e9b64be690cedd67153432b0407bea38d9b5a2db2bdc84500f10358efa0dc7bac9066ef79beea2ef6434f4e3f5e322dac3eab6ed0eeb3ea3eabeeb3ea76dd3eab2efc70aa7b89e6d4d12228533e63826ce9634a1f4bc20c1964c780b8f5ca5b178151897bde0176d901c2d237b40d4482ee67e7900876ddc4857040247a6462b893787c11a3a2d8bffb0d5539288e7bc93c4290618af49164244dc6102548957eb28ca04b9730614ac6d6bb5f38f742c790803e0d4411211d41d69dc4742739ed6b04c68b6aa4be61611d3c065e08553cfd28b8cb49c1abfb2799d9633658532066aef2d24b65ffadd3da6bbde211bf3d25fc24734133cc2e588e4faf632ab29e3a8e3954bf3e8e57acb6d35fafe8ec02b5a6f3c719182c5c1c7e9de56be479cb38dd6af9d6664749766c18fd4cbad14b34d32cecaabb4a3121d89aa392fdfb1523cd6e3b9a2a967a2ad198968a99d595fdcad1c213392dcd4228f68dd6580f5545b23fb05596f526d29edcac9ba3cd026986ca0be9a00e8b303e13db0f308699aa15babaa3f3392ab844d3dc527d4a7e5c300d4c0305edba28d0a8968d69f57502f0b72821a51c668c67204a03857d4c6feddfb5336ae07a618c3c994c74752b61e2e6e7cead972014080ed74ca5c94c21729161c2d11cc28b7a5460d684a974f23201b8100a8c0dbc8af91056756ca546b7a550c9e02baee0b39698329abffa8aabcf600418d4a61ad12c39cc586e50e9e49f75f5c91295ae4bf44b72941cadef1b54857e3fbb42b564a92b74374c3766b29e910a6e68da7c03b859f7cd52132c28cb6b9018a4c56f5b73a405c19ca5c83586ac9d4a9a2e108e37c1029052e58d18efeeee12ea462542cd27b52d3df973faeefcafabf357c7c951b230454e3c88ad716fe5d23d8ac2fefa6633d5892891d42c1adf072712cde4bbe3f3433387b9ff8a54974541dd818c5c58c0d946e17605d3b3263d3c2c7f40532aeeb0ccf83caf94a531dcea800bd46d26d6e7259ab7ab69d6920baa6881160d9b6cab5fa401a8f626ff7552d5dc50b31850c4e99955419b9c11a05cfcddd7b49b5ec5f6697e27e63eb8863ab19f14ceac8b1793ed87da49fd7d7652453dae5b8a247eff2afcdab7b567ed2997a79ec13f0c1d867959dc6eb7d84821ea39bfefd3d8db9d8df537ecc1bea0f9b2a856ef6b0be0d65ba40ed9ab9f878208f1fb3c2ad452d8fdc66f048e8f8eba7d8e47145da6296a3d2b73d8d0d84797dd69919b1080a894394bddacc917ed29f436f51800619050de39c0af43e8da3f54559471d5899f5cde8ca8d5942f69ce32989e812e6de2d8d9a046fa7a33e8eb120d706160264a3eda4bb7d5eb088e6d3a74576fda7a26eb26256988eff278ab5e9504ad91deb6d4d8bfb772e92577be44b5320bc6e7759fb31265d51a3594fbdea0e2343f13a9d70db7636d087a5cc12e9abd55b007edc4df3e2ffb064f1d6bacb86c1a3aa1dc9af41a2d7563eff66dbe5ff34fd755698f8e17a42fd9da94adafff06205a48dd6d89ab150f8630c67dddc7ae5bb7e80a5aa01e3c1cfc0f760971491d250000",
            ],
            {
              "accept-ranges": "bytes",
              "access-control-allow-origin": "*",
              "cache-control": "max-age=300",
              connection: "keep-alive",
              "content-encoding": "gzip",
              "content-length": "1513",
              "content-security-policy":
                "default-src 'none'; style-src 'unsafe-inline'; sandbox",
              "content-type": "text/plain; charset=utf-8",
              "cross-origin-resource-policy": "cross-origin",
              date: "Thu, 15 Jan 2026 15:02:01 GMT",
              etag: 'W/"2078453930d7f03115c83d63aace3c9221103cbbc02c371dcc3ce6012036ba13"',
              expires: "Thu, 15 Jan 2026 15:07:01 GMT",
              "source-age": "0",
              "strict-transport-security": "max-age=31536000",
              vary: "Authorization,Accept-Encoding",
              via: "1.1 varnish",
              "x-cache": "MISS",
              "x-cache-hits": "0",
              "x-content-type-options": "nosniff",
              "x-fastly-request-id": "3dbbe356078c592229f8dd907c86f9db40cb9973",
              "x-frame-options": "deny",
              "x-github-request-id": "795F:3E766A:9D479:104183:69690168",
              "x-served-by": "cache-lhr-egll1980028-LHR",
              "x-timer": "S1768489321.972312,VS0,VE133",
              "x-xss-protection": "1; mode=block",
            },
          );

        nock("http://petstore.swagger.io:80", {
          encodedQueryParams: true,
          reqheaders: { "x-object": "R,100,G,200,B,150" },
        })
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
              date: "Thu, 15 Jan 2026 13:58:27 GMT",
              server: "Jetty(9.2.9.v20150224)",
              "transfer-encoding": "chunked",
            },
          );

        const inputFile = new Input(
          "./test/mocks/inputs/parameter-styles/input.json",
          "inputs",
        );

        const arazzo = new Arazzo(
          "./test/mocks/arazzo/openapi-parameter-tests/header/object-exploded.json",
          "arazzo",
          { logger: logger },
          docFactory,
        );
        arazzo.setMainArazzo();

        try {
          await arazzo.runWorkflows(inputFile);
        } catch (err) {
          expect(err).to.not.be.instanceOf(Error);
        }
      });

      it(`handle when header is styled as simple and is unexploded`, async function () {
        nock("https://raw.githubusercontent.com:443", {
          encodedQueryParams: true,
        })
          .get(
            "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/header/simple-object.json",
          )
          .reply(
            200,
            [
              "1f8b0800000000000013ed59cf6fdb3614bee7af786077588154ced260879c9636cd606c5883a63d0c59b032d2b3cd5622399272e216f9df0752b22d51a4a438be14884f9644be5ffc3e7e8fd2f703002224722a193905f23a394a5e93437b371585141cb9d1e414be1f0000109d2eb0a0db1b7698426af0124de32600312b89d6a0b8fd82a97116eb27520989ca30d4ad19d6143538176ae5ddefb3d66fd13d6559e06ec326e306e7a83ca36ec84ca8829a7ad0af27c41bf1e04f219c16d8ef4d1bc5f8bc63a975edd925f7451e4aac7646deaecbd636d2b86a190c07e907e88580f7b490b91b9089f99c21899a970b61c42795771763e3832a4557be0b66b0082e605fe91e59aa756c9dc526778a4a89162a469538b29286cef79e6510e243208fc37c14d087a11e007b1fdc0701ef433e44a6f05a3656f323dd2f910cf571bf2b30b4a1a6ec8146986419ea54316998e00eac68a032048c83592068231476a8c9cb829cc235a14bca727a9b2339b49379e65c00d122cfc84d33d6cdff46d444e17f25532ed3ebaa24874d32df348676ebb8a9a1158203dfd1c64dad16d95ee42280f801ac7750ee3d5648b3f73c5f7517fba127a71f2f9916569f553768f759759f55f75975bb6e9f55177e38d5bd4473e6681194299f3141b6f431a58f2561860cb26340dc7ae5ad8bc0a8c43def00bbec0061e91bda062241f7b3734804bb6ee2423820123d3231dc493cbe885151ecdffd86aa1c14c7bd641e21c83045fa48329226638812a44a3f5946d0a54b98302563ebdd2f9c7ba16348409f06a288908e20eb4e62ba939cf63502e3453552dfb0b00e1e032f842a9e7e14dce5a4e0d5fd93ccec311bac2910335779e9a5b2ffd669edb55ef188df9e127e92b9a01966172cc7a7d73115594f1dc71caa5f1fc72b56dbe9af577476815ad3f9e30c0c162e0ebfcef235f2bc659c6eb57c6bb3a3243b368c7e26dde8259a691676d55da598106ccd51c9fefd8a9166b71d4d154b3d95684c4bc5cceaca7ee568e1899c95662114fb466bac87aa22d91fd82acb7a13694f6ed6cdd166813443e58574508745189f89ed0718c34cd50a5dddd1f91c155ca2696ea93e253f2e9806a68182765d146854cbc6b4fa3a01f85b9490520e33c63310a581c23ea6b7f6efda193570bd30469e4e26baba953071f373e7d64b100a04876ba6d264a610b9c830e1680ee1453d2a306bc2543a7999005c0805c6065ec57c08ab3ab652a3db52a864f01557f0594b4c19cd5f7dc5d56730020c6a538d68961c662c37a874f2cfbafa64894ad725fa25394a8ed6f70daa42bf9f5da15ab2d415ba1ba61b3359cf480537346dbe01dcacfb66a9091694e535480cd2e2b7ad39d28260ce52e41a43d6ce244d1708c79b600148a9f2468c7777770975a312a1e693da969efc397dfbeeafab77af8e93a364618a9c78105be3decaa57b1485fdf5cd66aa135122a95934be0f4e249ac977c7e787660e73ff15a92e8b82ba0319b9b080b38dc2ed0aa6e74d7a7858fe80a654dc6199f1795e294b63b8d50117a8db4caccf4b346f56d3ac251754d1022d1a36d956bf480350ed4dfeeba4aab9a16631a088d373ab8236392340b9f8bbaf6937bd8aedd3fc4ecc7d700d75623f299c59172f26db0fb593fafbeca48a7a5cb71449fcfe55f8b56f6bcf7a542e782ff34a926734d7e3337dea09fdc3d0519997c5ed76038e94a99ef3fb3e8dbdd9d9587f3b1fec1a9aaf926a6dbfb6f06ebd63ea6c05d5cfc348645be8f3a8504b617723bf4d383e3aea76411e8d7499a6a8f5accc6143721f7b761f466e4200a252e62c75b3265fb4a7dfdbd463008441ba79a704bf0ea16bffc85511ca55277eae391951ab295fd29c65303d075ddac4b1b37d8df47532e8eb120d706160264a3eda4bb711ecc8916d4974578dda6a27eb16266948f3f278ab6d9540ad91deb6d4d8ddb762ea25f76e896a65168ccfeb2e6825caaa716ae8fabd41c5697e2e52af576ec7da90fbb8be5d343baf6087da89bf7d9af60d9e39d658e9d9b47b42b935e9355aeac6ceeedb7cbfe69faeabd21e1d2f485fb2b5295b5ffffd40b490badb30572b1e0c618cfbbacb5d3776d115b4403d7838f81f85c81b8a3b250000",
            ],
            {
              "accept-ranges": "bytes",
              "access-control-allow-origin": "*",
              "cache-control": "max-age=300",
              connection: "keep-alive",
              "content-encoding": "gzip",
              "content-length": "1526",
              "content-security-policy":
                "default-src 'none'; style-src 'unsafe-inline'; sandbox",
              "content-type": "text/plain; charset=utf-8",
              "cross-origin-resource-policy": "cross-origin",
              date: "Thu, 15 Jan 2026 15:03:01 GMT",
              etag: 'W/"e0b5f3b4620e034108c823ef666d545a90d3fd7da85c9861ba3341dd665e9e45"',
              expires: "Thu, 15 Jan 2026 15:08:01 GMT",
              "source-age": "0",
              "strict-transport-security": "max-age=31536000",
              vary: "Authorization,Accept-Encoding",
              via: "1.1 varnish",
              "x-cache": "MISS",
              "x-cache-hits": "0",
              "x-content-type-options": "nosniff",
              "x-fastly-request-id": "e5cb4e5d1853aba7924c996c3e9846cdd8e7ff77",
              "x-frame-options": "deny",
              "x-github-request-id": "096A:3BDE4F:A5704:10C93F:696901A4",
              "x-served-by": "cache-lhr-egll1980098-LHR",
              "x-timer": "S1768489381.107382,VS0,VE131",
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
              date: "Thu, 15 Jan 2026 13:58:27 GMT",
              server: "Jetty(9.2.9.v20150224)",
              "transfer-encoding": "chunked",
            },
          );

        const inputFile = new Input(
          "./test/mocks/inputs/parameter-styles/input.json",
          "inputs",
        );

        const arazzo = new Arazzo(
          "./test/mocks/arazzo/openapi-parameter-tests/header/object.json",
          "arazzo",
          { logger: logger },
          docFactory,
        );
        arazzo.setMainArazzo();

        try {
          await arazzo.runWorkflows(inputFile);
        } catch (err) {
          expect(err).to.not.be.instanceOf(Error);
        }
      });
    });

    describe(`primitive`, function () {
      it(`handle when header is styled as simple and is exploded`, async function () {
        nock("https://raw.githubusercontent.com:443", {
          encodedQueryParams: true,
        })
          .get(
            "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/header/simple-primitive-exploded.json",
          )
          .reply(
            200,
            [
              "1f8b0800000000000013ed594d6fdc3610bdfb570c981e1ac0d6ba8ed1834f75e31858b4688c3a3914aed1d0d2ec2e138964c9d1dadbc0ffbd20a5dd95284a5a3b7b09609fbc12391f8f6fe68da4af07004c69945c0b7606ec4d729cbc6187ee6aaa0aad244ab2ec0cbe1e0000309b2eb0e0db0b6e99414e7885d4b808c068a5d11954779f31256fb1bea38dd26848a06ded70a638e15c9955707dc8dab0457f576491ab0d9b4212ced10446fd92993205a77ad1cfa72c58f1186e61921738eccd921172deb1d4fa1dd8650f451e4bac76c6deae616b1b69fc6a198c0719061884800fbcd0b95f90a9f95c20eb35af178ad44793770f63e3831bc357a10b4158440f7008ba2742b58ead73d8ecde70add151854c893b22497cbef72ca3141f23793fcd7722fa38d523641fa2fb28e143cac78a297e968dd3fcc0f75b48c443de3f971896389503d4881759863635429350d29315092a432024d002c19232d8294d5916ec0c6e185f7291f3bb1cd9a1db2c33ef02985579c66e9bb16efe6f44cd0cfe5b0ae333bda920396c16f36d636917c70d864e080e42471b37b55a647b918b08e347b8de617970db20cfdecb7cd53decc7819cbebf645a5c7d51dda8dd17d57d51dd17d5edba7d515df8ee54f70ae9dc974554a6c28a8956cb50a50c5549bc4246ab6344dc06e5adcbc05e897be900cfe90071e91b6b033d410f57e7980876ddf40be188480cc8c4f824f174107b4571b8fb8da11c15c7bd64de5320e3253254243b96c92e85122d95e162d9a15cba05132fc9bef31e16cebd94634c40bf8d443d42ba43b13e4b4c9f25a74383c0eea2da836f5c58471f032f9529befd51f0394f0a01ee1f75e61eb3c1990235f3c8eb2095fd8f4e6baff589f7f81d80f0a3ce15cf30bb14397e3b8ea9ca0670dce5a1facd493f62b59d61bc7a7717682d9f3fcdc02870fdf4eb1c5f23cf3b21f956cbb7363b4af2cc8131cca41bbd469a667157dd53ea1382ad39aec53f5fb067d86d4753c5526f6516d3d2085a5dbbaf1c2d3eb1f39216ca88ff78cdf5182a5afc862d58d64da4bdb9899b2f9b05f20c4d10d2411d161372a6b61f604850350a5ddff3f91c0d5c21355b6a58921f16c282b0c0c1fa290a2c9a65635bfd3b01f84b95907209332133502541e16ef33bf7efda1927b85910e9b3c9c4569712a16e7fec5c7a0dca809270234c9acc0ca254192612e9105ed5ab22bb26c2a493d709c0a532402ef02ae64358d5b195167d4be15ac0175cc127ab31153c3ffa82ab4f400a082d552b9a90c34ce484c6267fafd1674b34b686e8a7e438395e5f2734857d3fbb46b314a907ba1ba65f3359ef4895249e36df006ece7d73d40c0b2ef29a2484bcf8656b8eb528988b14a5c598b573cdd305c2c9265800569abc11e3fdfd7dc2fdaa4499f9a4b66527bf4fdfbefbe3faddd149729c2ca8c85940b135ef9d5cfa5bbdb4bfb9dd6cf522ca34a745e3fbe044234dbefa7a7e6ce6300f5f91dab228b87f2063978e706e50b85bc1f4a2591e0197ff442a8df45c16729e57cad258ee74c007ea9b89f37985f4eb6a9ab5e4821b5ea063c326dbeaaf6700a87a53f83aa91a6e382d4614717ae154d025470a8c8fbffb9a7633abb8392d9cc4fc07d7d824f683c19973f16ab2fd503ba9bfcf4eaaa8779b967a127f38b2c23f774573af7bd69e72197cd71895c0e67b915aa86edc59b55e9874781d4db887e3431e0d5aad5c69859a77727cdc95f48013b64c53b47656e6b0616c08a46b2a28298615d73a17a9df35f96c03311ac71a46b9138cbc210eb1dfe1f343c50e8f4eff907eba035653b9e4b9c8607a01b6748963a71677f4753aeaeb0a09a42298a952eeeca53bd5747aabd357db6dadedd6ad6b3d4e1a3ab33cd936eaaadbae99deb6d468555b6508927bb744b3a28590f35ad257aaaca68086483d101ac9f30b9506835f3bd68676f537ebcbe618111db73af1b71f0d4383e7be6a5c1fddcc2ecaf83319345ada469b0a6dbe5fd79fad5169afee076428d9da94c3377cd8ed05d276a7bfeac4a321ece2be1ed9d6534aef093aa21e3c1efc0f6dd1989908240000",
            ],
            {
              "accept-ranges": "bytes",
              "access-control-allow-origin": "*",
              "cache-control": "max-age=300",
              connection: "keep-alive",
              "content-encoding": "gzip",
              "content-length": "1488",
              "content-security-policy":
                "default-src 'none'; style-src 'unsafe-inline'; sandbox",
              "content-type": "text/plain; charset=utf-8",
              "cross-origin-resource-policy": "cross-origin",
              date: "Thu, 15 Jan 2026 15:04:15 GMT",
              etag: 'W/"b5ede4c78b9f5c1165a810f1243aab74b29e4515555b94b3e71a6b48bcc5e347"',
              expires: "Thu, 15 Jan 2026 15:09:15 GMT",
              "source-age": "0",
              "strict-transport-security": "max-age=31536000",
              vary: "Authorization,Accept-Encoding",
              via: "1.1 varnish",
              "x-cache": "MISS",
              "x-cache-hits": "0",
              "x-content-type-options": "nosniff",
              "x-fastly-request-id": "b6e865e8ff59a9766428e0085d8a7c42ada4ca81",
              "x-frame-options": "deny",
              "x-github-request-id": "3C14:A5C99:A50F5:10CA54:696901EF",
              "x-served-by": "cache-lhr-egll1980036-LHR",
              "x-timer": "S1768489455.224601,VS0,VE130",
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
              date: "Thu, 15 Jan 2026 13:58:27 GMT",
              server: "Jetty(9.2.9.v20150224)",
              "transfer-encoding": "chunked",
            },
          );

        const inputFile = new Input(
          "./test/mocks/inputs/parameter-styles/input.json",
          "inputs",
        );

        const arazzo = new Arazzo(
          "./test/mocks/arazzo/openapi-parameter-tests/header/primitive-exploded.json",
          "arazzo",
          { logger: logger },
          docFactory,
        );
        arazzo.setMainArazzo();

        try {
          await arazzo.runWorkflows(inputFile);
        } catch (err) {
          expect(err).to.not.be.instanceOf(Error);
        }
      });

      it(`handle when header is styled as simple and is unexploded`, async function () {
        nock("https://raw.githubusercontent.com:443", {
          encodedQueryParams: true,
        })
          .get(
            "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/header/simple-primitive.json",
          )
          .reply(
            200,
            [
              "1f8b0800000000000013ed594d6fdc3610bdfb570c981e1ac0d1ba4ed0834f75e31858b4688c3a3914aed1d0d2ec2e138964c9d1dadbc0ffbd20a5dd9528eac38e2f01ec935722e7e3f1cdbc91f4f50080298d926bc14e80bd4e8e92d7ecd05d4d55a1954449969dc0d703000066d315167c7fc12d33c8092f901a1701186d343a83eae633a6e42dd677b4511a0d09b4ad1dce14275c2ab309ae0f591bb6e8ef8a2c72b5615348c2259ac0a85fb250a6e0542ffaf90d0b56dc875b98e4050e7bb364845c762cb57e0776d95d91c712ab9db1b75bd8da461abf5a06e34186010621e01d2f74ee17646ab914c87acdeb9522f5d1e4ddc3d8f9e0c6f04de8421016d1031c82ee81506d63eb1c36bb355c6b74542153e24424892f9f3ccb28c5c748de4ff349441fa77a84ec43741f257c48f95831c5cfb2719a1ff8d31612f190f78f2586254ee50035e24596a14d8dd02494f4644582ca100809b442b0a40c764a5396053b812bc6d75ce4fc264776e836cbccbb0066559eb1eb66acbbff1b513383ff96c2f84caf2a480e9bc57cdd58dac57187a1138283d0d1ce4dad16d993c84584f1235cefb03cb86d9067ef65bee91ef6fd404edf5f322dae3eab6ed4eeb3ea3eabeeb3ea76dd3eab2e7c77aa7b8174eacb222a5361c544ab65a85286aa245e21a3d531226e83f2d66560afc43d7780c77480b8f48db5819ea087ab734c04bb6efa857044240664627c92783888bda238dcfdc6508e8ae39364de5320e32532542413cb644aa1444b65b85826944bb760e225d977dec3c2f924e51813d06f23518f904e28d64789e9a3e4746810982eaa3df8c68575f431f05c99e2db1f051ff3a410e0fe5167ee311b9c29500b8fbc0e5279fad169ebb53ef11ebf03107ed4b9e21966e722c76fc73155d9008e531eaa5f1ff72356db19c6ab777781d6f2e5c30c8c02d74fbfcef135f2bc1192efb57c6fb3a3248f1c18c34cbad16ba4791677d53da53e21d89be35afcf3057b86dd7634552cf55666312d8da0cda5fbcad1e2133b2d69a58cf88fd75c8fa1a2c56fd88265db44da9b9bb8f9b25921cfd004211dd4613121176aff01860455a3d0e52d5f2ed1c00552b3a58625f961252c080b1cac9fa2c0a25937b6d5bf1380bf54092997b0103203551214ee36bf71ff6e9d7182ab15913e99cd6c752911eafac7cea597a00c280957c2a4c9c2204a956122910ee145bd2ab26b264c3a7b99009c2b03e402af623e844d1d5b69d1b714ae057cc10d7cb21a53c1f3575f70f3094801a1a56a45137258889cd0d8e4ef2dfa6c8dc6d610fd941c2547dbeb84a6b0ef179768d622f54077c3f46b66db1da992c4d3e61bc0ddb9ef8e9a61c1455e93849017bfeccdb116057391a2b418b376aa79ba4238de050bc04a933762bcbdbd4db85f9528b39cd5b6ececf7f9db777f5cbe7b759c1c252b2a7216506ccb7b2797fe562fedafae775bbd8832cd69d5f83e38d348b3afbe9eef9b392cc357a4b62c0aee1fc8d8b9239c1b146e36303f6b9647c0e53f914a233d97855ce695b234963b1df081fa66e27c5e20fdba99672db9e08617e8d8b0cbb6faeb1900aade14be4eaa861b4eab11459c9f391574c99102e3e3efbea6ddcd2a6e4e0b2731ffc1353689fd6070e15cbc98ed3fd4ceeaefb3b32aea69d3524fe277afacf0cf5dd1dceb9ef5a05cf04ee795242f786ea7673af826322a90cdb726b58c5db9936cbd4ee9b03e0a474f050c793468b57285172ae2f1d15157f003c6d8324dd1da4599c38ecf21ccaee5a0a418565ceb5ca47ed7ecb30da46a1c6b18655630108738c47e874f1715773c3afd23fc9b0958cde59ae72283f919d8d2258e9d4a9de8ebcda8af0b24908a60a14a39d94b77e6e9745ea7beb6db78db8d5dd76a9d3454687dbc6fe3552fde32bd6da9d1c8f6ba1124f76e8d66432b2197b5e06f5459cd080d09bb233492e7672a0dc6c276ac0d65eb6fe5e7cd21233a8c75e26f3f3886064f7dd5b82ebb9b6c94f1673268b4b48d2616da7cbfad3f5ba3d25edd0fc850b2b529876ff828dc0ba4edce86d589474398e2be1ee8b6334cef093aa21edc1ffc0f1d40ec3a26240000",
            ],
            {
              "accept-ranges": "bytes",
              "access-control-allow-origin": "*",
              "cache-control": "max-age=300",
              connection: "keep-alive",
              "content-encoding": "gzip",
              "content-length": "1499",
              "content-security-policy":
                "default-src 'none'; style-src 'unsafe-inline'; sandbox",
              "content-type": "text/plain; charset=utf-8",
              "cross-origin-resource-policy": "cross-origin",
              date: "Thu, 15 Jan 2026 15:05:05 GMT",
              etag: 'W/"816b68723d6fb9f3698691993795c3f64e356fe4686ccbbb2ffb074505c7cf56"',
              expires: "Thu, 15 Jan 2026 15:10:05 GMT",
              "source-age": "0",
              "strict-transport-security": "max-age=31536000",
              vary: "Authorization,Accept-Encoding",
              via: "1.1 varnish",
              "x-cache": "MISS",
              "x-cache-hits": "0",
              "x-content-type-options": "nosniff",
              "x-fastly-request-id": "1d09117f34ef86a7d2aea921fe319a275095d5f9",
              "x-frame-options": "deny",
              "x-github-request-id": "700D:2CABE7:A2F8E:10ABB5:6969021E",
              "x-served-by": "cache-lhr-egll1980056-LHR",
              "x-timer": "S1768489505.872197,VS0,VE133",
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
              date: "Thu, 15 Jan 2026 13:58:27 GMT",
              server: "Jetty(9.2.9.v20150224)",
              "transfer-encoding": "chunked",
            },
          );

        const inputFile = new Input(
          "./test/mocks/inputs/parameter-styles/input.json",
          "inputs",
        );

        const arazzo = new Arazzo(
          "./test/mocks/arazzo/openapi-parameter-tests/header/primitive.json",
          "arazzo",
          { logger: logger },
          docFactory,
        );
        arazzo.setMainArazzo();

        try {
          await arazzo.runWorkflows(inputFile);
        } catch (err) {
          expect(err).to.not.be.instanceOf(Error);
        }
      });
    });
  });

  describe(`path`, function () {
    describe(`label`, function () {
      describe(`array`, function () {
        it(`handle when pathParam of label is exploded`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/path/label/array-exploded.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed59516fdb36107ecfaf38b07bd88054ced2620f795ad63480b1610d96f661c8829591ce365b89e4c85352afc87f1f48c9b64452929b06030ac44f9644de1d3f7e77df51fa7c00c09446c9b56027c05e6447d90b76e8eee6aad24aa224cb4ee0f3010000b3f90a2bbebbe18619e48417489d9b008cd61a9d4175f30173f216db27da288d8604dade0c678a132e955907f7c7ac8d5bf44f4591b8dbb12924e1124d60d40f592853716a07fdf4920523eec3294cf20ac7bd5932422e234bbdebc02efb5495a985b5ced8ab0d6c7d239dab9ec1749061804108f88957baf4030ab55c0a6483e6f54a917a67ca7833b63eb8317c1dba1084557203c7a0fb42a836b1459bcdee0cd71a1d55c8d4b82792c4978fbeca24c5a7483e4cf3bd883e4df504d9c7e83e49f890f2a9644aef656737dff2c74d24e221ef1f4a0c4b9cea116aa493ac409b1ba14928e9c98a048d21101268856049198c5253d6153b812bc66fb928f94d89ecd04d96857701ccaab260d7dd58b7ff3b513383ffd4c2f8955e35901c7693f9ba3334c6718ba1138283d0d1d64dab16c5a3c84582f1135c8f581e3c36c88b37b25cc79b7d3fb2a66f6f313dae3ea96ed2ee93ea3ea9ee93eac66e9f5417be39d5bd403af5699194a9306392d9329629635992ce90c9ec9810b751798b193828714f15e02115202d7d53656020e8f1ec9c12c1d8cdb0104e88c4884c4c77125f0ee2a0288e57bf299493e2f8282b1f4890e914194b923dd3649f4449a6ca78b2ec912e71c2a4537268bfc785f351d23125a05f47a20121dd23591f24a60f92d3b146607f511dc0372dac93c7c07365aaaf3f0a3ee4a410e0fe4e17ee980dce14a885475e074b79fcd669e3b5ddf101bf2310bed3a5e20516e7a2c4afc73157c5088efb1caa5f1c0f23d6da19c76b707685d6f2e5971998046e987ed1f675d6792324df69f9ce66a4240f6c18c395c4d16ba479917615efd29010eccc712dfefe8803cd6e3f9a2696762ab398d746d0fad27de5e8f1899dd6b45246fccb5baea750d1e257ecc1b22922fdc95ddc7cdaac90176882900edab098900bb5fb0043829a56e8f28e2f9768e002a95b52c3947cbb121684050ed6775160d1dc76a6b5d719c09faa869c4b58085980aa092af798dfb8bf1b679ce06a45a44f6633dbdcca84bafe3ebaf50328034ac2953079b6308852159849a44378d68e4acc9a0993cf7ec800ce9501728137311fc2ba8dadb6e84b0ad7023ee21ade5b8db9e0e5f38fb87e0fa480d05233a20b392c4449686cf6d7067d768bc6b610fd981d65479bfb84a6b26f1697686e45ee818ec3f463669b19b992c4f3ee1bc0edbe6fb79a61c545d9928490573fefccb11e054b91a3b498b276aa79be4238de060bc06a537662bcbbbbcbb81f9529b39cb5b6ececb7f9abd7bf5fbe7e7e9c1d652baa4a16506cc37b2797fed120edafaeb753bd8832cd69d5f93e38d348b3cf3e9fefbb6b5886af486d5d55dc1fc8d8b9239c6b146ed6303feba647c0e53f906a233d97855c968db274863b1df081fa62e27c5e20fdb29e173db9e08657e8d8b05d6df31b68009ada14be4e6a9a1b4eab09459c9f3915748b2305c6c71fbfa6ddf62aae4f8bde00eab291b1c4434beba61894fc06c38344fbadf67f3d050db767dbffdd171aadc25c39907b6f3a224236bf608b06c839e6d1a0d5cae5442856c74747b116079b69eb3c476b1775095baa85a0bb6a809252a873ad4b91fb59b30f365091ddd28776cd3ffdcee0c285f26cb6fb3a3f6b3fcacf825e35c421751d36fe8d14797486bbeb977b603597b7bc1405cccfc0d66ee11825d19ebe5e4efaba4002a90816aa967b7b89db91a8283a61b4714decd75cdd0a69d61188dbe35d856dcae486e97d4b9d1ab32be9c1e25edfa259d34ac865abc56b5537f2dd51974f8446f2f24ce541c7d68fb5233ac355f6bcabffc93e298abf7fa60b0d9efaac710570db7428e3f764d4686d3b6d5f68f3cd26ff6c8b4a7ff43020638b6d4d397cc353ea2090366edb9a1d4f86b08ffbb6d7dab417833be8887a707ff01fe2db0b11c1230000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1485",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 15:44:01 GMT",
                etag: 'W/"1b08fec182e0eab291dc8f4e08951f7a619e9fc86335ae68977287a0829d2a81"',
                expires: "Thu, 15 Jan 2026 15:49:01 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "35d6c89d9258fe459ffac7674a1a01c2933f403c",
                "x-frame-options": "deny",
                "x-github-request-id": "93A6:29CFA9:BB260:130DB9:69690B37",
                "x-served-by": "cache-lhr-egll1980035-LHR",
                "x-timer": "S1768491841.050839,VS0,VE134",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/.blue.black.brown")
            .reply(
              200,
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
                date: "Thu, 15 Jan 2026 19:54:05 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/path/label/array-exploded.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`handle when pathParam of label is unexploded`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/path/label/array.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed59516fdb36107ecfaf38b07bd88054ced2620f795ad63480b1610d96f661c8829591ce365b89e4c85352afc87f1f48c9b64452929b06030ac44f9644de1d3f7e77df51fa7c00c09446c9b56027c05e6447d90b76e8eee6aad24aa224cb4ee0f3010000b3f90a2bbebbe18619e48417489d9b008cd61a9d4175f30173f216db27da288d8604dade0c678a132e955907f7c7ac8d5bf44f4591b8dbb12924e1124d60d40f592853716a07fdf4920523eec3294cf20ac7bd5932422e234bbdebc02efb5495a985b5ced8ab0d6c7d239dab9ec1749061804108f88957baf4030ab55c0a6483e6f54a917a67ca7833b63eb8317c1dba1084557203c7a0fb42a836b1459bcdee0cd71a1d55c8d4b82792c4978fbeca24c5a7483e4cf3bd883e4df504d9c7e83e49f890f2a9644aef656737dff2c74d24e221ef1f4a0c4b9cea116aa493ac409b1ba14928e9c98a048d21101268856049198c5253d6153b812bc66fb928f94d89ecd04d96857701ccaab260d7dd58b7ff3b513383ffd4c2f8955e35901c7693f9ba3334c6718ba1138283d0d1d64dab16c5a3c84582f1135c8f581e3c36c88b37b25cc79b7d3fb2a66f6f313dae3ea96ed2ee93ea3ea9ee93eac66e9f5417be39d5bd403af5699194a9306392d9329629635992ce90c9ec9810b751798b193828714f15e02115202d7d53656020e8f1ec9c12c1d8cdb0104e88c4884c4c77125f0ee2a0288e57bf299493e2f8282b1f4890e914194b923dd3649f4449a6ca78b2ec912e71c2a4537268bfc785f351d23125a05f47a20121dd23591f24a60f92d3b146607f511dc0372dac93c7c07365aaaf3f0a3ee4a410e0fe4e17ee980dce14a885475e074b79fcd669e3b5ddf101bf2310bed3a5e20516e7a2c4afc73157c5088efb1caa5f1c0f23d6da19c76b707685d6f2e5971998046e987ed1f675d6792324df69f9ce66a4240f6c18c395c4d16ba479917615efd29010eccc712dfefe8803cd6e3f9a2696762ab398d746d0fad27de5e8f1899dd6b45246fccb5baea750d1e257ecc1b22922fdc95ddc7cdaac90176882900edab098900bb5fb0043829a56e8f28e2f9768e002a95b52c3947cbb121684050ed6775160d1dc76a6b5d719c09faa869c4b58085980aa092af798dfb8bf1b679ce06a45a44f6633dbdcca84bafe3ebaf50328034ac2953079b6308852159849a44378d68e4acc9a0993cf7ec800ce9501728137311fc2ba8dadb6e84b0ad7023ee21ade5b8db9e0e5f38fb87e0fa480d05233a20b392c4449686cf6d7067d768bc6b610fd981d65479bfb84a6b26f1697686e45ee818ec3f463669b19b992c4f3ee1bc0edbe6fb79a61c545d9928490573fefccb11e054b91a3b498b276aa79be4238de060bc06a537662bcbbbbcbb81f9529b39cb5b6ececb7f9abd7bf5fbe7e7e9c1d652baa4a16506cc37b2797fed120edafaeb753bd8832cd69d5f93e38d348b3cf3e9fefbb6b5886af486d5d55dc1fc8d8b9239c6b146ed6303feba647c0e53f906a233d97855c968db274863b1df081fa62e27c5e20fdb29e173db9e08657e8d8b05d6df31b68009ada14be4e6a9a1b4eab09459c9f3915748b2305c6c71fbfa6ddf62aae4f8bde00eab291b1052f6df8d4d2baa90625bfc1f024d17eacfd5f8f41c3fdd9f67ff78d462b31570ee5deab8e8891cd2fd8a301768e793468b5724911aad5f1d1512cc6c16eda3acfd1da455dc2966b21e8ae1ca0a414ea5ceb52e47ed6ec830d6464b7f4a15df34fbf33b870a13c9bed3ecfcfdaaff2b3a0590d71485d879d7fa3451e9de1f6fae51e58cde52d2f4501f333b0b55b384659b4a7af9793be2e90402a8285aae5de5ee27e24aa8a4e196d5c14fb4557b74a9a7514e2f67857629b3ab9617adf52a7c8ec6a7ab0b8d7b768d6b41272d98af15ad58d7e77e4e513a191bc3c5379d0b2f563eda8ce70993def3600c946298abf7fa80b0d9efaac711570db7528e3f764d4686d3b7d5f68f3cd26ff6c8b4a7ff43020638b6d4d397cc363ea209036eedb9a1d4f86b08ffbb6d9daf417833be8887a707ff01fc75ffcaac2230000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1488",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 21:03:02 GMT",
                etag: 'W/"a361b13dab003dd486dcc78141060be2ab031f668505afb3452f4b9a38fe9d8e"',
                expires: "Thu, 15 Jan 2026 21:08:02 GMT",
                "source-age": "28",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "HIT",
                "x-cache-hits": "1",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "712106aa8a547ddafb6e114bda11012e366a73c2",
                "x-frame-options": "deny",
                "x-github-request-id": "8D17:11E85F:12D07E:1FCC68:69694683",
                "x-served-by": "cache-lhr-egll1980092-LHR",
                "x-timer": "S1768510982.286644,VS0,VE3",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/.blue,black,brown")
            .reply(
              200,
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
                date: "Thu, 15 Jan 2026 19:56:52 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/path/label/array.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });

      describe(`object`, function () {
        it(`handle when pathParam of label is exploded`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/path/label/object-exploded.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed5a516fdb36107ecfaf20d83d6c402a6769b1873c2d6d9ac1d8b0064dfb3064c1ca48679bad44b2e4c9a957e4bf0fa4649ba248c975d38760f1532c91c7e3c7efeebba3f3e580102a1508a6383d21f45976943da387f6692e2b25050834f4847c392084106af205546cfbc00ed3c0102e00bd8784505c29b006e5cd07c8d1596cdf282d1568e4603a33ac298630977a153c1fb2366cd1bde545e4a967930b8439e8c0a81b3293ba62d80efae5390d46dc8553a860150caf66507331ef59ea7c0fecd2cf5519db58bb187db986ad6bc4fbd631187732743070013eb34a956e4021e7730e34695e2d24ca77baec1fc6660da6355b854b70842a7a8043d07d25546bdf7a874d6f35530a2c5550d7b02392c8e6f7becb28c5c7489ea6f94e441fa77a84ec43741f257c48f95830c5cfd23bcdb7ec7e030959c8fb7d896190613d408d7890156072cd1572291c590149638870417001c4a0d4d00b4d5157f4845c51b664bc643725d0433b59146e09428d2c0b7aedfbbaf9dbf39a6af85473ed767ad54072e807f3b537b48fe306432b0407e1429b655ab528ee452e228c1fe17a8fe5c16b0dac782dca55ffb0ef06f6f4f036d3e1eaa3ea46ed3eaaeea3ea3eaa6e7fd947d5250f4e752f004f5d5844652a8c9868b40c45ca5094c42364343a46c46d50defa0c4c4adc6306d82703c4a56f2c0d249c1e8ece3111ec2f9316c21191189089f14ae2eb414c8ae270f61b43392a8ef7b2f344808c87c85090ec1826bb044a34548683658770e9074c3c2453e73d2c9cf7128e3101fd36122584748760dd4b4cf792d3a1426077514de01b17d6d136f05ceaeadb5bc17d3a8500f777aab06d36b1a6889c39e455b095fb2f9dd6abb6279e587700c277aa94ac80e29c97f0ed38e6b218c07197a6fad9711ab1d6ce305ec9d91518c3e65f676014b834fd7ac7e7edf3860bb6d5f2adcd9e92ec5930863be97baf00a7457ca9fe29a584606b8e29fecf474814bb5d6f1a5fdaa9d4405e6b8eab4bfb2b47874ff4b4c685d4fc5fd6723d868ae2bf4307967512e94ef6717361b30056800e5c3a68dda25ccce4f60718e4d8944297b76c3e074d2e00fd941a86e4db0537841bc28871551431a097deb4f67b46c85fb226391364c64541648da4b2afd98dfd73bd184372b54054279389691e655c5effd87bf413919a4841aeb8ceb3990610b2804c001e9227eda8c8ac09d7f9e4a78c9073a9095ac71b9f0fc9aaf5ad36e0520a539c7c8415796f14e49c954f3fc2ea3d4149100c36237cc8c98c9708da647fafd1a74bd0a685e8e7ec283b5a3f47d095793dbb04bde4b903baefa61b3359cfc8a54096fb37809b73df1c35858af1b2250902ab7edd9aa31d0a963c07612066ed54b17c01e478e32c21b4d6a5e7e3eded6dc6dca84ceaf9a4b565267f4c5fbefaf3f2d5d3e3ec285b6055d280626bde5bb974af92b4bfbade4c75224a15c385f7fbe044014ebeb878bef3f7300faf484d5d55cc3564f4dc12ce160a372b323df3c323e0f21bc05a0bc7652ee665a32cde70ab03ce51974cec9a17802f56d3a223174cb30a2c1b36bb6d3e8902a0c94de1755253dc305c8c28e2f4ccaaa0dd1c4aa29dfffd6bda4dad62ebb4de0da02a1b198bbc34b86a9241c96e206c24dadf6abf47cbfb66acf7147575b3cd68db4fac70feed3e8dbdd8dbd8707d1c9561ff6ea615cb2bcb97cea54d2fb69a4fc0b6449c0dada8c12869c33bd4dde3a3a37e5911f0d2d4790ec6ccea926ca226e48f4d6c20304620a654c973376bf2c10482b8dd7a8a80eeed0f1a66d6952793ed3f1a4cdaff2f980465778843ec7bd8c334aaead049370acf77c06a2a96ace405999e1153db8d432f1fecb8d6f3d1b52e0089904866b2163bafd2afac3a92e2e7e449ed0ac569d5ad3da992269da09b39863041b89b984ed103e9b8b1e22afb879b8ed3397590ce8dd70f20a57caac1e00b598437a50190a22ecb54c33d63a5e9c0964c249d342273047c6a5003ab62f80e249361ecbdd6688f1c7ff77fc9b89dd6fb3ba5de54a2f20a51db8c987e1ddaad7355dbbc645e51be3cde56b54d69ba8e9fae252f916ccbe8e0ac5e2d41af70c1c5bced7f56b26e5a26afa2ff8ca0052bcf641e74c95d5fbd423f9d36cffd9e2bda9bf6fcefdea385064f1dd96c96db347a52bb3319345a1bafd50e6dbe5ed3d6b4a87447a70119da6c6bcae21bde0c268134fd56b939f1a80bbb2cdff6b7eb962e798296a8077707ff0199ccd4fe35290000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1627",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 15:44:01 GMT",
                etag: 'W/"d29419d910524e1af5888359d13a5b512e43a1bc240072f669f8b1ea932a8fb1"',
                expires: "Thu, 15 Jan 2026 15:49:01 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "b5fbc457cced7e7a0c74c858520cea80d440f2d0",
                "x-frame-options": "deny",
                "x-github-request-id": "2055:3645F4:B80D7:12DC3F:69690B3F",
                "x-served-by": "cache-lhr-egll1980035-LHR",
                "x-timer": "S1768491842.815597,VS0,VE120",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/.R=100.G=200.B=150")
            .reply(
              200,
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
                date: "Thu, 15 Jan 2026 19:58:37 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/path/label/object-exploded.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`handle when pathParam of label is unexploded`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/path/label/object.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed5a516fdb36107ecfaf38b07b588154ced2620f795ada3443b0610d9af661c8829596ce365b89e4c89353afc87f1f48c9b6445192eb7a0f05e2275b22ef8ec7efbbef28f9cb1100531a25d7829d017b9e9c24cfd9b1bb9aaa422b89922c3b832f470000cca60b2cf8f6821b6690135e23352e02305a697406d5f423a6e42dd677b4511a0d09b4ad19ce14279c2bb30aae0f591bb6e8ef8a2c72b5615348c2399ac0a81f3253a6e0540ffaf9050b463c845398e4050e7bb364849c772cb57e0776d9e7228f2dac76c65eadd3d636d2f8d532180f320c3008013ff342e77e40a6e67381acd7bc5e2852ef4ddedd8c8d0f6e0c5f852e046111ddc0a1d47d65aad6b175369bdd1bae353aa8902971c74c129f1f7c9551888f81bc1fe63b017d1cea11b00fc17d14f021e463648aef656337dff1c312897888fb7d8161895339008d38c932b4a9119a84921eac48501902218116089694c10e356559b033b8657cc945cea739b263375966de0530abf28cdd3563dd7c6f44cd0cfe530ae3577a5ba5e4b849e6bbc6d06e1e3739744270143adab8a9d5223b885c44103f82f50eca83db0679f646e6abee663f0cace9fb5b4c0bab8faa1bb5fba8ba8faafba8ba5db78faa0bdf9dea5e239d7b5a44652a644c942d434c1962499c21a3ec1811b74179eb22b057e21e2bc03e15202e7d6365a027e861768e8960d74dbf108e88c4804c8c77125f9fc45e511cae7e63598e8ae34156de4390718a0c9164479aec4294285586c9b2035dba848953b26fbf8785f320748c09e8b781a847487720eb5e62ba979c0e3502bb8b6a4f7ee3c23a7a0cbc54a6f8f6a3e03e278520efef75e68ed9e04c819af9cceb6029876f9dd65eeb1deff13b90c2f73a573cc3ec52e4f8ed794c553690c75d0ed5cf4ffb3356db19ce57efec02ade5f3af33309ab87ef875b6afb1cea9907cabe55b9b1d25d9b3610c57d28d5e235d657157dd5dea1382ad39aec5df9fb0a7d96d4753c5524f6516d3d2085addb8b71c2d3cb1f39216ca887f798df55856b4f80d5b69591791f6e466de3c6d16c8333441484775584cc899dabe802141552b7473cfe77334708dd42ca92125df2d8405618183f55d145834cbc6b4fa7702f0a72a21e512664266a04a82c2dde653f775ed8c13dc2e88f4d96462ab4b8950773f762e3d05654049b815264d660651aa0c1389740c4fea5191591361d2c9d304e0521920177815f331acead84a8bbea4702de013aee083d5980a9e3ffb84ab0f400a082d55239a298799c8098d4dfe5a679f2dd1d83a453f2527c9c9fa3aa129ec9bd90d9aa5487da2bb61fa3193f58c5449e269f309e066df375bcdb0e022af4142c88b5fb6e6580b82b948515a8c593bd73c5d209c6e820560a5c91b31dedfdf27dc8f4a94994f6a5b76f2fbd5abd77fdcbc7e769a9c240b2a7216406c8d7b2797fe562fec6fef3653bd8832cd69d1783f38d148932f9ecf0fcd35ccc347a4b62c0aee0f64ecd201ce350ad3155c5d34e91160f92d5269a4c7b290f3bc5296c670a7033e505f4c9ccf6ba497ababac2517dcf0021d1a36abad3e3d0d40559bc2c7495573c36931a28857174e05dde24881f1f1771fd36e7a15d7a7759e00eabc92b119cf6d78d7d2aaaa06399f627892a85fd6fe1f67deb763874f5916d36d49db7e629df3af8734f6726f63c30d7254879b0f676ab5bc7580693db5e990abfa0470eb21da904783562bc7ef50784f4f4eba7d45004c5ba6295a3b2b73d8d026c48fab6c28290620ae752e523f6bf2d1068ab85d7a1f00fddd1f0cce5c284f26db7f1a4cea3f184c82be3bcc43ec777888a964d567a7ffa4f062875c5dc925cf45065717604bb770ec14841d7dbd18f5758d045211cc542977f6d26dad3a05de89bcedd6f7b67ee8ba29481a62b73cddaa4555f2d7486f5b6ad4cbad3c058b7bbd44b3a28590f3baaf58a9b26a451a4af999d0489e5fa834e83edbb13604b45f312e9bbd4cb4e7ebc4df3e9f8606cf3d6b5c31df3450caf83d19345ada460b1bda7cb3e69fadb3d21edd9f90a1c5d6a65c7ec313776f226db705ad763c1ac22eeeebbe71dd2af5eea003ead1c3d17f3a451b988d240000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1514",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 15:44:02 GMT",
                etag: 'W/"13d7d89618e9e31abbeea9082e59867fe0af926c1a4d244add400e668d220b25"',
                expires: "Thu, 15 Jan 2026 15:49:02 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "ec97a6c4d49886a5698b4826f9897cc639902008",
                "x-frame-options": "deny",
                "x-github-request-id": "EE79:3958C7:B6F54:12CAD0:69690B40",
                "x-served-by": "cache-lhr-egll1980035-LHR",
                "x-timer": "S1768491842.143859,VS0,VE134",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/.R,100,G,200,B,150")
            .reply(
              200,
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
                date: "Thu, 15 Jan 2026 20:02:02 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/path/label/object.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });

      describe(`primitive`, function () {
        it(`handle when pathParam of label is exploded`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/path/label/primitive-exploded.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed59c16edc3610bdfb2b064c0f0de0685d27e8c1a7ba710c2c5a34469d1c0ad768686976978944b2e4c8ce36f0bf17a4b4bb1249491bc79700ded34a2267868f6fe60da52f07004c69945c0b7602ec657694bd6487ee6eae2aad244ab2ec04be1c0000309bafb0e2bb1b6e98414e7881d4b909c068add11954371f31276fb17da28dd26848a0edcd70a638e1529975707fccdab845ff541489bb1d9b42122ed10446fd90853215a776d0cfaf5830e23e9cc224af70dc9b2523e432b2d4bb0eecb2cf55995a58eb8cbddec0d637d2b9ea194c0719061884809f79a54b3fa050cba54036685eaf14a9f7a68c3763eb831bc3d7a10b41582537700cbaaf846a135bb4d9ecce70add151854c8d7b22497cf9e8ab4c527c8ae4c334df8be8d3544f907d8cee93840f299f4aa6f45e7676f31d7fdc44221ef2fea1c4b0c4a91ea1463ac90ab4b9119a84929eac48d01802218156089694c12835655db113b862fc968b92df94c80edd64597817c0ac2a0b76dd8d75fbbf133533f86f2d8c5fe95503c9613799af3b43631cb7183a2138081d6dddb46a513c8a5c24183fc1f588e5c16383bc782bcb75bcd9f7236bfafe16d3e3ea93ea26ed3ea9ee93ea3ea96eecf64975e1bb53dd0ba4539f1649990a3326992d6399329625e90c99cc8e09711b95b798818312f754011e5201d2d237550606821ecfce29118cdd0c0be184488cc8c47427f1f5200e8ae278f59b4239298e8fb2f28104994e91b124d9334df6499464aa8c27cb1ee912274c3a2587f67b5c381f251d5302fa6d241a10d23d92f54162fa20391d6b04f617d5017cd3c23a790c3c57a6faf6a3e0434e0a01eeef75e18ed9e04c815a78e475b094c76f9d365edb1d1ff03b02e17b5d2a5e60712e4afc761c73558ce0b8cfa1fae5f13062ad9d71bc066757682d5f7e9d8149e086e9176d5f679d3742f29d96ef6c464af2c086315c491cbd469a176957f12e0d09c1ce1cd7e29f4f38d0ecf6a3696269a7328b796d04ad2fdd578e1e9fd8694d2b65c47fbce57a0a152d7ec31e2c9b22d29fdcc5cda7cd0a79812608e9a00d8b09b950bb0f3024a869852eeff87289062e90ba25354cc9772b614158e0607d170516cd6d675a7b9d01fca56ac8b984859005a89aa0728ff98dfbbb71c609ae5644fa6436b3cdad4ca8eb1fa35bcf41195012ae84c9b3854194aac04c221dc2b3765462d64c987cf63c03385706c805dec47c08eb36b6daa22f295c0bf8846bf86035e682972f3ee1fa039002424bcd882ee4b01025a1b1d9df1bf4d92d1adb42f45376941d6dee139acabe5d5ca2b915b9073a0ed38f996d66e44a12cfbb6f00b7fbbedd6a861517654b12425efdb233c77a142c458ed262cadaa9e6f90ae1781b2c00ab4dd989f1eeee2ee37e54a6cc72d6dab2b3dfe7afdffc71f9e6c5717694ada82a5940b10def9d5cfa4783b4bfbade4ef522ca34a755e7fbe04c23cdbef87cbeefae6119be22b57555717f2063e78e70ae51b859c3fcac9b1e0197ff44aa8df45c16725936cad219ee74c007ea8b89f37981f4eb7a5ef4e4821b5ea163c376b5cd6fa001686a53f83aa9696e38ad2614717ee654d02d8e14181f7ffc9a76dbabb83e2d7a03a8cb46c6120f2dad9b6250f21b0c0f12edb7da5413f783c1859bf66cb6fbc63b6b3fedce9a050f375adbffdd5713ad565c39b87aef2c226a25c11ea0d9984783562bc7ee50768e8f8e62550db6c5d6798ed62eea12b6a409e173798d9252f871ad4b91fb59b38f36d08369fca7f720e83a431c52d7610bdf888a4767b84f7eb507567379cb4b51c0fc0c6ced168e513aece9ebd5a4af0b24908a60a16ab9b797b8b188ca9b93381b57b77ef5d4ad24669d527f7bbcab954dc1db30bd6fa9532d76c53958dc9b5b346b5a09b96c5575adea46883b3af199d0485e9ea93ce8bdfab176e463b85e9e77953cd9f144f1f74f67a1c1539f35ae946ddb0765fc9e8c1aad6da7810b6dbedde49f6d51e98f1e06646cb1ad29876f78de1c04d2c60d58b3e3c910f671df764d9b466170071d510fee0ffe079224a9758b230000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1485",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 21:05:02 GMT",
                etag: 'W/"c71a3370c10f464d6ecffa6d43504fb71292208b69a00a981347c53ddfa263ed"',
                expires: "Thu, 15 Jan 2026 21:10:02 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "HIT",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "f7d5bd62a2cc80e194ab90eb87a443fc88faa559",
                "x-frame-options": "deny",
                "x-github-request-id": "4CA7:C2B59:135FDE:209814:69694901",
                "x-served-by": "cache-lhr-egll1980043-LHR",
                "x-timer": "S1768511103.813424,VS0,VE116",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/.blue")
            .reply(
              200,
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
                date: "Thu, 15 Jan 2026 20:07:30 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/path/label/primitive-exploded.json",
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

        it(`handle when pathParam of label is unexploded`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/path/label/primitive.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed59c16edc3610bdfb2b064c0f0de0685d27e8c1a7ba710c2c5a34469d1c0ad768686976978944b2e4c8ce36f0bf17a4b4bb1249491bc79700ded34a2267868f6fe60da52f07004c69945c0b7602ec657694bd6487ee6eae2aad244ab2ec04be1c0000309bafb0e2bb1b6e98414e7881d4b909c068add11954371f31276fb17da28dd26848a0edcd70a638e1529975707fccdab845ff541489bb1d9b42122ed10446fd90853215a776d0cfaf5830e23e9cc224af70dc9b2523e432b2d4bb0eecb2cf55995a58eb8cbddec0d637d2b9ea194c0719061884809f79a54b3fa050cba54036685eaf14a9f7a68c3763eb831bc3d7a10b41582537700cbaaf846a135bb4d9ecce70add151854c8d7b22497cf9e8ab4c527c8ae4c334df8be8d3544f907d8cee93840f299f4aa6f45e7676f31d7fdc44221ef2fea1c4b0c4a91ea1463ac90ab4b9119a84929eac48d01802218156089694c12835655db113b862fc968b92df94c80edd64597817c0ac2a0b76dd8d75fbbf133533f86f2d8c5fe95503c9613799af3b43631cb7183a2138081d6dddb46a513c8a5c24183fc1f588e5c16383bc782bcb75bcd9f7236bfafe16d3e3ea93ea26ed3ea9ee93ea3ea96eecf64975e1bb53dd0ba4539f1649990a3326992d6399329625e90c99cc8e09711b95b798818312f754011e5201d2d237550606821ecfce29118cdd0c0be184488cc8c47427f1f5200e8ae278f59b4239298e8fb2f28104994e91b124d9334df6499464aa8c27cb1ee912274c3a2587f67b5c381f251d5302fa6d241a10d23d92f54162fa20391d6b04f617d5017cd3c23a790c3c57a6faf6a3e0434e0a01eeef75e18ed9e04c815a78e475b094c76f9d365edb1d1ff03b02e17b5d2a5e60712e4afc761c73558ce0b8cfa1fae5f13062ad9d71bc066757682d5f7e9d8149e086e9176d5f679d3742f29d96ef6c464af2c086315c491cbd469a176957f12e0d09c1ce1cd7e29f4f38d0ecf6a3696269a7328b796d04ad2fdd578e1e9fd8694d2b65c47fbce57a0a152d7ec31e2c9b22d29fdcc5cda7cd0a79812608e9a00d8b09b950bb0f3024a869852eeff87289062e90ba25354cc9772b614158e0607d170516cd6d675a7b9d01fca56ac8b984859005a89aa0728ff98dfbbb71c609ae5644fa6436b3cdad4ca8eb1fa35bcf41195012ae84c9b3854194aac04c221dc2b3765462d64c987cf63c03385706c805dec47c08eb36b6daa22f295c0bf8846bf86035e682972f3ee1fa039002424bcd882ee4b01025a1b1d9df1bf4d92d1adb42f45376941d6dee139acabe5d5ca2b915b9073a0ed38f996d66e44a12cfbb6f00b7fbbedd6a861517654b12425efdb233c77a142c458ed262cadaa9e6f90ae1781b2c00ab4dd989f1eeee2ee37e54a6cc72d6dab2b3dfe7afdffc71f9e6c5717694ada82a5940b10def9d5cfa4783b4bfbade4ef522ca34a755e7fbe04c23cdbef87cbeefae6119be22b57555717f2063e78e70ae51b859c3fcac9b1e0197ff44aa8df45c16725936cad219ee74c007ea8b89f37981f4eb7a5ef4e4821b5ea163c376b5cd6fa001686a53f83aa9696e38ad2614717ee654d02d8e14181f7ffc9a76dbabb83e2d7a03a8cb46c616bcb4e1534beba61a94fc06c39344fbb136d5c5fd6070e1a63d9bed3ef2ceda6fbbb366c5c39dd6f67ff7dd442b16570eafde4b8b885b49b4077836e6d1a0d5cad13bd49de3a3a35856837db1759ea3b58bba842d6b42f85c62a3a4147e5ceb52e47ed6eca30d04611affe93d08dace1087d475d8c337aae2d1196e945fed81d55cdef25214303f035bbb8563940f7bfa7a35e9eb0209a42258a85aeeed25ee2ca2fae634cec6e5ad5f3e75ab8959a7d6df1eef8a6553f1364cef5bea948b5d750e16f7e616cd9a56422e5b595dabba51e28e507c26349297672a0f9aaf7eac1dfd182e98e75d294fb63c51fcfde35968f0d4678dab65dbfe4119bf27a3466bdbe9e0429b6f37f9675b54faa38701195b6c6bcae11b1e380781b47107d6ec7832847ddcb76dd3a65318dc4147d483fb83ff013cd9297c8c230000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1488",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 21:06:01 GMT",
                etag: 'W/"e1d09c527cb9ccdd0f0cc4cba32b8399a0c51cc52b16a325188817c82996a2a6"',
                expires: "Thu, 15 Jan 2026 21:11:01 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "HIT",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "713e7a5ab2b97bc0f18395bdab109cb17c62af8a",
                "x-frame-options": "deny",
                "x-github-request-id": "F847:64EB4:13BD46:210DD3:69694A00",
                "x-served-by": "cache-lhr-egll1980090-LHR",
                "x-timer": "S1768511162.538982,VS0,VE115",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/.blue")
            .reply(
              200,
              {
                id: 404,
              },
              {
                "access-control-allow-headers":
                  "Content-Type, api_key, Authorization",
                "access-control-allow-methods": "GET, POST, DELETE, PUT",
                "access-control-allow-origin": "*",
                connection: "keep-alive",
                "content-type": "application/json",
                date: "Thu, 15 Jan 2026 20:11:46 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/path/label/primitive.json",
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

    describe(`matrix`, function () {
      describe(`array`, function () {
        it(`handle when pathParam of matrix is exploded`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/path/matrix/array-exploded.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed59516fdb36107ecfaf38b07b588154ced2620f795ad63480b1610d9af661c8829591ce365b89e4c89313adc87f1f48c9b64451929b06030ac44f9644de1d3f7e77df51fa7200c09446c9b56027c05e2647c94b76e8eea6aad04aa224cb4ee0cb010000b3e90a0bbebbe18619e4841748ad9b008c2a8dcea0baf98429798bcd136d944643026d678633c50997ca54c1fd316be316fd539145eeb66c0a49b8441318f54316ca149c9a413fbf62c188fb700a93bcc0716f968c90cb9ea5ce756097dd15796c618d33f67a035bd748ebaa63301e6418601002def142e77e40a6964b816cd0bc5e29521f4cdedf8cad0f6e0caf421782b0886ee018745f09d526b6de66b35bc3b54647153225ee8924f1e5a3af324af129920fd37c2fa24f533d42f631ba4f123ea47c2c99e27bd9dacdf7fc71138978c8fb8712c312a772841af124cbd0a64668124a7ab222416d0884045a215852067ba929cb829dc015e36b2e727e93233b749365e65d00b32acfd8753bd6edff56d4cce03fa5307ea557352487ed64be6e0dede3b8c5d009c141e868eba6518bec51e422c2f809aef7581e3c36c8b3b732affa9b7d3fb2a6ef6f311dae3ea96ed4ee93ea3ea9ee93eaf6dd3ea92e7c77aa7b8174ead3222a5361c644b3652c53c6b2249e2193d931216ea3f2d667e0a0c43d5580875480b8f44d958181a0c7b3734a04fb6e8685704224466462ba93f87a10074571bcfa4da11c15c74759f940824ca7c85892ec9926fb244a3455c693658f74e9274c3c2587f67b5c381f251d6302fa6d241a10d23d92f54162fa20391d6b04f617d5017ce3c23a790c3c57a6f8f6a3e0434e0a01ee1f74e68ed9e04c815a78e475b094c76f9d365e9b1d1ff03b02e1079d2b9e61762e72fc761c53958de0b8cfa1fae5f130628d9d71bc066717682d5f7e9d8149e086e9d7dbbed63a6f84e43b2ddfd9ec29c9031bc67025fde835d23c8bbbeaefd29010eccc712dfefe8c03cd6e379a3a96662ab39896465075e9be7274f8c44e4b5a2923fee50dd763a868f11b7660d91491eee4366e3e6d56c833344148074d584cc885da7d802141752b7479cb974b347081d42ea9614abe5f090bc20207ebbb28b068d6ad69cd7502f0a72a21e512164266a04a82c23de637eeefc61927b85a11e993d9ccd6b712a1ae7fecdd7a0eca809270254c9a2c0ca254192612e9109e35a322b366c2a4b3e709c0b932402ef03ae643a89ad84a8bbea4702de03356f0d16a4c05cf5f7cc6ea239002424bf58836e4b01039a1b1c95f1bf4d91a8d6d20fa29394a8e36f7094d61df2e2ed1ac45ea81ee87e9c7cc3633522589a7ed3780db7ddf6e35c3828bbc2109212f7ed999631d0ae62245693166ed54f3748570bc0d168095266fc5787b7b9b703f2a5166396b6cd9d9eff3d76ffeb87cf3e238394a5654e42ca0d886f74e2efda341da5f5d6fa77a11659ad3aaf57d70a691665f7c3edfb7d7b00c5f91dab228b83f90b1734738d728dc54303f6ba747c0e57748a5919ecb422ef35a595ac39d0ef8407d31713e2f907eade659472eb8e1053a366c575bff061a80ba3685af93eae686d36a4211e7674e05dde24881f1f1f75fd36e7b15d7a7f5de00eabc96b1c8434b555d0c0a4e46dc8596eb8fb5ffeb3168b83fdbfe6fbfd16824e6caa1dc79d5d16364fd0bf668809d631e0d5aad5c52846a757c74d417e360376d99a668eda2cc61cbb51074570e50520c75ae752e523f6bf6c90632b25bfad0aef9a73f185cb8509ecd769fe767cd57f959d0ac8638c4aec3cebfd6228fce707bfd6a0face672cd7391c1fc0c6ce9168ebd2cdad3d7ab495f17482015c14295726f2ffd7ea457159d32da7e51ec165ddd2869d25288f5f1aec4d67572c3f4aea55691d9d5f460716fd6682a5a09b96cc4b85265addf2d79b9233492e7672a0d5ab66eac2dd5192eb3e7ed0620da28f5e2ef1eea4283a73e6b5c05dc761dcaf83d19355ada56df17da7cbbc93fdba0d21d3d0cc8d8621b530edff0983a08a4edf76df58e4743d8c77dd36c6dfa8bc11d74443db83ff80f624ce80ec2230000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1486",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 15:48:28 GMT",
                etag: 'W/"4de1d5cad41acd5719895f1e3c5ba79af8a8fe0756d37e35e848e312182d8808"',
                expires: "Thu, 15 Jan 2026 15:53:28 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "02726735748ad433a29ac5695a21fccdf57c86de",
                "x-frame-options": "deny",
                "x-github-request-id": "3B06:3958C7:B9F25:1313D1:69690C4C",
                "x-served-by": "cache-lhr-egll1980070-LHR",
                "x-timer": "S1768492109.524453,VS0,VE131",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/;petId=blue;petId=black;petId=brown")
            .reply(
              200,
              { id: 1 },
              {
                "access-control-allow-headers":
                  "Content-Type, api_key, Authorization",
                "access-control-allow-methods": "GET, POST, DELETE, PUT",
                "access-control-allow-origin": "*",
                connection: "keep-alive",
                "content-length": "102",
                "content-type": "application/json",
                date: "Thu, 15 Jan 2026 20:22:52 GMT",
                server: "Jetty(9.2.9.v20150224)",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/path/matrix/array-exploded.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`handle when pathParam of matrix is unexploded`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/path/matrix/array.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed59516fdb36107ecfaf38b07b588154ced2620f795ad63480b1610d9af661c8829591ce365b89e4c89313adc87f1f48c9b64451929b06030ac44f9644de1d3f7e77df51fa7200c09446c9b56027c05e2647c94b76e8eea6aad04aa224cb4ee0cb010000b3e90a0bbebbe18619e4841748ad9b008c2a8dcea0baf98429798bcd136d944643026d678633c50997ca54c1fd316be316fd539145eeb66c0a49b8441318f54316ca149c9a413fbf62c188fb700a93bcc0716f968c90cb9ea5ce756097dd15796c618d33f67a035bd748ebaa63301e6418601002def142e77e40a6964b816cd0bc5e29521f4cdedf8cad0f6e0caf421782b0886ee018745f09d526b6de66b35bc3b54647153225ee8924f1e5a3af324af129920fd37c2fa24f533d42f631ba4f123ea47c2c99e27bd9dacdf7fc71138978c8fb8712c312a772841af124cbd0a64668124a7ab222416d0884045a215852067ba929cb829dc015e36b2e727e93233b749365e65d00b32acfd8753bd6edff56d4cce03fa5307ea557352487ed64be6e0dede3b8c5d009c141e868eba6518bec51e422c2f809aef7581e3c36c8b3b732affa9b7d3fb2a6ef6f311dae3ea96ed4ee93ea3ea9ee93eaf6dd3ea92e7c77aa7b8174ead3222a5361c644b3652c53c6b2249e2193d931216ea3f2d667e0a0c43d5580875480b8f44d958181a0c7b3734a04fb6e8685704224466462ba93f87a10074571bcfa4da11c15c74759f940824ca7c85892ec9926fb244a3455c693658f74e9274c3c2587f67b5c381f251d6302fa6d241a10d23d92f54162fa20391d6b04f617d5017ce3c23a790c3c57a6f8f6a3e0434e0a01ee1f74e68ed9e04c815a78e475b094c76f9d365e9b1d1ff03b02e1079d2b9e61762e72fc761c53958de0b8cfa1fae5f130628d9d71bc066717682d5f7e9d8149e086e9d7dbbed63a6f84e43b2ddfd9ec29c9031bc67025fde835d23c8bbbeaefd29010eccc712dfefe8c03cd6e379a3a96662ab39896465075e9be7274f8c44e4b5a2923fee50dd763a868f11b7660d91491eee4366e3e6d56c833344148074d584cc885da7d802141752b7479cb974b347081d42ea9614abe5f090bc20207ebbb28b068d6ad69cd7502f0a72a21e512164266a04a82c23de637eeefc61927b85a11e993d9ccd6b712a1ae7fecdd7a0eca809270254c9a2c0ca254192612e9109e35a322b366c2a4b3e709c0b932402ef03ae643a89ad84a8bbea4702de03356f0d16a4c05cf5f7cc6ea239002424bf58836e4b01039a1b1c95f1bf4d91a8d6d20fa29394a8e36f7094d61df2e2ed1ac45ea81ee87e9c7cc3633522589a7ed3780db7ddf6e35c3828bbc2109212f7ed999631d0ae62245693166ed54f3748570bc0d168095266fc5787b7b9b703f2a5166396b6cd9d9eff3d76ffeb87cf3e238394a5654e42ca0d886f74e2efda341da5f5d6fa77a11659ad3aaf57d70a691665f7c3edfb7d7b00c5f91dab228b83f90b1734738d728dc54303f6ba747c0e57748a5919ecb422ef35a595ac39d0ef8407d31713e2f907eade659472eb8e1053a366c575bff061a80ba3685af93eae686d36a4211e7674e05dde24881f1f1f75fd36e7b15d7a7f5de00eabc96b105cf6df8d45255578382931177a1e9fa6bedff7a0e1a6ed0b6ffdbaf341a8db9723077de75f42859ff824d1aa0e7984783562b9715a15c1d1f1df5d538d84e5ba6295abb2873d8922d04ddd5039414439d6b9d8bd4cf9a7db2818eec963eb46bfee90f06172e9467b3ddf7f959f3597e1674ab210eb1ebb0f5afc5c8a333dc5fbfda03abb95cf35c64303f035bba85632f8df6f4f56ad2d705124845b050a5dcdb4bbf21e99545278db65f15bb555737529ab424627dbcabb175a1dc30bd6ba9556576453d58dc9b359a8a56422e1b35ae54590b784b5fee088de4f9994a839ead1b6b4b7686ebec79bb0388764abdf8bba7bad0e0a9cf1a5702b76d87327e4f468d96b6d5f88536df6ef2cf36a874470f0332b6d8c694c3373ca70e0269fb8d5bbde3d110f671df745b9b066370071d510fee0ffe03a16f5745c3230000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1489",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 15:48:28 GMT",
                etag: 'W/"62c22d3b99b05646339b63126d93dc8d0044ff400b5a2e0f7a2f1779c1df0516"',
                expires: "Thu, 15 Jan 2026 15:53:28 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "1130d4cc9767705a2072c6278c872cf705fe9211",
                "x-frame-options": "deny",
                "x-github-request-id": "4900:29CFA9:BDC0F:1350B9:69690C4C",
                "x-served-by": "cache-lhr-egll1980070-LHR",
                "x-timer": "S1768492109.863314,VS0,VE122",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/;petId=blue,black,brown")
            .reply(
              200,
              { id: 1 },
              {
                "access-control-allow-headers":
                  "Content-Type, api_key, Authorization",
                "access-control-allow-methods": "GET, POST, DELETE, PUT",
                "access-control-allow-origin": "*",
                connection: "keep-alive",
                "content-length": "102",
                "content-type": "application/json",
                date: "Thu, 15 Jan 2026 20:24:08 GMT",
                server: "Jetty(9.2.9.v20150224)",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/path/matrix/array.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });

      describe(`object`, function () {
        it(`handle when pathParam of matrix is exploded`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/path/matrix/object-exploded.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed5a516fdb36107ecfaf38b07b588154ced2600f795ada3443b0610d9af661c8829591ce365b89e4c89313afc87f1f48c9b6445192eb7a0f05e2275b22ef8ec7efbbef28f9cb0100531a25d7829d027b991c252fd9a1bb9aaa422b89922c3b852f070000cca6732cf8e6821b6690135e21352e02305a6a7406d5dd274cc95bacef68a3341a12685b339c294e385366195c1fb2366cd1df1559e46ac3a69084333481513f64aa4cc1a91ef4f3090b463c865398e4050e7bb364849c752cb57e0776d94391c716563b63af57696b1b69fc6a198c0719061884800fbcd0b91f90a9d94c20eb35afe78ad40793773763ed831bc397a10b415844377028755f99aa556c9dcd66f7866b8d0e2a644adc3293c4677b5f6514e26320ef87f956401f877a04ec43701f057c08f91899e27bd9d8cdf77cbf44221ee27e576058e2540e40234eb20c6d6a8426a1a4072b1254864048a039822565b0434d5916ec146e185f7091f3bb1cd9a19b2c33ef02985579c66e9bb1aebf37a26606ff2985f12bbda95272d824f36d6368378feb1c3a2138081dadddd46a91ed452e22881fc17a07e5c16d833c7b2bf36577b31f07d6f4fd2da685d527d58dda7d52dd27d57d52ddaedb27d585ef4e75af90ce3c2da232153226ca9621a60cb124ce9051768c88dba0bc7511d82b714f1560970a1097beb132d013f4303bc744b0eba65f084744624026c63b89af4f62af280e57bfb12c47c5712f2bef21c838458648b2254db6214a942ac364d9822e5dc2c429d9b7dfc3c2b9173ac604f4db40d423a45b90752731dd494e871a81ed45b527bf71611d3d065e28537cfb517097934290f70f3a73c76c70a6404d7de675b094fdb74e2baff58ef7f81d48e1079d2b9e61762172fcf63ca62a1bc8e33687ea97c7fd19abed0ce7ab777681d6f2d9d719184d5c3ffc3adbd758e79d907ca3e51b9b1d25d9b1610c57d28d5e235d667157dd5dea13828d39aec5df9fb1a7d96d4753c5524f6516d3d2085a5ebbb71c2d3cb1b392e6ca887f798df55856b4f80d5b69591591f6e466de3c6de6c8333441480775584cc8a9dabc802141552b747dcf6733347085d42ca92125dfcf8505618183f55d1458348bc6b4fa7702f0a72a21e512a64266a04a82c2dde677eeebca1927b89913e9d3c9c4569712a16e7fec5c7a0eca809270234c9a4c0da254192612e9109ed5a322b326c2a493e709c08532402ef02ae64358d6b195167d49e15ac0675cc247ab31153c7ff119971f8114105aaa4634530e5391131a9bfcb5ca3e5ba0b1758a7e4a8e92a3d5754253d8b7d36b340b91fa4477c3f46326ab19a992c4d3e613c0f5beafb79a61c1455e83849017bf6cccb116047391a2b418b376a6793a47385e070bc04a933762bcbfbf4fb81f9528339bd4b6ece4f7cbd76ffeb87ef3e238394ae654e42c80d80af74e2efdad5ed8dfdcaea77a11659ad3bcf17e70a291265f3c9f1f9b6b98858f486d5914dc1fc8d885039c6b14ee967079dea44780e57748a5911ecb42cef24a591ac39d0ef8407d31713eaf905e2d2fb3965c70c30b746858afb6faf43400556d0a1f2755cd0da7f988225e9e3b15748b2305c6c7df7d4cbbee555c9fd67902a8f34ac622372d2dab62507032e221b45cbdacfd3fcebcefc60e9fb22cee36256df38975cebfeed3d8ab9d8d0d37c8511d6e3e9ca9d5f2c601a6f5d4a643aeea13c0ad8768431e0d5aad1cbf43e13d3e3aeaf61501306d99a668edb4cc614d9b103faeb2a1a41880b8d6b948fdacc9271b28e266e97d00f4777f303875a13c9b6cfe6930a9ff603009faee300fb1dfe121a692559f9dfe93c2c916b9ba940b9e8b0c2ecfc1966ee1d829085bfa3a19f575850452114c5529b7f6d26dad3a05de89bcedd6f7b67ee8ba29481a62b738dea84555f257486f5b6ad4cb8d3c058b7bb340b3a4b990b3baaf58aab26a451a4af9406824cfcf551a749fed581b02daaf1817cd5e26daf375e26f9f4f4383679e35ae98af1b2865fc9e0c1a2d6da3850d6dbe5df1cfd659698fee4fc8d0626b532ebfe189bb3791b6db82563b1e0d611bf775dfb86a957a77d001f5e0f1e03fc9c772f38d240000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1512",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 15:48:29 GMT",
                etag: 'W/"2a1c3174442d164c097e36a68f57b238ac94a617ca8af1a6f0b6339d4020c3dc"',
                expires: "Thu, 15 Jan 2026 15:53:29 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "54967fc1d473f499178a778364755bc23fb51300",
                "x-frame-options": "deny",
                "x-github-request-id": "B345:37AC41:C53F3:13C916:69690C4C",
                "x-served-by": "cache-lhr-egll1980070-LHR",
                "x-timer": "S1768492109.185937,VS0,VE118",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/;R=100;G=200;B=150")
            .reply(
              200,
              { id: 1 },
              {
                "access-control-allow-headers":
                  "Content-Type, api_key, Authorization",
                "access-control-allow-methods": "GET, POST, DELETE, PUT",
                "access-control-allow-origin": "*",
                connection: "keep-alive",
                "content-length": "102",
                "content-type": "application/json",
                date: "Thu, 15 Jan 2026 20:25:34 GMT",
                server: "Jetty(9.2.9.v20150224)",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/path/matrix/object-exploded.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`handle when pathParam of matrix is unexploded`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/path/matrix/object.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed5a516fdb36107ecfaf38b07b588154ced2600f795ada3443b0610d9af661c8829591ce365b89e4c89313afc87f1f48c9b6445192eb7a0f05e2275b22ef8ec7efbbef28f9cb0100531a25d7829d027b991c252fd9a1bb9aaa422b89922c3b852f070000cca6732cf8e6821b6690135e21352e02305a6a7406d5dd274cc95bacef68a3341a12685b339c294e385366195c1fb2366cd1df1559e46ac3a69084333481513f64aa4cc1a91ef4f3090b463c865398e4050e7bb364849c752cb57e0776d94391c716563b63af57696b1b69fc6a198c0719061884800fbcd0b91f90a9d94c20eb35afe78ad40793773763ed831bc397a10b415844377028755f99aa556c9dcd66f7866b8d0e2a644adc3293c4677b5f6514e26320ef87f956401f877a04ec43701f057c08f91899e27bd9d8cdf77cbf44221ee27e576058e2540e40234eb20c6d6a8426a1a4072b1254864048a039822565b0434d5916ec146e185f7091f3bb1cd9a19b2c33ef02985579c66e9bb1aebf37a26606ff2985f12bbda95272d824f36d6368378feb1c3a2138081dadddd46a91ed452e22881fc17a07e5c16d833c7b2bf36577b31f07d6f4fd2da685d527d58dda7d52dd27d57d52ddaedb27d585ef4e75af90ce3c2da232153226ca9621a60cb124ce9051768c88dba0bc7511d82b714f1560970a1097beb132d013f4303bc744b0eba65f084744624026c63b89af4f62af280e57bfb12c47c5712f2bef21c838458648b2254db6214a942ac364d9822e5dc2c429d9b7dfc3c2b9173ac604f4db40d423a45b90752731dd494e871a81ed45b527bf71611d3d065e28537cfb517097934290f70f3a73c76c70a6404d7de675b094fdb74e2baff58ef7f81d48e1079d2b9e61762172fcf63ca62a1bc8e33687ea97c7fd19abed0ce7ab777681d6f2d9d719184d5c3ffc3adbd758e79d907ca3e51b9b1d25d9b1610c57d28d5e235d667157dd5dea13828d39aec5df9fb1a7d96d4753c5524f6516d3d2085a5ebbb71c2d3cb1b392e6ca887f798df55856b4f80d5b69591591f6e466de3c6de6c8333441480775584cc8a9dabc802141552b747dcf6733347085d42ca92125dfcf8505618183f55d1458348bc6b4fa7702f0a72a21e512a64266a04a82c2dde677eeebca1927b89913e9d3c9c4569712a16e7fec5c7a0eca809270234c9a4c0da254192612e9109ed5a322b326c2a493e709c08532402ef02ae64358d6b195167d49e15ac0675cc247ab31153c7ff119971f8114105aaa4634530e5391131a9bfcb5ca3e5ba0b1758a7e4a8e92a3d5754253d8b7d36b340b91fa4477c3f46326ab19a992c4d3e613c0f5beafb79a61c1455e83849017bf6cccb116047391a2b418b376a6793a47385e070bc04a933762bcbfbf4fb81f9528339bd4b6ece4f7cbd76ffeb87ef3e238394ae654e42c80d80af74e2efdad5ed8dfdcaea77a11659ad3bcf17e70a291265f3c9f1f9b6b98858f486d5914dc1fc8d885039c6b14ee967079dea44780e57748a5911ecb42cef24a591ac39d0ef8407d31713eaf905e2d2fb3965c70c30b746858afb6faf43400556d0a1f2755cd0da7f988225e9e3b15748b2305c6c7df7d4cbbee555c9fd67902a8f34ac6a63cb7e15d4bcbaa1a149c8c78084d576f6bff8f43efbbb1d3a72c8bbb4d4ddb7c62adf3affb34f66a6763c31d7254889b4f676ab9bc7188693db6e9b0abfa0478eb61da904783562b47f050798f8f8eba8d45804c5ba6295a3b2d7358f326c48f2b6d28290620ae752e523f6bf2c90692b8597a1f00fddd1f0c4e5d28cf269bbf1a4cea7f184c82c63bcc43ec77788aa974d567a7ffa870b245ae2ee582e72283cb73b0a55b38762ac296be4e467d5d218154045355caadbd747bab4e85772a6fbb05be2d20baee0a9286da2d8e377251d5fc15d2db961a0573a34fc1e2de2cd02c692ee4ac6e2c96aaac7a9186543e101ac9f3739506ed673bd68682f64bc645b39989367d9df8db07d4d0e099678dabe6eb0e4a19bf2783464bdbe861439b6f57fcb37556daa3fb1332b4d8da94cb6f78e4ee4da4edf6a0d58e4743d8c67ddd38ae7aa5de1d74403d783cf80f60cae0f88e240000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1514",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 15:48:29 GMT",
                etag: 'W/"eb3bf719d2773d3ed8daed1de11409a3f9af9631a4c3b36048aa9964b7a95db1"',
                expires: "Thu, 15 Jan 2026 15:53:29 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "d330a8ba04415230208b3ec651573b27ed44bb28",
                "x-frame-options": "deny",
                "x-github-request-id": "BE49:3DF5BC:C0856:137B22:69690C4C",
                "x-served-by": "cache-lhr-egll1980070-LHR",
                "x-timer": "S1768492110.508388,VS0,VE129",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/;petId=R,100,G,200,B,150")
            .reply(
              200,
              { id: 1 },
              {
                "access-control-allow-headers":
                  "Content-Type, api_key, Authorization",
                "access-control-allow-methods": "GET, POST, DELETE, PUT",
                "access-control-allow-origin": "*",
                connection: "keep-alive",
                "content-length": "102",
                "content-type": "application/json",
                date: "Thu, 15 Jan 2026 20:26:31 GMT",
                server: "Jetty(9.2.9.v20150224)",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/path/matrix/object.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });

      describe(`primitive`, function () {
        it(`handle when pathParam of matrix is exploded`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/path/matrix/primitive-exploded.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed59c16edc3610bdfb2b064c0f0de0685dc7e8c1a7ba710c2c5a34469d1c0ad768686956cb44225972b4f636f0bf17a4b4bb1245491bc79700f6c92b9133c3376fe68da42f07004c69945c0b760aec757294bc6687ee6aaa4aad244ab2ec14be1c0000309b2eb1e4bb0b6e99414e7889d4ba08c068add11954b79f30256fb1b9a38dd26848a0edec70a63861aecc3ab83e666ddca2bf2bb2c8d5964d210973348151bf64a14cc9a959f4f3090b563c845b98e4258e7bb36484cc7b963abf03bbecbe2c62076b9cb1371bd8ba465abf3a06e34186010621e03d2f75e117642acf05b241f37aa9487d30453f195b1fdc18be0e5d08c2329ac031e8be12aa4d6cbd64b33bc3b54647153215ee8924f1fcc94f19a5f814c98769be17d1a7a91e21fb18dd27091f523e564cf15cb6b2f99e3f6d21110f79ff586258e2548d50235e6419dad4084d42494f5624a80d8190404b044bca60af346555b253b8667cc545c16f0b64876eb3ccbc0b60561519bb69c7bafdbf153533f86f258c3fe9750dc961bb986f5a4bfb386e31744270103adaba69d4227b12b988307e82eb3d9607b70df2ec9d2cd6fd643f8c9ce9fb3b4c87abcfaa1bb5fbacbacfaafbacba7db7cfaa0bdf9dea5e229df9b288ca545831d16a19ab94b12a8957c864754c88dba8bcf519382871cf1de0311d202e7d536d6020e8f1ea9c12c1be9b61219c10891199989e24be1ec441511cef7e532847c5f1494e3e5020d3253256247b96c93e85122d95f162d9a35cfa05132fc9a17c8f0be79394634c40bf8d440342ba47b13e4a4c1f25a76383c0fea23a806f5c58271f032f9429bffd51f0314f0a01ee1f74e61eb3c19902b5f0c8ebe0284f3f3a6dbc36191ff03b02e1075d289e6176210afc761c53958de0b8cf43f5ebe361c41a3be3780dee2ed15a9e7f9d8149e086e9d74b5feb9cb742f29d96ef6cf694e491036378927ef41a699ec55df5b33424043b735c8b7f3ee3c0b0db8da68ea5d9ca2ca69511b4be725f393a7c6267152d9511fff186eb3154b4f80d3bb06c9a4877731b375f364be4199a20a483262c26e442ed3ec090a07a14babae3798e062e91da2d352cc9f74b614158e060fd140516cdaab5adf99d00fca52a48b984859019a88aa074b7f9adfb77e38c135c2f89f4e96c66eb4b8950373ff62ebd04654049b816264d160651aa0c138974082f9a55915d3361d2d9cb04e042192017781df321ac9bd82a8bbea5702de033aee1a3d5980a5ebcfa8ceb8f400a082dd52bda90c3421484c6267f6fd0672b34b681e8a7e42839da5c2734a57db7b842b312a907ba1fa65f33dbec4895249eb6df006ef3be4d35c3928ba22109212f7fd999631d0a162245693166ed4cf3748970bc0d168055a668c57877779770bf2a51269f35b6ececf7f99bb77f5cbd7d759c1c254b2a0b16506cc37b2797fed620edaf6fb65bbd8832cd69d9fa3e38d348b32fbe9e1fda67c8c357a4b62a4bee1fc8d885239c1b146ed7303f6f9747c0e53f912a233d9785cc8b5a595acb9d0ef8407d33713e2f917e5dcfb38e5c70c34b746cd89eb6fe1b1800eade14be4eaa871b4ecb09459c9f3b1574872305c6c7df7f4dbb9d55dc9cd67b03a88b5ac622372dadeb66507232e23eb45c7fac8d4d713f185cb87d2f66bb8fbcb3e6dbeeac3ef1f0a4b5fdbffd6ea2118b6b8757e7a5458f5b51b4077836e6d1a0d5cad13bd49de3a3a3beac0679b1559aa2b58baa802d6b42f85c61a3a4187e5ceb42a47ed7ec930d04611affe91c0463678843ec7738c3d7aae2d1191e944ff6c06a2e57bc1019cccfc156eee0d8ab873d7d9d4cfaba4402a90816aa927b7be94f16bdfee634cef6db5bb77dea46139356af5f1def9a65ddf1364cef5a6ab58b5d770e0ef77685664d4b21f34656d7aaaa95b82514f78446f2e25ca5c1f0d58db5a51fc30df3a22de5d191a7177ff7f12c3478e6abc6f5b2edfca08ccfc9a8d1cab626b8d0e6bb4dfdd90695eeea6140c60edb9872f8860f9c8340dafe0456673c1ac23eee9bb16933290c66d011f5e0e1e07f71d278e98c230000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1485",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 21:19:32 GMT",
                etag: 'W/"17a22c6fbc2b6389200cf172cd03f12b0dca938a0e0fcc7b634813984d753751"',
                expires: "Thu, 15 Jan 2026 21:24:32 GMT",
                "source-age": "21",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "HIT",
                "x-cache-hits": "1",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "6a6d817683a1d47dd1254a8a88a45724e020376a",
                "x-frame-options": "deny",
                "x-github-request-id": "A852:9E366:152F59:240090:696959CE",
                "x-served-by": "cache-lhr-egll1980066-LHR",
                "x-timer": "S1768511972.476441,VS0,VE2",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/;petId=blue")
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
                date: "Thu, 15 Jan 2026 13:58:27 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/path/matrix/primitive-exploded.json",
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

        it(`handle when pathParam of matrix is unexploded`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/path/matrix/primitive.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed59c16edc3610bdfb2b064c0f0de0685dc7e8c1a7ba710c2c5a34469d1c0ad768686956cb44225972b4f636f0bf17a4b4bb1245491bc79700f6c92b9133c3376fe68da42f07004c69945c0b760aec757294bc6687ee6aaa4aad244ab2ec14be1c0000309b2eb1e4bb0b6e99414e7889d4ba08c068add11954b79f30256fb1b9a38dd26848a0edec70a63861aecc3ab83e666ddca2bf2bb2c8d5964d210973348151bf64a14cc9a959f4f3090b563c845b98e4258e7bb36484cc7b963abf03bbecbe2c62076b9cb1371bd8ba465abf3a06e34186010621e03d2f75e117642acf05b241f37aa9487d30453f195b1fdc18be0e5d08c2329ac031e8be12aa4d6cbd64b33bc3b54647153215ee8924f1fcc94f19a5f814c98769be17d1a7a91e21fb18dd27091f523e564cf15cb6b2f99e3f6d21110f79ff586258e2548d50235e6419dad4084d42494f5624a80d8190404b044bca60af346555b253b8667cc545c16f0b64876eb3ccbc0b60561519bb69c7bafdbf153533f86f258c3fe9750dc961bb986f5a4bfb386e31744270103adaba69d4227b12b988307e82eb3d9607b70df2ec9d2cd6fd643f8c9ce9fb3b4c87abcfaa1bb5fbacbacfaafbacba7db7cfaa0bdf9dea5e229df9b288ca545831d16a19ab94b12a8957c864754c88dba8bcf519382871cf1de0311d202e7d536d6020e8f1ea9c12c1be9b61219c10891199989e24be1ec441511cef7e532847c5f1494e3e5020d3253256247b96c93e85122d95f162d9a35cfa05132fc9a17c8f0be79394634c40bf8d440342ba47b13e4a4c1f25a76383c0fea23a806f5c58271f032f9429bffd51f0314f0a01ee1f74e61eb3c19902b5f0c8ebe0284f3f3a6dbc36191ff03b02e1075d289e6176210afc761c53958de0b8cf43f5ebe361c41a3be3780dee2ed15a9e7f9d8149e086e9d74b5feb9cb742f29d96ef6cf694e491036378927ef41a699ec55df5b33424043b735c8b7f3ee3c0b0db8da68ea5d9ca2ca69511b4be725f393a7c6267152d9511fff186eb3154b4f80d3bb06c9a4877731b375f364be4199a20a483262c26e442ed3ec090a07a14babae3798e062e91da2d352cc9f74b614158e060fd140516cdaab5adf99d00fca52a48b984859019a88aa074b7f9adfb77e38c135c2f89f4e96c66eb4b8950373ff62ebd04654049b816264d160651aa0c138974082f9a55915d3361d2d9cb04e042192017781df321ac9bd82a8bbea5702de033aee1a3d5980a5ebcfa8ceb8f400a082dd52bda90c3421484c6267f6fd0672b34b681e8a7e42839da5c2734a57db7b842b312a907ba1fa65f33dbec4895249eb6df006ef3be4d35c3928ba22109212f7fd999631d0a162245693166ed4cf3748970bc0d168055a668c57877779770bf2a51269f35b6ececf7f99bb77f5cbd7d759c1c254b2a0b16506cc37b2797fed620edaf6fb65bbd8832cd69d9fa3e38d348b32fbe9e1fda67c8c357a4b62a4bee1fc8d885239c1b146ed7303f6f9747c0e53f912a233d9785cc8b5a595acb9d0ef8407d33713e2f917e5dcfb38e5c70c34b746cd89eb6fe1b1800eade14be4eaa871b4ecb09459c9f3b1574872305c6c7df7f4dbb9d55dc9cd67b03a88b5ac616bcb0e15d4bebba1b949c8cb80f4dd75f6b6363dc0f06176edf8bd9ee2befacf9b83bab8f3c3c6a6dff6fbf9c68d4e2da01d6796bd1235714ee01a28d793468b572fc0e85e7f8e8a8afab41626c95a668eda22a604b9b103e57d92829861fd7ba10a9df35fb64034598c67f3a07c1dc19e210fb1d0ef1b5ac78748627e5933db09acb152f4406f373b0953b38f60a624f5f2793be2e91402a8285aae4de5efaa345afc13991b3fdfed6ed9fba11c5a4d5ec57c7bb6e59b7bc0dd3bb965afd62d79e83c3bd5da159d352c8bcd1d5b5aa6a296e29c53da191bc385769307d75636d09c870c7bc686b7974e6e9c5df7d3e0b0d9ef9aa71cd6c3b4028e373326ab4b2ad112eb4f96e537fb641a5bb7a1890b1c336a61cbee113e72090b63f82d5198f86b08ffb666eda8c0a831974443d7838f81f63dc1fd88d230000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1488",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 21:20:43 GMT",
                etag: 'W/"4055d9440e183ff562216e6710da081a870ee51f11ed4d89fd067e02728b52c5"',
                expires: "Thu, 15 Jan 2026 21:25:43 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "b21ef5fe812a3cdf2f063255b6fbbd163adf3b83",
                "x-frame-options": "deny",
                "x-github-request-id": "307E:145CDE:15D183:251411:69695A2B",
                "x-served-by": "cache-lhr-egll1980060-LHR",
                "x-timer": "S1768512044.513303,VS0,VE128",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/;petId=blue")
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
                date: "Thu, 15 Jan 2026 13:58:27 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/path/matrix/primitive.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });
    });

    describe(`simple`, function () {
      describe(`array`, function () {
        it(`handle when pathParam of simple is exploded`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/path/simple/array-exploded.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed59df6fdb36107ecf5f7160f7b001a99ca5c51ef2b4ac690063c31a2cedc390052b239d6db612c991a7a45e91ff7d2025db1249496e1a0c28103f5912793fbfbbef287d3e00604aa3e45ab013602fb2a3ec053b74777355692551926527f0f9000080d97c8515dfdd70cb0c72c20ba4ce4d00466b8d4ea0baf980397989ed136d944643026d6f8713c50997caac83fb63d2c625faa7a248dcedc8149270892610ea972c94a938b58b7e7ac98215f7e116267985e3da2c19219791a4de7520977daaca9463ad32f66a13b6be90ce554f60dac8d0c0c004fcc42b5dfa05855a2e05b241f17aa548bd33659c8cad0e6e0c5f872a0461954ce058e8be30541bdba264b33bc3b54607153235ee1949e2cb47f73209f129900fc37c2fa04f433d01f631b84f023e847caa98d2b9ec64f32d7fdc42221ee2fea1c0b0c4a91e8146bac80ab4b9119a84921eac48d00802218156089694c1a834655db113b862fc968b92df94c80edd66597815c0ac2a0b76ddb575fbbf633533f84f2d8cf7f4aa09c961b798af3b4be3386e63e888e02054b455d3b245f128749140fc04d62394078f0df2e28d2cd771b2ef477cfaf69ce961f5897593729f58f789759f583756fbc4baf0cdb1ee05d2a92f8b244d851593ac96b14a19ab9274854c56c704b98dd25b8cc0418a7bea000fe90069ea9b6a0303468f57e71409c66a86897082244668627a92f8f2200e92e278f79b8a72921c1fc5f38102992e91b122d9b34cf6299464a98c17cb1ee512174cba2487f23d4e9c8f528e2902fd3a100d10e91ec5fa20327d109d8e0d02fb93ea407cd3c43a790c3c57a6fafaa3e0434e0a41dcdfe9c21db3c18902b5f091d7812b8f3f3a6db4b6191fd03b12c277ba54bcc0e25c94f8f571cc553112c77d0ed52f8e8723d6ca198fd7e0ee0aade5cb2f133019b861f845e9ebf8792324df71f94e66c4240f1c18434f62eb35d2bc48ab8ab33444043b715c8bbf3fe2c0b0dbb7a6b1a5ddca2ce6b511b4be745f397a7862a735ad9411fff216eba9a868f12bf6c2b26922fdcdddb8f9b259212fd004261db4663121176af701860435a3d0e51d5f2ed1c00552b7a58625f976252c080b1cac9fa2c0a2b9ed6c6baf33803f550d3997b010b200551354ee31bf717f37ca38c1d58a489fcc66b6b9950975fd7d74eb07500694842b61f26c6110a52a30934887f0ac5d95d83513269ffd90019c2b03e40c6f6c3e84756b5b6dd1b714ae057cc435bcb71a73c1cbe71f71fd1e4801a1a5664537e4b01025a1b1d95f9be8b35b34b60dd18fd95176b4b94f682afb667189e656e43ed0b1997ecd6cb323579278de7d03b8cdfb36d50c2b2eca162484bcfa79278ef520588a1ca5c594b453cdf315c2f1d65800569bb263e3dddd5dc6fdaa4c99e5ac956567bfcd5fbdfefdf2f5f3e3ec285b5155b200621bdc3bbaf48f06617f75bdddea4994694eabcef7c199469a7df6f57cdff56119be22b57555717f2063e70e706e50b859c3fcac5b1e0196ff40aa8df45816725936ccd259ee78c01bea9b89d37981f4cb7a5ef4e8821b5ea143c3d6dbe637300034bd297c9dd40c379c56138c383f732ce89c2305c6db1fbfa6ddce2a6e4e8bde00eab2a1b1c4c3e66becff7ace191ec0b6ffbbaf2c5a0eb97261ecbdcb8820d7fc82240cc06f4ca341ab95437d4847c7474731db06e9b2759ea3b58bba842d98c27cb97a4749a9a873ad4b91fb5db30f36e0899deb4359f34fbf33b870a63c9bedbebfcfdacfeeb3601a0de390ba0e47fb866c7c7486e7e7977bc46a2e6f79290a989f81ad9de31895c99eba5e4eeaba4002a90816aa967b6b89078ea8ed39eab371d7eb7755dd5265d6a180dbe35d0f6d1ae106e97d499d2eb26bda8173af6fd1ac6925e4b265dbb5aa1b82eef0c72742237979a6f26026ebdbdaa195e13e7ade65f8e42414d9df3fb585024f7dd5b816b71d2b94f13919155adbce6017ca7cb3a93fdb46a5bf7a382063ceb6a25c7cc373e860206d3c9835194f9ab08ffa769ada0c10831974403db83ff80f5452494ca3230000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1475",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 21:12:02 GMT",
                etag: 'W/"adc83d0f8cb1945709cc79ac0f1c905c55d0f6b0f5bfc070e796cdf153ad54e8"',
                expires: "Thu, 15 Jan 2026 21:17:02 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "b966c72b9b363e903cebcec40eb73faa58e99159",
                "x-frame-options": "deny",
                "x-github-request-id": "5585:333C92:147005:231905:69695822",
                "x-served-by": "cache-lhr-egll1980073-LHR",
                "x-timer": "S1768511522.435487,VS0,VE150",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/blue,black,brown")
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
                date: "Thu, 15 Jan 2026 13:58:27 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/path/simple/array-exploded.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`handle when pathParam of simple is unexploded`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/path/simple/array.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed59df6fdb36107ecf5f7160f7b001a99ca5c51ef2b4ac690063c31a2cedc390052b239d6db612c991a7a45e91ff7d2025db1249496e1a0c28103f5912793fbfbbef287d3e00604aa3e45ab013602fb2a3ec053b74777355692551926527f0f9000080d97c8515dfdd70cb0c72c20ba4ce4d00466b8d4ea0baf980397989ed136d944643026d6f8713c50997caac83fb63d2c625faa7a248dcedc8149270892610ea972c94a938b58b7e7ac98215f7e116267985e3da2c19219791a4de7520977daaca9463ad32f66a13b6be90ce554f60dac8d0c0c004fcc42b5dfa05855a2e05b241f17aa548bd33659c8cad0e6e0c5f872a0461954ce058e8be30541bdba264b33bc3b54607153235ee1949e2cb47f73209f129900fc37c2fa04f433d01f631b84f023e847caa98d2b9ec64f32d7fdc42221ee2fea1c0b0c4a91e8146bac80ab4b9119a84921eac48d00802218156089694c1a834655db113b862fc968b92df94c80edd66597815c0ac2a0b76ddb575fbbf633533f84f2d8cf7f4aa09c961b798af3b4be3386e63e888e02054b455d3b245f128749140fc04d62394078f0df2e28d2cd771b2ef477cfaf69ce961f5897593729f58f789759f583756fbc4baf0cdb1ee05d2a92f8b244d851593ac96b14a19ab9274854c56c704b98dd25b8cc0418a7bea000fe90069ea9b6a0303468f57e71409c66a86897082244668627a92f8f2200e92e278f79b8a72921c1fc5f38102992e91b122d9b34cf6299464a98c17cb1ee512174cba2487f23d4e9c8f528e2902fd3a100d10e91ec5fa20327d109d8e0d02fb93ea407cd3c43a790c3c57a6fafaa3e0434e0a41dcdfe9c21db3c18902b5f091d7812b8f3f3a6db4b6191fd03b12c277ba54bcc0e25c94f8f571cc553112c77d0ed52f8e8723d6ca198fd7e0ee0aade5cb2f133019b861f845e9ebf8792324df71f94e66c4240f1c18434f62eb35d2bc48ab8ab33444043b715c8bbf3fe2c0b0dbb7a6b1a5ddca2ce6b511b4be745f397a7862a735ad9411fff216eba9a868f12bf6c2b26922fdcdddb8f9b259212fd004261db4663121176af701860435a3d0e51d5f2ed1c00552b7a58625f976252c080b1cac9fa2c0a2b9ed6c6baf33803f550d3997b010b200551354ee31bf717f37ca38c1d58a489fcc66b6b9950975fd7d74eb07500694842b61f26c6110a52a30934887f0ac5d95d83513269ffd90019c2b03e40c6f6c3e84756b5b6dd1b714ae057cc435bcb71a73c1cbe71f71fd1e4801a1a5664537e4b01025a1b1d95f9be8b35b34b60dd18fd95176b4b94f682afb667189e656e43ed0b1997ecd6cb323579278de7d03b8cdfb36d50c2b2eca162484bcfa79278ef520588a1ca5c594b453cdf315c2f1d65800569bb263e3dddd5dc6fdaa4c99e5ac956567bfcd5fbdfefdf2f5f3e3ec285b5155b200621bdc3bbaf48f06617f75bdddea4994694eabcef7c199469a7df6f57cdff56119be22b57555717f2063e70e706e50b859c3fcac5b1e0196ff40aa8df45816725936ccd259ee78c01bea9b89d37981f4cb7a5ef4e8821b5ea143c3d6dbe637300034bd297c9dd40c379c56138c383f732ce89c2305c6db1fbfa6ddce2a6e4e8bde00eab2a1b1052f6df8b4f91cfbbf1e748627b0edffee3b8b9644ae5c1c7b2f3322cc35bf200b03f81bd368d06ae5601ff2d1f1d1514cb741be6c9de768eda22e618ba63061aee051522aea5ceb52e47ed7ec830d8862e7fa50d6fcd3ef0c2e9c29cf66bb0ff0b3f6bbfb2c1847c338a4aec3d9be611b1f9de101fae51eb19acb5b5e8a02e667606be7384675b2a7ae9793ba2e90402a8285aae5de5ae28923ea7b8efb6cdcf6fa6d55b75c997538e0f678d7449b4eb8417a5f52a78decba76e0dceb5b346b5a09b96ce976adea86a13b04f289d0485e9ea93c18cafab6767865b8919e77293e390a45f6f78f6da1c0535f35aec76de70a657c4e4685d6b633d98532df6ceacfb651e9af1e0ec898b3ad2817dff0203a18481b4f664dc69326eca3be1da73613c460061d500fee0ffe0368558cfea4230000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1478",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 15:48:29 GMT",
                etag: 'W/"6ab19b0757815e06eaccb10b79b993ffc9dbaf6a7cf720fe9193e96c653ae0ce"',
                expires: "Thu, 15 Jan 2026 15:53:29 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "5dd18a7f65a6b94c2917efe5082b5bbd497dee4e",
                "x-frame-options": "deny",
                "x-github-request-id": "AA5A:50E8F:B7EED:12F3B0:69690C4D",
                "x-served-by": "cache-lhr-egll1980070-LHR",
                "x-timer": "S1768492110.722049,VS0,VE117",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/blue,black,brown")
            .reply(
              200,
              {
                id: 404,
              },
              {
                "access-control-allow-headers":
                  "Content-Type, api_key, Authorization",
                "access-control-allow-methods": "GET, POST, DELETE, PUT",
                "access-control-allow-origin": "*",
                connection: "keep-alive",
                "content-type": "application/json",
                date: "Thu, 15 Jan 2026 20:35:59 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/path/simple/array.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });

      describe(`object`, function () {
        it(`handle when pathParam of simple is exploded`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/path/simple/object-exploded.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed5a516fdb36107ecfaf38b07b588154cad2620f795ada3483b1610d9af661c8829591ce325b89e448caa957e4bf0fa4645b2229c975bd8702f1932d9177c7e3f7dd7794fce5088008899c4a46ce803c4f4e92e7e4d85ecd442505476e3439832f47000044670bace8f6821da6901abc42d3b90840cc4aa23528ee3e62669cc5f68e5442a2320c756f8635450d1642adbceb63d6c62dbabb2c8f5cedd864dc6081ca33ea86cc85aaa86907fdfc8278231efc2984d30ac7bd69a3182f024bbddf9e5df2b92a630b6b9d9157ebb4f58d747ef50cc683f403f442c0cfb492a51b908ba2604806cdcb8530e2bd2ac3cdd8f8a04ad195ef8219aca21b3896baaf4cd53ab660b3c9bda252a2858a5135ee9849438b83af320af129900fc37c27a04f433d02f631b84f02de877c8c4cf1bdecece63b7a582219eae37e5f6068434d3d028d38c972d49962d230c11d58d14063081807b340d046280ca8c9eb8a9cc10da14bca4a7a572239b69379ee5c00d1a2ccc96d37d6cdf74ed444e13f35536ea5374d4a8ebb64beed0c0df3b8c9a1158223dfd1c64dab16f941e42282f809ac0728f76e2ba4f91b5eaec2cd7e1859d3f7b7981e561f55376af751751f55f7517543b78faa0bdf9dea5ea13977b488ca94cf98285bc69832c692384326d931216ea3f216227050e21e2bc03e15202e7d53656020e871764e8960e86658082744624426a63b89af4fe2a0288e57bfa92c47c5f1202b1f20c83445c648b2234d76214a942ae364d9812e2161e2941cdaef71e13c081d6302fa6d201a10d21dc8ba9798ee25a7638dc0eea23a90dfb8b04e1e032f85aabefd28b8cf49c1cbfb7b99db6336585320e62ef3d25bcae15ba7b5d776c707fc8ea4f0bd2c05cd31bf64257e7b1e33918fe4719743f5f3d3e18cb576c6f33538bb42ad69f175062613370cbf60fb3aebbc639c6eb57c6b3350923d1b467f2561f412cd2c8fbb0a77694808b6e6a8647f7fc28166b71f4d134b3b9568cc6ac5cceadabee5e8e1899cd7662114fb97b6588f6545b2dfb097967511e94feee6cdd166813447e58574d48645189f8bed0b18c34cd30a5ddfd3a240055768ba25d5a7e4bb05d3c03450d0ae8b028d6ad999d6fe4e00fe14356494c39cf11c446da0b2b7e99dfdba76460ddc2c8c916769aa9b4b0913b73f06979e82502038dc3095257385c8458e0947730c4fda519159295359fa3401b8140a8c0dbc89f918566d6cb5465752a864f00957f0414bcc182d9f7dc2d50730020c6ad38ce8a61ce6ac34a874f2d73afb64894ab729fa2939494ed6d70daa4abf995fa35ab2cc253a0cd38d49d73332c10dcdba4f0037fbbed96a821565650b1283b4fa656b8ef42058b20cb9c698b57349b305c2e926580052abb213e3fdfd7d42dda844a8226d6de9f4f7d9abd77f5cbf7e769a9c240b5395c483d81af7562eddad41d8dfdc6ea63a1125929a45e7fd602ad1a45f1c9f1fba6b28fc47a4baae2aea0e64e4d202ce360a772b985d74e9e161f92d9a5a718765c68bb25196ce70ab032e50574caccf2b342f57b3bc271754d10a2d1a36ab6d3e030d40539bfcc7494d7343cd62421167175605ede28c00e5e20f1fd36e7a15dba7054f0065d9c858e466f336f6ff38d4be9d3a5df2babadbd6aced27d61aff7a48632ff73636de014785b6fbf4a595c31b8b88de6399803dcdc7c3d30093c63c2ad4525802fbca7a7a7212360e1ef2749d65a8f5bc2e61c30b1f7ab6742137310051294b96b959e947ed49de76e9430074777f5038b7a13c49b77f2548db7f10a45e63ede721f6db3fa534bae9b2337c1478b143ae667c494b96c3ec02746d178e01e377f4f562d2d7151ae0c2c05cd47c672f61ef145470abe23a2ce07d8190adea271d355b9e6ee5a0a9e96ba4f72d750ae2567fbcc5bd5ea25a9905e345db38ac44ddf41a1d29fc6c50715a5e88cc6b2ffbb176147258122ebbcd4ab4a90be2ef1f407d83e78e35b65a6f3a24a1dc9e8c1aad75a747f56dbe59f34fb759e98f1e4ec8d8625b5336bffe917a30913aec319b1d8f86b08bfbb6315cf742833b68817af470f41fd3ecc7726e240000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1500",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 21:14:13 GMT",
                etag: 'W/"70cda31283632dcfd61ac982c2b1707db2ae4070d79046c59adfae2cfb6c519d"',
                expires: "Thu, 15 Jan 2026 21:19:13 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "HIT",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "f3a1d3b9eff1b27041d451cbb55dad50cadf64d4",
                "x-frame-options": "deny",
                "x-github-request-id": "B8B7:521EA:1443BA:2226E0:69694FFF",
                "x-served-by": "cache-lhr-egll1980071-LHR",
                "x-timer": "S1768511654.806312,VS0,VE124",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/R=100,G=200,B=150")
            .reply(
              200,
              {
                id: 404,
              },
              {
                "access-control-allow-headers":
                  "Content-Type, api_key, Authorization",
                "access-control-allow-methods": "GET, POST, DELETE, PUT",
                "access-control-allow-origin": "*",
                connection: "keep-alive",
                "content-type": "application/json",
                date: "Thu, 15 Jan 2026 20:41:04 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/path/simple/object-exploded.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`handle when pathParam of simple is unexploded`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/path/simple/object.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed5a516fdb36107ecfaf38b07b588154cad2620f795ada3483b1610d9af661c8829591ce325b89e448caa957e4bf0fa4645b2229c975bd8702f1932d9177c7e3f7dd7794fce5088008899c4a46ce803c4f4e92e7e4d85ecd442505476e3439832f47000044670bace8f6821da6901abc42d3b90840cc4aa23528ee3e62669cc5f68e5442a2320c756f8635450d1642adbceb63d6c62dbabb2c8f5cedd864dc6081ca33ea86cc85aaa86907fdfc8278231efc2984d30ac7bd69a3182f024bbddf9e5df2b92a630b6b9d9157ebb4f58d747ef50cc683f403f442c0cfb492a51b908ba2604806cdcb8530e2bd2ac3cdd8f8a04ad195ef8219aca21b3896baaf4cd53ab660b3c9bda252a2858a5135ee9849438b83af320af129900fc37c27a04f433d02f631b84f02de877c8c4cf1bdecece63b7a582219eae37e5f6068434d3d028d38c972d49962d230c11d58d14063081807b340d046280ca8c9eb8a9cc10da14bca4a7a572239b69379ee5c00d1a2ccc96d37d6cdf74ed444e13f35536ea5374d4a8ebb64beed0c0df3b8c9a1158223dfd1c64dab16f941e42282f809ac0728f76e2ba4f91b5eaec2cd7e1859d3f7b7981e561f55376af751751f55f7517543b78faa0bdf9dea5ea13977b488ca94cf98285bc69832c692384326d931216ea3f216227050e21e2bc03e15202e7d53656020e871764e8960e86658082744624426a63b89af4fe2a0288e57bfa92c47c5f1202b1f20c83445c648b2234d76214a942ae364d9812e2161e2941cdaef71e13c081d6302fa6d201a10d21dc8ba9798ee25a7638dc0eea23a90dfb8b04e1e032f85aabefd28b8cf49c1cbfb7b99db6336585320e62ef3d25bcae15ba7b5d776c707fc8ea4f0bd2c05cd31bf64257e7b1e33918fe4719743f5f3d3e18cb576c6f33538bb42ad69f175062613370cbf60fb3aebbc639c6eb57c6b3350923d1b467f2561f412cd2c8fbb0a77694808b6e6a8647f7fc28166b71f4d134b3b9568cc6ac5cceadabee5e8e1899cd7662114fb97b6588f6545b2dfb097967511e94feee6cdd166813447e58574d48645189f8bed0b18c34cd30a5ddfd3a240055768ba25d5a7e4bb05d3c03450d0ae8b028d6ad999d6fe4e00fe14356494c39cf11c446da0b2b7e99dfdba76460ddc2c8c916769aa9b4b0913b73f06979e82502038dc3095257385c8458e0947730c4fda519159295359fa3401b8140a8c0dbc89f918566d6cb5465752a864f00957f0414bcc182d9f7dc2d50730020c6ad38ce8a61ce6ac34a874f2d73afb64894ab729fa2939494ed6d70daa4abf995fa35ab2cc253a0cd38d49d73332c10dcdba4f0037fbbed96a821565650b1283b4fa656b8ef42058b20cb9c698b57349b305c2e926580052abb213e3fdfd7d42dda844a8226d6de9f4f7d9abd77f5cbf7e769a9c240b5395c483d81af7562eddad41d8dfdc6ea63a1125929a45e7fd602ad1a45f1c9f1fba6b28fc47a4baae2aea0e64e4d202ce360a772b985d74e9e161f92d9a5a718765c68bb25196ce70ab032e50574caccf2b342f57b3bc271754d10a2d1a36ab6d3e030d40539bfcc7494d7343cd62421167175605ede28c00e5e20f1fd36e7a15dba7054f0065d9c8d89c96dabfdbbc8efd3f4eb56fa78e97bcaeeeb6456bfb89f5c6bf1ed2d8cbbd8d8db7c051a5ed3e7e69f5f0c642a2f75c26a04ff3f1003540a5318f0ab51496c1beb49e9e9c849d83073d5d67196a3daf4bd810c3c79ead5dc84d0c4054ca92656e56fa517b9ab75dfa1000dddd1f14ce6d284fd2ed7f09d2f62f04a9d759fb7988fdf68f298d70baec0c9f055eec90ab195fd292e530bb005ddb856340f91d7dbd98f4758506b830301735dfd94bd83c0525dccab80e2b785f21642bfb4947ce96a75b3d688afa1ae97d4b9d8ab815206f71af97a85666c178d1760e2b5137cd46470b3f1b549c961722f3facb7eac1d891cd684cb6eb712edea82f8fb2750dfe0b9638d2dd79b164928b727a3466bdd69527d9b6fd6fcd36d56faa3871332b6d8d694cdaf7fa61e4ca40e9bcc66c7a321ece2beed0cd7cdd0e00e5aa01e3d1cfd07d79a7a6b6f240000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1503",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 15:48:30 GMT",
                etag: 'W/"618b9fd906d1956cc9c30428155559fad8d1e24959257b2092875185d5900ad4"',
                expires: "Thu, 15 Jan 2026 15:53:30 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "ba31ea955c1e2aec6214b05763ce591eb40e9694",
                "x-frame-options": "deny",
                "x-github-request-id": "9F44:9E366:C62A0:13D80B:69690C4E",
                "x-served-by": "cache-lhr-egll1980070-LHR",
                "x-timer": "S1768492110.401447,VS0,VE120",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/R,100,G,200,B,150")
            .reply(
              200,
              {
                id: 404,
              },
              {
                "access-control-allow-headers":
                  "Content-Type, api_key, Authorization",
                "access-control-allow-methods": "GET, POST, DELETE, PUT",
                "access-control-allow-origin": "*",
                connection: "keep-alive",
                "content-type": "application/json",
                date: "Thu, 15 Jan 2026 20:39:30 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/path/simple/object.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });

      describe(`primitive`, function () {
        it(`handle when pathParam of simple is exploded`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/path/simple/primitive-exploded.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed59cf6fdb3614bee7af786077588154ced262879c96350d606c5883a63d0c59b032d2b3cd5622399272e215f9df0752b24d51a4e424dea1407cb224f2fdfcdefb1ea56f07004448e454327202e4757694bd2687f66e2e2a293872a3c9097c3b0000203a5f6045b737ec3285d4e0051aef2600312b8956a0b8f982b97112db27520989ca30d49d1d56143538176a15dc1f92362cd13d6545e4ae2793718373548150b7642654454dbbe8e7372458711f6e219c5638ac4d1bc5f8bc27a9731dc82577551973ac5546deaec3d615e25d7504c68d0c0d0c4cc03b5ac9d22d28c47cce9024c5cb8530e2932afbc9d8e8a04ad155a88219aca2091c0add0343b5b6ad976c72aba89468a162548d3b46d2d0f9debd8c427c0ce46998ef04f471a847c03e04f751c087908f15533c975e363fd2fd1692a121ee1f0b0c6da8a907a0112fb20275ae98344c70075634d00802c6c12c10b4110a7ba5c9eb8a9cc015a14bca4a7a532239b49b79e15400d1a22cc8b56febe6bf673551f84fcd94f3f4aa09c9a15fccd7ded27e1c3731b44470102adaa869d9a2d80b5d44103f82f51eca83c70a69f19e97ab7eb2ef077cfafe9ce960f59975a3729f59f799759f59b7aff69975e1bb63dd0b34a7ae2ca23415564cb45a862a65a84ae215325a1d23e436486f7d042629eeb9033ca603c4a96fac0d248c1eaece3112ecab4913e108490cd0c4f824f1f020264971b8fb8d45394a8e7bf13c5120e3253254243b96c92e85122d95e162d9a15cfa05132fc954be8789732fe51823d0a7812841a43b14eba3c8f451743a3408ec4eaa89f8c68975f418782e54f5f4a3e0634e0a41dc3fc9c21eb3c18a0231739197812bfb1f9dd65adb8c27f40e84f0932c052db03867253e3d8eb92806e2b8cba1faf5713a62ad9ce178257757a8359d3f4cc068e0d2f0eba5cff3f38671bae5f2adcc1e933c72600c3de95b2fd14c8bb8aa7e965244b0154725fbfb2b2686ddae358d2ded56a231af1533ab4bfb95a38327725a9b8550ec5fda623d1615c97ec34e58d64da4bbd98f9b2b9b05d2025560d2416b16617c26b61f600c33cd2874794be773547081c66fa961497e5c300d4c0305eda628d0a896deb6f63a03f853d490530e33c60b10b581ca3ea637f6ef5a193570b530469e4c26bab9953171fd63efd64b100a04872ba6f26ca610b92830e3680ee145bb2ab26bc2543e7999019c0b05c61aded87c08abd6b65aa36b295432f88a2bf8ac25e68c96afbee2ea33180106b56956f82187192b0d2a9dfdb58e3e59a2d26d887eca8eb2a3f57d83aad2ef6797a8962c7781ee9be9d64cd63b72c10dcdfd37809bbc6f524db0a2ac6c41629056bf6cc5910e044b9623d71893762a69be4038de180b406a557a36dedede66d4adca849a4f5a597af2fbf4edbb3f2edfbd3ace8eb285a94a12406c8d7b4b97ee5112f657d79bad8e4489a466e17d1f9c4834936fae9eef7d1fe6e12b525d5715750732726e016707859b154ccffcf208b0fc014dadb8c332e3f3b261166fb9e50167a86b2656e7059a5f57d3a2431754d10a2d1a36de36bfc400d0f4a6f0755233dc50b31861c4e9996541eb9c11a09cfdfdd7b49b59c5ce69e124e63eb8c626b11f14ceac8a1793ed87da49fb7d76d258bddbb49470fcee55fc4d9adfb2f6e4caff762a4b0760f3df7fc1d232de954d7ae7cd4baf40a2914b14cb9046855a0a5ba321791e1f1df56783005cbace73d47a5697b0817e9812db9d909b58d4a99425cbddaec9171db0dad6f554d6601484c1ec1cc621761d1e441a9cb9e8a4a7fd373bc46aca97b464054ccf40d7d671ec15f58ebade8ceaba40035c1898899aefaca53f1ef59ab4256addefd15d0e902db1671e612d8fb71dbf69db6ba47725793d6f4b318173ef96a85666c1f8bc9d0d56a26ec6098fedee0c2a4ecb3391071364d7568f04d35dffdc9f47a2735bcffeee19331478eaaac636e4cd102494cbc9a0d05a7b0d2f94f97e5d7fba8d4a77753a2043ceb6a26c7cc353733290ba3f4636198f9ab08bfa76f65b8f3bc90c5aa01edc1ffc07a937df2351240000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1491",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 13:57:26 GMT",
                etag: 'W/"c70499052dadc2bfa0db9974bef60ba6bee6c55a1a65976b39609e5799a2a9fc"',
                expires: "Thu, 15 Jan 2026 14:02:26 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "e3214974c6e5c4399167d7bcbf3cfb4a81b682a5",
                "x-frame-options": "deny",
                "x-github-request-id": "E767:93F2B:7BB2D:CB92F:6968F246",
                "x-served-by": "cache-lhr-egll1980038-LHR",
                "x-timer": "S1768485447.800110,VS0,VE129",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/blue")
            .reply(
              200,
              {
                id: 404,
              },
              {
                "access-control-allow-headers":
                  "Content-Type, api_key, Authorization",
                "access-control-allow-methods": "GET, POST, DELETE, PUT",
                "access-control-allow-origin": "*",
                connection: "keep-alive",
                "content-type": "application/json",
                date: "Thu, 15 Jan 2026 20:43:02 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/path/simple/primitive-exploded.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`handle when pathParam of simple is unexploded`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/path/simple/primitive.json",
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
                date: "Thu, 15 Jan 2026 20:44:36 GMT",
                etag: 'W/"1422fa48d6726aaf62e6e6e6d31e64546b6439f3dfcca6b446461c92b5e336fd"',
                expires: "Thu, 15 Jan 2026 20:49:36 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "a59e0f7bcf527d7da1654ab25080e0014f23346d",
                "x-frame-options": "deny",
                "x-github-request-id": "F461:38B922:13AA24:21B26E:696951B4",
                "x-served-by": "cache-lhr-egll1980050-LHR",
                "x-timer": "S1768509877.703382,VS0,VE118",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/blue")
            .reply(
              200,
              {
                id: 404,
              },
              {
                "access-control-allow-headers":
                  "Content-Type, api_key, Authorization",
                "access-control-allow-methods": "GET, POST, DELETE, PUT",
                "access-control-allow-origin": "*",
                connection: "keep-alive",
                "content-type": "application/json",
                date: "Thu, 15 Jan 2026 20:44:37 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/path/simple/primitive.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });
    });
  });

  describe(`query`, function () {
    describe(`deepObject`, function () {
      describe(`object`, function () {
        it(`should handle when a queryParam of deepObject is set`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/query/deepObject/object.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed5a4d6fdc3610bdfb570c981e5ac0911c3be8c1a73a695c04fd7050c787c2351aae34bbcb441219925a671be4bf17a4b45a8aa4a4f5667b08601f0caf440e671edfcc1b72fdf90880708115158c9c03394b4e9233726c9e66bc14bcc24a2b720e9f8f000088ca9658d2ed03334c22d5f806b5f31080e8b5406390cfde63a6adc5f68d905ca0d40c556f863145352eb85c7bcfc7ac8d5bb46f591e79ead86495c6054acfa81d32e7b2a4ba1df4e373e28df8e24f21152d717c35a525ab1681a5de67cf2ef95416b1c0dac5c8cb0d6c7d23cea79ec1b893be839e0bf88996a2b00372be58302483e6c5926b7e238b7033ba35a89474ed2fc13496d10d1c83ee81506d7c0b369bdc4b2a041aaa6859e38e486aba387894518a4f917c98e63b117d9aea11b28fd17d92f03ee563c914df4b6737dfd2c32692a63eeff72586d254d723d48827598e2a934c68c62b4b56d4d0180256815e2228cd2506a959d52539875b42579415745620393693abdc2e0144f1222777aeafdddf8ed744e2c79a491be96d03c9b19bcc77ced010c70e43230447fe42dd32ad5ae407918b08e327b81eb0dc7b2d91e65755b10e37fbcb484cdf5e303dae3eaa6ed4eea3ea3eaaeea3ea86cb3eaa2e7c73aafb06f5854d8ba84cf91913cd96b14c19cb9278864c66c784b88dca5bc8c041897bac00fb5480b8f44d958101a7c7b3734a04c3658685704224466462ba9378388883a2385efda6508e8ae341221f4890e914194b921dd364974489a6ca78b2ec902e61c2c4537268bfc785f320e91813d0af23d18090ee90ac7b89e95e723ad608ec2eaa03f8c68575f21878c965f9f547c17d4e0a1eee372237c76c30a680cf2df2c20be5f0add366d576c707d61d81f046149ce6985fb202bf1ec78ce72338ee72a83e3b1d46acb5338ed7e0ec1295a28b871998046e987ec1f63971ce5845b75abeb51928c99e0da31f49e8bd40fd3a8f2f15eed290106ccd51c1fef98003cd6edf9bc697762a5198d592e9f5b5f996a3c7277251eb2597ec5fda723d868a60bf620f964d11e94f7671b369b3449aa3f45c3a6add22ac9af3ed17309ae9a615babea78b054a7883da2da97e4abe5d32054c010565bb28502857ceb4f67302f017af21a315cc599503af3594e6359d993f378b510db74badc5799aaae651c2f8ddf7c1a31f804be015dc329925738958f11c930af5313c69474566a54c66e90f09c02597a08de38dcfc7b06e7dab15da924205830fb886774a60c668f1f403aedf81e6a051e966840b39cc59a151aae4ef0dfa648552b5103d4b4e9293cd738db25457f36b942b9659a04337ed98743323e395a6997b03d8ed7bb7d5044bca8a96241a69f9d3d61ce951b06019560a63d62e04cd9608a79db300a49685e3e3fdfd7d42eda884cb45dada52e96faf5fbefae3fad5d3d3e42459eab2201ec536bc3772695f0dd2fef6ae9b6a459408aa97cef783a9409d1a06bd58bfed970fb2f06f49555d96d49ec9c825ab72653909b335d8c2e3648947e9dfeb8219269b619615330421f98ae598c33dd34bc87859525028a86cf5c8e4bc4ae046d969cf8ecdef53fbfb0ce6866da834ab1689bbac91151bb7ad4dc444653c6c237315884a5aa221580760f333d05378f13995e0638d32b8bbf233da84ad79cb699805e39de6c7347ec195a2281a5d8cbc547add1eb410c555f4d6b7f906f8ff3848ff3975a2adea72b6ad93db9f583bfecb218dbdd8dbd878d71d1577f7c6a795e05ba390bdaba01c854473ab11ee3291a8043779ef0bf2e9c949d86f78ec527596a152f3ba808eff3e054cc5c34ac738408528586667a5ef95a794dda8410ed9b7df499c1b579ea4dbff4048db7f3c48bb9bac8762edc5d068ae8568f818f17c07c05e572b5ab0dc941258d1a20e2e0a87560afba1a02a1b65566151ee177dd12a79e228d4ea745be29b3abd6152df52771781db7cf5037cb542b9d64b562dda6660cdeba67f70e4ed934659d1e2679e792d63df5747f586ebfba5db80441bb5c0fffea1d2377861296d6a66d7f57069f764d468ad9cbed3b779b5490ed5a2d21f3d0cc858b0ad2983af7f4c1e0452857d63b3e351177659be6df636fdcde00e1aa21e7d39fa0f03ab125b42240000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1538",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 15:48:30 GMT",
                etag: 'W/"12925bd2cd791e015abae98a82e47a30ffb861c4ba26904b777e92e0bff564b9"',
                expires: "Thu, 15 Jan 2026 15:53:30 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "2de0ab4df111bac18059a7c2707022ffd033c2ba",
                "x-frame-options": "deny",
                "x-github-request-id": "DCC9:3645F4:BA827:131CF8:69690C4D",
                "x-served-by": "cache-lhr-egll1980070-LHR",
                "x-timer": "S1768492111.587507,VS0,VE116",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/findByTags")
            .query({
              "tags%5BR%5D": "100",
              "tags%5BG%5D": "200",
              "tags%5BB%5D": "150",
            })
            .reply(
              200,
              { id: 123 },
              {
                "access-control-allow-headers":
                  "Content-Type, api_key, Authorization",
                "access-control-allow-methods": "GET, POST, DELETE, PUT",
                "access-control-allow-origin": "*",
                connection: "keep-alive",
                "content-type": "application/json",
                date: "Thu, 15 Jan 2026 16:13:16 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/query/deepObject/object.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });
    });

    describe(`form`, function () {
      describe(`array`, function () {
        it(`should handle when queryParams of an exploded array are set`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/query/form/array-exploded.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed594d6fdc3610bdfb570c981e1ac0d13a76d0834f75531b08fa91008e0f856b345c6956cb441219925a5b0df2df0b525a2d4552d2c6360a04f01e16bb14391c3ebe9937a4be1c00102eb0a28291532027c95172420e4d6bca4bc12bacb422a7f0e5000080a8748d25dd35986e12a9c677a89d4600a21b81c6205f7ec4545b8bdd1321b940a919aac108638a6accb96cbcf6296bd316ed5396455a1d9bacd298a3f48cda2e2b2e4baabb4e3fbd225e8faffe1052d112a767535ab22a0f2c0dfe7b76c95d59c416d64d465e6f611b1a71fe0d0cc69df41df45cc03b5a8ac276c8789e3324a3e6c59a6b7e258b7033fa39a894b4f1a7601acbe8064e41f78d506d7d0b369bdc4a2a041aaa6859e39e486a9a3ffa2aa3149f23f938cdf722fa3cd523649fa2fb2ce17dcac78229be97ce6ebea78f1b489afabcbf2f3194a6ba9ea0463cc83254a96442335e59b2a286d610b00af41a41692e3108cdaa2ec9295c13baa1aca0cb02c9a1195c65760a208a1719b9717ded7f3b5e13899f6b26ed4aaf5b480edd60be71ba8638f6181a2138f027eaa7e9d4227b14b988307e86eb01cbbdc71269f6b62a9a70b3bf4eace9fb5bcc80ab4faa1bb5fba4ba4faafba4bae1b44faa0bdf9deabe437d66c3222a537ec444a3652a52a6a2241e21b3d131236e93f216327054e29e32c07d32405cfae6d2c088d3d3d1392782e134e3423823121332315f497c3b88a3a2389dfde6508e8ae3a3ac7c2440e643642a48f60c937d02251a2ad3c1b247b88401130fc9b1fd9e16ce4709c798803e8c442342ba47b0de4b4cef25a75385c0fea23a826f5c58678f81175c960f3f0adee7a4e0e17e253273cc06630af8ca222fbca53c7ee9b49db5dbf191792720bc1205a7196617acc087e398f26c02c77d0ed527c7e3887576a6f11a1d5da25234ff3603b3c08dd32fd83e679d4b56d19d96ef6c064a72cf82d15f49e8bd40fd268b4f15eed29810eccc51c1fef98423c5eed09bd6976e285198d692e9e6d2bce518f0899cd57acd25fb97765c8fa122d86f3880659b4486835ddc6cd8ac9166283d970e3ab708ab567cf7024633dd964297b734cf51c23bd46e4af543f2fd9a29600a28285b458142b9718675ff1380bf780d29ad60c5aa0c78ada1348fe9d2fcdc4e46355cafb516a78b856a9b12c66f7e0c9a9e0397c02bb866324d5612b1e2192615ea4378d6f58a8c5a30992e9e2700175c82368eb73e1f42d3f9562bb429850a069fb0810f4a60ca68f1e213361f4073d0a874dbc3851c56acd02855f2f7167db241a93a885e2647c9d1b65da32cd5dbd525ca0d4b2dd0a19bb6cf623b22e595a6a97b03d8ef7bbfd5044bca8a8e241a69f9f3ce1c1950b06029560a63d6ce044dd708c7bdb300a49685e3e3eded6d426daf84cb7cd1d9528bdfdfbc3efff3f2fcc5717294ac7559108f625bde1bb9b48f46697f7dd30fb5224a04d56be7fde042a05e1806fdd2bc1fa60f92fbb7a4aa2e4b6acf64e4825599b29c84650336f13851e251fa8fba6086c9a69b65c5124148be61196670cbf41a525e9614140a2a3b3d3231af12b85276d8cb43f37d6cbf4f6065d8864ab32a4fdc698dacd875dbdc44ccaa8c87ddca5c05a292966808d603d87e466a0a6f7d4e26f85ca30ceeaefc8836cbd6bce3342c83fe4ef1630abfe04a5114ad2e461e2addb4d9c5e458df6efbeef77f3d558d977bfd6ff782a453ac6b2328839b930c85447309108242242ac14d98f8fa757c7414cab3b719aa4e53546a5517d0d3c5c7cd2408ac740c382a44c1523b6af15179c2d2f71a05de3efd41e2cab8f26cb17b61bfe8ded32ffa8b9ff973c7e481a095280bd178d5fd6a0fc0de541b5ab0cc441e6c685107f76a633385e54390c48c90a930870d73a4e8842f7112fae6789711dbb4b665d2d0527f74c75d05ea2ff07c83b2d16b56e59d7636bc6ee5d651833b8db2a2c5af3cf52aaca1af8e488ca7c30b57afa3754de0fff00ce61b3cb3943629a62f12b8b47b3269b4564e99e6db7cbb0d0ed5a132ec3d0ec8d4623b53065fff54390aa40acbac76c7a32eec337d571b6dcb81d11d34443df87af01f22582c3371230000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1510",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 15:48:31 GMT",
                etag: 'W/"f64a850762dd4b5e7b0a5e8809e6d89c28d13ef1bf55e978b0d9c10e38461513"',
                expires: "Thu, 15 Jan 2026 15:53:31 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "d897a88b1a12a07f8808911bcb52c71332b02f4e",
                "x-frame-options": "deny",
                "x-github-request-id": "9E2C:3684CE:BBC98:132FAC:69690C4E",
                "x-served-by": "cache-lhr-egll1980070-LHR",
                "x-timer": "S1768492111.921310,VS0,VE128",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/findByTags")
            .query({ tags: ["blue", "black", "brown"] })
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
                date: "Thu, 15 Jan 2026 16:15:30 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/query/form/array-exploded.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`should handle when queryParams of an unexploded array are set`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/query/form/array.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed594d6fdc3610bdfb570c981e1ac0d13a76d0834f75531b08fa91008e0f856b345c6956cb441219925a5b0df2df0b525a2d4552d2c6360a04f01e16bb14391c3ebe9937a4be1c00102eb0a28291532027c95172420e4d6bca4bc12bacb422a7f0e5000080a8748d25dd35986e12a9c677a89d4600a21b81c6205f7ec4545b8bdd1321b940a919aac108638a6accb96cbcf6296bd316ed5396455a1d9bacd298a3f48cda2e2b2e4baabb4e3fbd225e8faffe1052d112a767535ab22a0f2c0dfe7b76c95d59c416d64d465e6f611b1a71fe0d0cc69df41df45cc03b5a8ac276c8789e3324a3e6c59a6b7e258b7033fa39a894b4f1a7601acbe8064e41f78d506d7d0b369bdc4a2a041aaa6859e39e486a9a3ffa2aa3149f23f938cdf722fa3cd523649fa2fb2ce17dcac78229be97ce6ebea78f1b489afabcbf2f3194a6ba9ea0463cc83254a96442335e59b2a286d610b00af41a41692e3108cdaa2ec9295c13baa1aca0cb02c9a1195c65760a208a1719b9717ded7f3b5e13899f6b26ed4aaf5b480edd60be71ba8638f6181a2138f027eaa7e9d4227b14b988307e86eb01cbbdc71269f6b62a9a70b3bf4eace9fb5bcc80ab4faa1bb5fba4ba4faafba4bae1b44faa0bdf9deabe437d66c3222a537ec444a3652a52a6a2241e21b3d131236e93f216327054e29e32c07d32405cfae6d2c088d3d3d1392782e134e3423823121332315f497c3b88a3a2389dfde6508e8ae3a3ac7c2440e643642a48f60c937d02251a2ad3c1b247b88401130fc9b1fd9e16ce4709c798803e8c442342ba47b0de4b4cef25a75385c0fea23a826f5c58678f81175c960f3f0adee7a4e0e17e253273cc06630af8ca222fbca53c7ee9b49db5dbf191792720bc1205a7196617acc087e398f26c02c77d0ed527c7e3887576a6f11a1d5da25234ff3603b3c08dd32fd83e679d4b56d19d96ef6c064a72cf82d15f49e8bd40fd268b4f15eed29810eccc51c1fef98423c5eed09bd6976e285198d692e9e6d2bce518f0899cd57acd25fb97765c8fa122d86f3880659b4486835ddc6cd8ac9166283d970e3ab708ab567cf7024633dd964297b734cf51c23bd46e4af543f2fd9a29600a28285b458142b9718675ff1380bf780d29ad60c5aa0c78ada1348fe9d2fcdc4e46355cafb516a78b856a9b12c66f7e0c9a9e0397c02bb866324d5612b1e2192615ea4378d6f58a8c5a30992e9e2700175c82368eb73e1f42d3f9562bb429850a069fb0810f4a60ca68f1e213361f4073d0a874dbc3851c56acd02855f2f7167db241a93a885e2647c9d1b65da32cd5dbd525ca0d4b2dd0a19bb6cf623b22e595a6a97b03d8ef7bbfd5044bca8a8e241a69f9f3ce1c1950b06029560a63d6ce044dd708c7bdb300a49685e3e3eded6d426daf84cb7cd1d9528bdfdfbc3efff3f2fcc5717294ac7559108f625bde1bb9b48f46697f7dd30fb5224a04d56be7fde042a05e1806fdd2bc1fa60f92fbb7a4aa2e4b6acf64e4825599b29c84650336f13851e251fa8fba6086c9a69b65c5124148be61196670cbf41a525e9614140a2a3b3d3231af12b85276d8cb43f37d6cbf4f6065d8864ab32a4fdc698dacd875dbdc44ccaa8c87ddca5c05a292966808d603d87e466a0a6f7d4e26f85ca30ceeaefc8836cbd6bce3342c83fe4ef1630abfe04a5114ad2eae68a1fca74a376d7a3149d637dcbefcfd5f8f55e3f55effdbbd21e924ebda28cae0ea244321d1dc0284a810894a701327be801d1f1d85faeced86aad314955ad505f47cf1713319022b1d038e0a51b0d48e5a7c549eb2f4bd4681b74f7f90b832ae3c5becded82fba17f58bfee667fee03179226835ca42345e76bfda03b037d586162c33a1071b5ad4c1c5dad84c61fd106431a3642a4c62c324293ae54b9c8cbe39dea5c436af6d9934b4d49fdd715782fa0b3cdfa06cf49a5579279e0daf5bbd75e4e04ea3ac68f12b4fbd126be8aba312e3f9f0c215ec686113f83f3c84f906cf2ca54d8ee9ab042eed9e4c1aad9553a7f936df6e834375a80c7b8f0332b5d8ce94c1d73f568e02a9c23aabddf1a80bfb4cdf1547db7a6074070d510fbe1efc07fcfd570172230000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1513",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 16:16:56 GMT",
                etag: 'W/"5c2cefa1a3b2e6acfc5dc015ca13d79420270682e3e61a7b41a37befbfe9a73c"',
                expires: "Thu, 15 Jan 2026 16:21:56 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "HIT",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "aaf6eb9d98d2168f5854e07518bfaef5a58e8c22",
                "x-frame-options": "deny",
                "x-github-request-id": "58DA:3444A4:BB6F7:1329E7:69690C4F",
                "x-served-by": "cache-lhr-egll1980092-LHR",
                "x-timer": "S1768493816.989550,VS0,VE97",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/findByTags")
            .query({ tags: "blue%2Cblack%2Cbrown" })
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
                date: "Thu, 15 Jan 2026 16:20:24 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/query/form/array.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });

      describe(`object`, function () {
        it(`should handle when queryParams of an exploded object are set`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/query/form/object-exploded.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed5a4d6fdc3610bdfb570c981e1ac0911c3be8c1a73a695c04fd4850c787c2351aae34bbcb441219925a6713e4bf17a4b45a8aa4a4f5667b08601f0caf440e671edfcc1b72fde50880708115158c9c03394b4e9233726c9e66bc14bcc24a2b720e5f8e000088ca9658d2ed03334c22d5f806b5f31080e8b5406390cfde63a6adc5f68d905ca0d40c556f863145352eb85c7bcfc7ac8d5bb46f591e79ead86495c6054acfa81d32e7b2a4ba1df4d333e28df8ea4f21152d717c35a525ab1681a5de67cf2ef95416b1c0dac5c88b0d6c7d23cea79ec1b893be839e0bf88996a2b00372be58302483e6c5926b7e2d8b7033ba35a89474ed2fc13496d10d1c83ee9e506d7c0b369bdc492a041aaa6859e38e486aba387894518a4f917c98e63b117d9aea11b28fd17d92f03ee563c914df4b6737dfd2c32692a63eeff72586d254d723d48827598e2a934c68c62b4b56d4d0180256815e2228cd2506a959d52539871b42579415745620393693abdc2e0144f12227b7aeafdddf8ed744e2c79a491be94d03c9b19bccb7ced010c70e43230447fe42dd32ad5ae407918b08e327b81eb0dc7b2d91e6afab621d6ef6d79198bebf607a5c7d50dda8dd07d57d50dd07d50d977d505df8ee54f70dea0b9b165199f233269a2d6399329625f10c99cc8e09711b95b790818312f75001f6a90071e99b2a03034e8f67e7940886cb0c0be184488cc8c47427717f10074571bcfa4da11c15c783443e9020d3293296243ba6c92e89124d95f164d9215dc28489a7e4d07e8f0be741d23126a0df46a20121dd2159f712d3bde474ac11d85d5407f08d0bebe431f092cbf2db8f82fb9c143cdcaf456e8ed9604c019f5be48517cae15ba7cdaaed8e0fac3b02e1b52838cd31bf64057e3b8e19cf4770dce5507d763a8c586b671cafc1d9252a4517f7333009dc30fd82ed73e29cb18a6eb57c6b3350923d1b463f92d07b81fa551e5f2adca52121d89aa382fdfb01079addbe378d2fed54a230ab25d3eb2bf32d478f4fe4a2d64b2ed967da723d868a60bf610f964d11e94f7671b369b3449aa3f45c3a6add22ac9af3ed17309ae9a615babaa38b054a7883da2da97e4abe5d32054c010565bb28502857ceb4f67302f037af21a315cc599503af3594e6359d993f378b510d374badc5799aaae651c2f8ed8fc1a3c7c025f00a6e98cc92b944ac788e4985fa181eb5a322b35226b3f4710270c92568e378e3f331ac5bdf6a85b6a450c1e003aee19d1298315a3cf980eb77a0396854ba19e1420e735668942af967833e59a1542d444f9393e464f35ca32cd5ebf915ca15cb2cd0a19b764cba9991f14ad3ccbd01ecf6bddb6a822565454b128db4fc796b8ef42858b00c2b85316b1782664b84d3ce590052cbc2f1f1eeee2ea17654c2e5226d6da9f4f7572f5efe79f5f2c96972922c7559108f621bde1bb9b4af06697f73db4db5224a04d54be7fbc154a04e0d839eafdff6cb0759f8b7a4aa2e4b6acf64e49255b9b29c84d91a6ce171b2c4a3f41f75c10c93cd30cb8a1982907cc572cce18ee92564bc2c29281454b67a64725e2570adecb4a7c7e6f7a9fd7d0673c336549a558bc45dd6c88a8ddbd62662a2321eb691b90a44252dd110ac03b0f919e829bcf89c4af0b14619dc5df9196dc2d6bce534cc82f14ef3631abfe04a51148d2e465e2abd6eaa8ba9b1bedde6bbdfffe308fdd7d459b6aacbd9b6426e7f628df8af8734f67c6f63e3fd7654d6ddbb9e567c6f8c36f62e81721412cd7d46b8bf44a212dc64bc2fc5a7272761a7e1f14ad559864acdeb023ae6fb1430b50e2b1de30015a260999d95be579e4676a3063964dffe20716e5c79946efff7206dffe520edeeb0ee8bb51743a3b616a2e103c4b31d007b55ad68c172534460458b3ab8221c5a29ec84827a6c345985e5b85fee45abe189a34dabd36d716f2af486497d4bdd2d046ef3d50ff0e50ae55a2f59b568db8035af9bcec111b64f1a65458b5f78e6358b7d5f1dbd1baeec976eeb116dd102fffbc749dfe085a5b4a9965dbfc3a5dd9351a3b5723a4edfe6eb4d72a81695fee86140c6826d4d197cfd03f220902aec189b1d8fbab0cbf26d9bb7e96c0677d010f5e8ebd17f98ee4f7a3c240000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1536",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 15:48:31 GMT",
                etag: 'W/"ebe06dcb1b7d0b6f7c8111d90cb772340eeb4639af97d34cb2eb1beb97ae9621"',
                expires: "Thu, 15 Jan 2026 15:53:31 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "2f326ccc20371123a5aa4bc561e8a4c9aac96328",
                "x-frame-options": "deny",
                "x-github-request-id": "DE9E:31744B:BC4C1:1339BD:69690C4F",
                "x-served-by": "cache-lhr-egll1980070-LHR",
                "x-timer": "S1768492112.596062,VS0,VE124",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/findByTags")
            .query({ R: "100", G: "200", B: "150" })
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
                date: "Thu, 15 Jan 2026 16:22:10 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/query/form/object-exploded.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`should handle when queryParams of an unexploded object are set`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/query/form/object.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed5a4d6fdc3610bdfb570c981e1ac0911c3be8c1a73a695c04fd4850c787c2351aae34bbcb441219925a6713e4bf17a4b45a8aa4a4f5667b08601f0caf440e671edfcc1b72fde50880708115158c9c03394b4e9233726c9e66bc14bcc24a2b720e5f8e000088ca9658d2ed03334c22d5f806b5f31080e8b5406390cfde63a6adc5f68d905ca0d40c556f863145352eb85c7bcfc7ac8d5bb46f591e79ead86495c6054acfa81d32e7b2a4ba1df4d333e28df8ea4f21152d717c35a525ab1681a5de67cf2ef95416b1c0dac5c88b0d6c7d23cea79ec1b893be839e0bf88996a2b00372be58302483e6c5926b7e2d8b7033ba35a89474ed2fc13496d10d1c83ee9e506d7c0b369bdc492a041aaa6859e38e486aba387894518a4f917c98e63b117d9aea11b28fd17d92f03ee563c914df4b6737dfd2c32692a63eeff72586d254d723d48827598e2a934c68c62b4b56d4d0180256815e2228cd2506a959d52539871b42579415745620393693abdc2e0144f12227b7aeafdddf8ed744e2c79a491be94d03c9b19bccb7ced010c70e43230447fe42dd32ad5ae407918b08e327b81eb0dc7b2d91e6afab621d6ef6d79198bebf607a5c7d50dda8dd07d57d50dd07d50d977d505df8ee54f70dea0b9b165199f233269a2d6399329625f10c99cc8e09711b95b790818312f75001f6a90071e99b2a03034e8f67e7940886cb0c0be184488cc8c47427717f10074571bcfa4da11c15c783443e9020d3293296243ba6c92e89124d95f164d9215dc28489a7e4d07e8f0be741d23126a0df46a20121dd2159f712d3bde474ac11d85d5407f08d0bebe431f092cbf2db8f82fb9c143cdcaf456e8ed9604c019f5be48517cae15ba7cdaaed8e0fac3b02e1b52838cd31bf64057e3b8e19cf4770dce5507d763a8c586b671cafc1d9252a4517f7333009dc30fd82ed73e29cb18a6eb57c6b3350923d1b463f92d07b81fa551e5f2adca52121d89aa382fdfb01079addbe378d2fed54a230ab25d3eb2bf32d478f4fe4a2d64b2ed967da723d868a60bf610f964d11e94f7671b369b3449aa3f45c3a6add22ac9af3ed17309ae9a615babaa38b054a7883da2da97e4abe5d32054c010565bb28502857ceb4f67302f037af21a315cc599503af3594e6359d993f378b510d374badc5799aaae651c2f8ed8fc1a3c7c025f00a6e98cc92b944ac788e4985fa181eb5a322b35226b3f4710270c92568e378e3f331ac5bdf6a85b6a450c1e003aee19d1298315a3cf980eb77a0396854ba19e1420e735668942af967833e59a1542d444f9393e464f35ca32cd5ebf915ca15cb2cd0a19b764cba9991f14ad3ccbd01ecf6bddb6a822565454b128db4fc796b8ef42858b00c2b85316b1782664b84d3ce590052cbc2f1f1eeee2ea17654c2e5226d6da9f4f7572f5efe79f5f2c96972922c7559108f621bde1bb9b4af06697f73db4db5224a04d54be7fbc154a04e0d839eafdff6cb0759f8b7a4aa2e4b6acf64e49255b9b29c84d91a6ce171b2c4a3f41f75c10c93cd30cb8a1982907cc572cce18ee92564bc2c29281454b67a64725e2570adecb4a7c7e6f7a9fd7d0673c336549a558bc45dd6c88a8ddbd62662a2321eb691b90a44252dd110ac03b0f919e829bcf89c4af0b14619dc5df9196dc2d6bce534cc82f14ef3631abfe04a51148d2ece69a1fcb74aaf9bf2628aac6fb8f9f2f7ff3843ff357598adea72b62d91db9f5827feeb218d3ddfdbd878c31dd575f7b2a755df1b238ebd5ba01c854473a1116e3091a8043729ef6bf1e9c949d86a78c4527596a152f3ba808efa3e054cb1c34ac738408528586667a5ef952792dda8410ed9b73f489c1b571ea5db7f3e48dbff3948bb4bacfb62edc5d0c8ad8568f804f16c07c05e552b5ab0dc541158d1a20eee0887560a5ba1a0201b5156613deed77bd18a78e288d3ea745bdd9b12bd6152df52770d81db7cf5037cb942b9d64b562dda3e60cdeba6757094ed934659d1e2179e79dd62df5747f0864bfba5db7b447bb4c0fffe79d2377861296dca65d7f07069f764d468ad9c96d3b7f97a931caa45a53f7a1890b1605b53065fff843c08a40a5bc666c7a32eecb27cdbe76d5a9bc11d34443dfa7af41f87ca812d3d240000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1539",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 15:48:32 GMT",
                etag: 'W/"41c07848f9f4b34b57177b87fb4d51801d51c492af51f1b48e3c1584dc48d04a"',
                expires: "Thu, 15 Jan 2026 15:53:32 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "f0ba93b4abd1849b8c0d3792cf8e7907c40558a6",
                "x-frame-options": "deny",
                "x-github-request-id": "2CA0:3684CE:BBCC9:132FF6:69690C4F",
                "x-served-by": "cache-lhr-egll1980070-LHR",
                "x-timer": "S1768492112.938249,VS0,VE120",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/findByTags")
            .query({ tags: "R%2C100%2CG%2C200%2CB%2C150" })
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
                date: "Thu, 15 Jan 2026 16:23:05 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/query/form/object.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });

      describe(`primitive`, function () {
        it(`should handle when queryParams of an exploded primitive are set`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/query/form/primitive-exploded.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed594d6fdc3610bdfb570c981e1ac0911c3be8c1a7baa90d04fd4800c787c2351aae34ab6522890c49ada304f9ef0529ed2e4552d2fae312c03e18b6440e671edfcc1b52df0e0008175853c1c8299093e428392187e669c62bc16bacb522a7f0ed000080a86c8515dd3d30c324528def503b0f01886e051a837cf111336d2df66f84e402a566a806338c29aab1e0b2f59e4f599bb668dfb23cf2d4b1c96a8d054acfa81db2e4b2a2ba1ff4cb2be28df8ee4f2135ad707a35a525ab8bc0d2e07fcf2ef95295b1c0fac5c8eb0d6c4323ce7f038371277d073d17f00bad446907e4bc28189251f362c535bf9265b819db35a894b4f597601aabe8064e417747a836be059b4d6e2515020d55b46c704f24352d1e3dca28c5e7483e4ef3bd883e4ff508d9a7e83e4b789ff2b1648aefa5b39befe9e32692a63eefef4b0ca5a96e26a8114fb21c552699d08cd796aca8a13304ac06bd42509a4b0c52b36e2a720ad784ae292be9a244726826d7b95d0288e2654e6e5c5fb77f3b5e13899f1b266da4d71d24876e32df3843431cb7181a2138f017da2ed3ab45fe28721161fc0cd703967baf25d2fc6d5db6e1667f9f88e9c70b66c0d527d58dda7d52dd27d57d52dd70d927d5851f4e75dfa13eb3691195293f63a2d9329529535912cf90d9ec9811b749790b19382a714f15e03e15202e7d736560c4e9e9ec9c13c1709971219c1189099998ef24ee0ee2a8284e57bf3994a3e2f828918f24c87c8a4c25c99e69b24fa24453653a59f648973061e22939b6dfd3c2f928e91813d08791684448f748d67b89e9bde474aa11d85f5447f08d0bebec31f082cbeae147c1fb9c143cdcaf446e8ed9604c015f5ae48517cae3b74e9b55fb1d1f597702c22b51729a637ec14a7c388e19cf2770dce7507d723c8e586f671aafd1d9152a458bbb1998056e9c7ec1f639712e584d775abeb31928c93d1b463f92d07b81fa4d1e5f2adca53121d899a382fdf709479adda1379d2ffd54a2306b24d3eda5f9ca31e013396bf48a4bf695f65c8fa122d81f388065534486935ddc6cdaac90e6283d970e7ab708ab977cf7014633ddb54297b7b42850c23bd46e49f553f2fd8a29600a2828db458142b976a6f5ff2700fff006325ac392d539f04643655ed385f973b318d570bdd25a9ca6a9ea1e258cdffc1c3c7a0e5c02afe19ac92c594ac49ae798d4a80fe1593f2a322b65324b9f2700175c82368e773e1f42dbfbd628b425850a069fb0850f4a60c668f9e213b61f4073d0a87437c2851c96acd42855f2ef067db246a97a885e2647c9d1e6b94659a9b7cb4b946b9659a04337ed98743323e3b5a6997b03b8ddf7ed5613ac282b7b9268a4d5af3b736440c19265582b8c593b13345b211c6f9d05208d2c1d1f6f6f6f136a47255c16696f4ba57fbe797dfef7e5f98be3e42859e9aa241ec536bc3772695f8dd2fefa663bd58a281154af9cef83a9409d1a06fdd6be1f960f52f8b7a4aaa92a6acf64e482d5b9b29c84450bb6f03859e251faafa66486c9669865c5024148be6639e670cbf40a325e5514140a2a7b3d3239af12b85276dacb43f3fbd8fe3e81a5611b2acdea22719735b262e3b6b58998a88c877d64ae0251492b3404db02d8fd8cf4145e7c4e25f8dca00ceeaefc8c36616bde731a16c178a7f9318d5f70a528ca4e17232f956ebbea626aac6fb7fbf67be7abc2a882b9d71abdce5c1b1918dc77e428249aa37b180a91a80437e4f655e7f8e82814550f42d564192ab56c4ad86eb21fad496bac752c5c2a44c9323b2bfda83c399887cbbefd49e2d2b8f22cdd7d664ffbafebe9f6ba66feb430d9c677c262211aef955fed01d89b7a4d4b969b7c81352d9be0366c6ca550f483d263e44785956758d9442f57895386d7c7bb3ad615a30d938696b6076edcf58d7e80e76b94ad5eb1bae815afe54d27924e0dffa251d6b4fc9d675e5f34f4d529ede345ecc255d9683712f83f3c39f906cf2ca54d61d84a3b97764f268d36ca69ae7c9b6f37c9a17a5486a3c701990ab63765f0f5cf82a340aab039ea763ceac23ecbf71dcd46c44777d010f5e0fbc1ff7218e6ed27230000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1504",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 15:48:32 GMT",
                etag: 'W/"df59f56897bcadc9b8c573be710e5236b31cf48ae5624e2694ef9f019ecf209c"',
                expires: "Thu, 15 Jan 2026 15:53:32 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "c47d9b25b222634ddc01a4015bdeb0f5db6b6267",
                "x-frame-options": "deny",
                "x-github-request-id": "42B9:3BDE4F:C1A66:138F58:69690C4F",
                "x-served-by": "cache-lhr-egll1980070-LHR",
                "x-timer": "S1768492112.278733,VS0,VE128",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/findByTags")
            .query({ tags: "blue" })
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
                date: "Thu, 15 Jan 2026 16:24:41 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/query/form/primitive-exploded.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });

        it(`should handle when queryParams of an unexploded primitive is set`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/query/form/primitive.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed594d6fdc3610bdfb570c981e1ac0911c3be8c1a7baa90d04fd4800c787c2351aae34ab6522890c49ada304f9ef0529ed2e4552d2fae312c03e18b6440e671edfcc1b52df0e0008175853c1c8299093e428392187e669c62bc16bacb522a7f0ed000080a86c8515dd3d30c324528def503b0f01886e051a837cf111336d2df66f84e402a566a806338c29aab1e0b2f59e4f599bb668dfb23cf2d4b1c96a8d054acfa81db2e4b2a2ba1ff4cb2be28df8ee4f2135ad707a35a525ab8bc0d2e07fcf2ef95295b1c0fac5c8eb0d6c4323ce7f038371277d073d17f00bad446907e4bc28189251f362c535bf9265b819db35a894b4f597601aabe8064e417747a836be059b4d6e2515020d55b46c704f24352d1e3dca28c5e7483e4ef3bd883e4ff508d9a7e83e4b789ff2b1648aefa5b39befe9e32692a63eefef4b0ca5a96e26a8114fb21c552699d08cd796aca8a13304ac06bd42509a4b0c52b36e2a720ad784ae292be9a244726826d7b95d0288e2654e6e5c5fb77f3b5e13899f1b266da4d71d24876e32df3843431cb7181a2138f017da2ed3ab45fe28721161fc0cd703967baf25d2fc6d5db6e1667f9f88e9c70b66c0d527d58dda7d52dd27d57d52dd70d927d5851f4e75dfa13eb3691195293f63a2d9329529535912cf90d9ec9811b749790b19382a714f15e03e15202e7d736560c4e9e9ec9c13c1709971219c1189099998ef24ee0ee2a8284e57bf3994a3e2f828918f24c87c8a4c25c99e69b24fa24453653a59f648973061e22939b6dfd3c2f928e91813d08791684448f748d67b89e9bde474aa11d85f5447f08d0bebec31f082cbeae147c1fb9c143cdcaf446e8ed9604c015f5ae48517cae3b74e9b55fb1d1f597702c22b51729a637ec14a7c388e19cf2770dce7507d723c8e586f671aafd1d9152a458bbb1998056e9c7ec1f639712e584d775abeb31928c93d1b463f92d07b81fa4d1e5f2adca53121d899a382fdf709479adda1379d2ffd54a2306b24d3eda5f9ca31e013396bf48a4bf695f65c8fa122d81f388065534486935ddc6cdaac90e6283d970e7ab708ab977cf7014633ddb54297b7b42850c23bd46e49f553f2fd8a29600a2828db458142b976a6f5ff2700fff006325ac392d539f04643655ed385f973b318d570bdd25a9ca6a9ea1e258cdffc1c3c7a0e5c02afe19ac92c594ac49ae798d4a80fe1593f2a322b65324b9f2700175c82368e773e1f42dbfbd628b425850a069fb0850f4a60c668f9e213b61f4073d0a87437c2851c96acd42855f2ef067db246a97a885e2647c9d1e6b94659a9b7cb4b946b9659a04337ed98743323e3b5a6997b03b8ddf7ed5613ac282b7b9268a4d5af3b736440c19265582b8c593b13345b211c6f9d05208d2c1d1f6f6f6f136a47255c16696f4ba57fbe797dfef7e5f98be3e42859e9aa241ec536bc3772695f8dd2fefa663bd58a281154af9cef83a9409d1a06fdd6be1f960f52f8b7a4aaa92a6acf64e482d5b9b29c84450bb6f03859e251faafa66486c9669865c5024148be6639e670cbf40a325e5514140a2a7b3d3239af12b85276dacb43f3fbd8fe3e81a5611b2acdea22719735b262e3b6b58998a88c877d64ae0251492b3404db02d8fd8cf4145e7c4e25f8dca00ceeaefc8c36616bde731a16c178a7f9318d5f70a528ca4e1797b454fe5ba5dbaebc9822eb1bee3efedef9ae302a61eebd462f34d7460706171e390a89e6ec1ec642242ac10dbb7dd9393e3a0a55d5c3503559864a2d9b12b6bbec476bf21a6b1d0b970a51b2ccce4a3f2a4f0fe6e1b26f7f92b834ae3c4b77dfd9d3fef37ababdaf993f2e4cf6f19db25888c69be5577b00f6a65ed392e52661604dcb26b80e1b5b2954fda0f618fd5161e9199636d1eb55e2d4e1f5f1ae9075d568c3a4a1a5ed891b778da31fe0f91a65ab57ac2e7ac96b79d3a9a453c4bf6894352d7fe799d7180d7d756afb7815bb706536da8e04fe0f8f4ebec1334b695319b6dacea5dd9349a38d72ba2bdfe6db4d72a81e95e1e87140a682ed4d197cfdc3e028902aec8eba1d8fbab0cff27d4bb351f1d11d34443df87ef03f029371b428230000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1507",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 15:48:32 GMT",
                etag: 'W/"0322f95f3aa8cf09e195e08c1ac28228ad0ee9ac6ba2ff8158b07c823c5a9dc5"',
                expires: "Thu, 15 Jan 2026 15:53:32 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "8744a0bcb482fd42f763f3bf8cf7ec028bfbb317",
                "x-frame-options": "deny",
                "x-github-request-id": "2CA0:3684CE:BBCEC:133027:69690C50",
                "x-served-by": "cache-lhr-egll1980070-LHR",
                "x-timer": "S1768492113.631508,VS0,VE130",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/findByTags")
            .query({ tags: "blue" })
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
                date: "Thu, 15 Jan 2026 16:25:25 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/query/form/primitive.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });
    });

    describe(`pipeDelimited`, function () {
      describe(`array`, function () {
        it(`should handle when queryParams of an unexploded array are set`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/query/pipeDelimited/array.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed594d6fdb3810bde7570cd83d6c81544a93620f396db66d80623f5a20cd61910db6b434b6d94a224b524ed5a2ff7d414a962992929c0f2c50203e1836450e878f6fe60da96f0700840baca860e414c84972949c9043d39af152f00a2badc8297c3b0000202a5b6349770da69b44aaf11d6aa71180e846a031c8171f31d3d662f744482e506a866a30c298a21a575c365efb94b5698bf629cb23ad8e4d56695ca1f48cda2e4b2e4baabb4ebfbc205e8feffe1052d112a767535ab26a15581afcf7ec922f65115b58371979b9856d68c4f937301877d277d07301bfd05214b643ce572b8664d4bc5873cd2f65116e463f07959236fe144c6319ddc029e86e09d5d6b760b3c98da442a0a18a9635ee89a4a6ab075f6594e273241fa7f95e449fa77a84ec53749f25bc4ff95830c5f7d2d9cdf7f4610349539ff7772586d254d713d48807598e2a934c68c62b4b56d4d01a0256815e2328cd2506a159d52539852b42379415745120393483abdc4e0144f12227d7aeaffd6fc76b22f173cda45de9550bc9a11bccd74ed710c71e43230407fe44fd349d5ae40f221711c6cf703d60b9f75822cddf5645136ef6f78935fd788b1970f55175a3761f55f751751f55379cf65175e18753dd77a8cf6c584465ca8f9868b44c45ca5494c42364363a66c46d52de42068e4adc6306b84b06884bdf5c1a18717a3a3ae744309c665c086744624226e62b89db83382a8ad3d96f0ee5a8383ec8ca4702643e44a68264cf30d92750a2a1321d2c7b844b1830f1901cdbef69e17c90708c09e8fd483422a47b04eb9dc4f44e723a5508ec2faa23f8c68575f61878ce6579ffa3e05d4e0a1eee972237c76c30a6802f2df2c25bcac3974edb59bb1d1f997702c24b51709a637ece0abc3f8e19cf2770dce7507d723c8e5867671aafd1d1252a4557b733300bdc38fd82ed73d6b96015dd69f9ce66a024772c18fd9584de0bd46ff2f854e12e8d09c1ce1c15ecdf4f3852ec0ebd697de9861285592d996e2ecc5b8e019fc859add75cb2afb4e37a0c15c17ec7012cdb24321cece266c3668d3447e9b974d0b94558b5e4bb17309ae9b614bab8a1ab154a7887da4da97e48be5f33054c010565ab28502837ceb0ee7f02f037af21a3152c599503af3594e6315d989fdbc9a886abb5d6e2344d55db94307efd73d0f414b8045ec1159359b2948815cf31a9501fc293ae576454ca64963e4d00ceb9046d1c6f7d3e84a6f3ad5668530a150c3e61031f94c08cd1e2d9276c3e80e6a051e9b6870b392c59a151aae49f2dfa64835275103d4f8e92a36dbb4659aab7cb0b941b9659a043376d9f743b22e395a6997b03d8ef7bbfd5044bca8a8e241a69f9ebce1c1950b06019560a63d6ce04cdd608c7bdb300a49685e3e3cdcd4d426daf84cb55dad952e91f6f5ebefeebe2f5b3e3e42859ebb2201ec5b6bc3772691f8dd2feeaba1f6a459408aad7cefbc154a04e0d837e6bde0fd30759f9b7a4aa2e4b6acf64e49c55b9b29c84450336f13851e251facfba6086c9a69b65c5024148be6139e670c3f41a325e9614140a2a3b3d3231af12b85476d8f343f37d6cbf4f6069d8864ab36a95b8d31a59b1ebb6b9899855190fbb95b90a44252dd110ac07b0fd8cd414defa9c4cf0b94619dc5df9116d96ad79c7695804fd9de2c7147ec195a2285a5d5cd242f94f956edaf42298c05758b09269ccfd19dab7c0ffebf96abcf0eb7fbb57259d765d196919dca1e428249aeb80101e2251096e02c657b2e3a3a350a8bd6d517596a152cbba809e383e6e265560a563c051210a96d951e947e5494cdf6b1478fbf427894be3ca9374f7ea3eedded8a7fd15d0fc0964f268d08a958568bcfe7eb107606faa0d2d586e621036b4a8831bb6b199c24222486746d25498cd86d95274129838a97d73bccb8d6d82db326968a93fc4e3ae16f517f87a83b2d16b56ad3a156d78dd0aafa30b5f34ca8a16af78e6d55a435f1db9184f8ce7ae72472b9cc0ffe169cc377866296d924d5f2e7069f764d268ad9c82cdb7f9761b1caa4365d87b1c90a9c576a60cbefef972144815165ced8e475dd867faae4ada1606a33b68887af0fde03ff31e12487b230000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1520",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 15:48:33 GMT",
                etag: 'W/"14d66d64c03d4d324d79fab056a4f273d9e4c99fb3d70819936fef92d446cc4e"',
                expires: "Thu, 15 Jan 2026 15:53:33 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "63d7cd27ba852a54989a273cf5b8e9c288035c92",
                "x-frame-options": "deny",
                "x-github-request-id": "B9D8:A5C99:BE3FA:135925:69690C50",
                "x-served-by": "cache-lhr-egll1980070-LHR",
                "x-timer": "S1768492113.359843,VS0,VE126",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/findByTags")
            .query({ tags: "blue%7Cblack%7Cbrown" })
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
                date: "Thu, 15 Jan 2026 16:33:35 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/query/pipeDelimited/array.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });

      describe(`object`, function () {
        it(`should handle when queryParams of an unexploded object are set`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/query/pipeDelimited/object.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed5a4d6fdc3610bdfb570c981e1ac0d13a76d0834f753e5c04fd4850c787c2351aae34bbcb441219925a470df2df0b525a2d4552d27ab33d04b00f8657226786c3f7e60db9fe720440b8c0920a46ce819c2527c91939364f535e085e62a91539872f47000044a52b2ce8f6811926916a7c8bda790840742dd018e4f30f986a6bb17d232417283543d59b614c518d4b2e6beff998b5718bf62dcb224f1d9bacd4b844e919b543165c1654b7837e7a46bc115ffd29a4a4058e7b535ab2721958ea7df6ec92cf451e5b58eb8cbcd8a4ad6fc4f9d433180fd20fd00b013fd342e47640c6974b8664d0bc5871cdaf651e6e46e7834a496bdf05d3584437702c75f74cd526b660b3c99da442a0818a9615ee98494d97075f6514e253201f86f94e409f867a04ec63709f04bc0ff91899e27be9ece63b7a582269eae37e5f60284d7535028d38c93254a96442335e5ab0a286c610b012f40a41692e31a0665915e41c6e085d5396d3798ee4d84c2e33eb0288e279466edd58bbbf9da889c44f159376a5374d4a8e5d32df3a43c33c7639344270e43beadcb46a911d442e22889fc07a8072efb5449abd29f33adcecaf236bfafe16d3c3ea83ea46ed3ea8ee83ea3ea86ee8f64175e1bb53ddb7a82f2c2da232e53326ca9631a68cb124ce9049764c88dba8bc85081c94b8870ab04f05884bdf541918087a9c9d532218ba1916c20991189189e94ee2fe491c14c5f1ea3795e5a8381e64e5030499a6c8184976a4c92e448952659c2c3bd025244c9c9243fb3d2e9c07a1634c40bf0d440342ba0359f712d3bde474ac11d85d5407f21b17d6c963e02597c5b71f05f739297879bf169939668331057c61332fbca51cbe75da786d777cc0ef480aaf45ce6986d925cbf1dbf398f26c248fbb1caacf4e8733d6da19cfd7e0ec0295a2cbfb19984cdc30fc82ed73d6396725dd6af9d666a0247b368cfe4ac2e805ead759dc55b84b4342b0354705fbe7230e34bbfd689a58daa944615a49a6eb2bf32d470f4fe4a2d22b2ed9bfb4c57a2c2b82fd8abdb46c8a487fb29b374b9b15d20ca517d2511b1661e5826fbf80d14c37add0d51d5d2e51c25bd46e49f529f96ec51430051494eda240a15c3bd3dacf09c05fbc829496b0606506bcd25098d7746efedc38a31a6e565a8bf3d94c358f12c66f7f0c1e3d062e819770c3649a2c2462c9334c4ad4c7f0a81d15993563329d3d4e002eb9046d026f623e86ba8dad52684b0a150c3e620def95c094d1fcc947acdf83e6a051e966849b7258b05ca354c9df9bec93354ad5a6e86972929c6c9e6b94857ab3b842b966a94d7418a61d33dbcc4879a969eade0076fbde6d35c182b2bc0589465afcbc35477a10cc598aa5c298b50b41d315c269172c00a964eec478777797503b2ae172396b6da9d96faf5fbcfae3ead593d3e42459e922271ec436b83772695f0dc2fee6b69b6a459408aa57cef78333817a6610f4bc7ed72f1f64e9df92aaaa28a83d93914b5666ca6212e635d8c2e3b0c483f4ef55ce0c92cd308b8a3982907ccd32cce08ee915a4bc2828281454b67a6438af12b85676dad363f3fbd4fe3e8385411b2acdca65e2ba35b262d76d6b1331ab3211b62b7315884a5aa0015897c0e667a0a7f0d6e754824f15cae0eeca67b459b6e62da6611e8c779a1fd3f805578a226f74714173e5bf55ba6eca8b60025f62ce0aa631f33d34df02ff1f87e93fa74eb56555ccb7b572fb136bc97f39a4b1e77b1b1befbca302efdefab4327c6354b2771d94a190686e36c29d261295e086fbbe289f9e9c843d87873055a5292ab5a872e838e043c0543d2c750c0354889ca576d6ec83f2d4b21b358821fbf607890b13caa3d9f6bf1066ed3f1fccbadbacfbe6da5b43a3bb3645c34789673b24ec75b9a639cb4c398135cdabe0b270c853d8130595d9a8b30a0b73bff08b56cd1347a5d6a7db32dfd4ea0d92fa96bafb08dcf2d55fe0ab35ca5aaf58b96c1b829a574d0fe148dc678db2a4f94b9e7a6d633f5647f9866bfca5db84449bb520fefec1d2377861216dea66d7f97069f764d468a59cded3b7f966430ed566a53f7a3821638b6d4d99fcfa47e5c144aab0776c763c1ac22eeedb866fd3e30ceea001ead1d7a3ff00c632762046240000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1546",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 15:48:34 GMT",
                etag: 'W/"fab5b1f7a97a29b143e5fbcc6f1705e5dbf8a73e36a20711ad9bc3e31cec30d8"',
                expires: "Thu, 15 Jan 2026 15:53:34 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "34bd45ad48bcf33368da4b2b0be484e786c2eb38",
                "x-frame-options": "deny",
                "x-github-request-id": "D0FF:A051C:B7A9F:12EC8B:69690C50",
                "x-served-by": "cache-lhr-egll1980070-LHR",
                "x-timer": "S1768492114.057413,VS0,VE129",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/findByTags")
            .query({ tags: "R%7C100%7CG%7C200%7CB%7C150" })
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
                date: "Thu, 15 Jan 2026 16:35:38 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/query/pipeDelimited/object.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });
    });

    describe(`spaceDelimited`, function () {
      describe(`array`, function () {
        it(`should handle when queryParams of an unexploded array are set`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/query/spaceDelimited/array.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed594d6fdb3810bde7570cd83d6c81544a93620f396db66d80623f5a20cd61910db6b434b6d94a224b524ed5a2ff7d414a962992929c0f2c50203e1836450e878f6fe60da96f0700840baca860e414c84972949c9043d39af152f00a2badc8297c3b0000202a5b6349770da69b44aaf11d6aa71180e846a031c8171f31d3d662f744482e506a866a30c298a21a575c365efb94b5698bf629cb23ad8e4d56695ca1f48cda2e4b2e4baabb4ebfbc205e8feffe1052d112a767535ab26a15581afcf7ec922f65115b58371979b9856d68c4f937301877d277d07301bfd05214b643ce572b8664d4bc5873cd2f65116e463f07959236fe144c6319ddc029e86e09d5d6b760b3c98da442a0a18a9635ee89a4a6ab075f6594e273241fa7f95e449fa77a84ec53749f25bc4ff95830c5f7d2d9cdf7f4610349539ff7772586d254d713d48807598e2a934c68c62b4b56d4d01a0256815e2328cd2506a159d52539852b42379415745120393483abdc4e0144f12227d7aeaffd6fc76b22f173cda45de9550bc9a11bccd74ed710c71e43230407fe44fd349d5ae40f221711c6cf703d60b9f75822cddf5645136ef6f78935fd788b1970f55175a3761f55f751751f55379cf65175e18753dd77a8cf6c584465ca8f9868b44c45ca5494c42364363a66c46d52de42068e4adc6306b84b06884bdf5c1a18717a3a3ae744309c665c086744624226e62b89db83382a8ad3d96f0ee5a8383ec8ca4702643e44a68264cf30d92750a2a1321d2c7b844b1830f1901cdbef69e17c90708c09e8fd483422a47b04eb9dc4f44e723a5508ec2faa23f8c68575f61878ce6579ffa3e05d4e0a1eee972237c76c30a6802f2df2c25bcac3974edb59bb1d1f997702c24b51709a637ece0abc3f8e19cf2770dce7507d723c8e5867671aafd1d1252a4557b733300bdc38fd82ed73d6b96015dd69f9ce66a024772c18fd9584de0bd46ff2f854e12e8d09c1ce1c15ecdf4f3852ec0ebd697de9861285592d996e2ecc5b8e019fc859add75cb2afb4e37a0c15c17ec7012cdb24321cece266c3668d3447e9b974d0b94558b5e4bb17309ae9b614bab8a1ab154a7887da4da97e48be5f33054c010565ab28502837ceb0ee7f02f037af21a3152c599503af3594e6315d989fdbc9a886abb5d6e2344d55db94307efd73d0f414b8045ec1159359b2948815cf31a9501fc293ae576454ca64963e4d00ceb9046d1c6f7d3e84a6f3ad5668530a150c3e61031f94c08cd1e2d9276c3e80e6a051e9b6870b392c59a151aae49f2dfa64835275103d4f8e92a36dbb4659aab7cb0b941b9659a043376d9f743b22e395a6997b03d8ef7bbfd5044bca8a8e241a69f9ebce1c1950b06019560a63d6ce04cdd608c7bdb300a49685e3e3cdcd4d426daf84cb55dad952e91f6f5ebefeebe2f5b3e3e42859ebb2201ec5b6bc3772691f8dd2feeaba1f6a459408aad7cefbc154a04e0d837e6bde0fd30759f9b7a4aa2e4b6acf64e49c55b9b29c84450336f13851e251facfba6086c9a69b65c5024148be6139e670c3f41a325e9614140a2a3b3d3231af12b85476d8f343f37d6cbf4f6069d8864ab36a95b8d31a59b1ebb6b9899855190fbb95b90a44252dd110ac07b0fd8cd414defa9c4cf0b94619dc5df9116d96ad79c7695804fd9de2c7147ec195a2285a5d5cd242f94f956edaf4a204cdf01516ac641a737f8af635f0ff7ac01aaffcfadfee5d49275e57465b069728390a89e63e20c4874854829b88f1a5ecf8e828546a6f5f549d65a8d4b22ea0678e8f9bc91558e91870548882657654fa51791ad3f71a05de3efd49e2d2b8f224ddbdbb4fbb57f6697f07347f04993c1bb46a65211a2fc05fec01d89b6a430b969b20840d2deae08a6d6ca6b09208f299d13415a6b361ba149d06264e6edf1cef92639be1b64c1a5aea4ff1b82b46fd05bedea06cf49a55ab4e461b5eb7caeb08c3178db2a2c52b9e79c5d6d057472fc633e3b92bddd11227f07f781cf30d9e594a9b6cd3d70b5cda3d99345a2ba762f36dbedd0687ea5019f61e07646ab19d2983af7fc01c0552851557bbe35117f699be2b93b695c1e80e1aa21e7c3ff80f2f0eaf9f7c230000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1521",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 16:42:04 GMT",
                etag: 'W/"c97298323accc71e174eedff28a4bc164bb1743758fddfa5791d881f58eb4431"',
                expires: "Thu, 15 Jan 2026 16:47:04 GMT",
                "source-age": "189",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "HIT",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "904a7b948ddc1b1b52cdc3a89673087b13df5ada",
                "x-frame-options": "deny",
                "x-github-request-id": "9465:35E8B5:DF59E:168A21:6969181F",
                "x-served-by": "cache-lhr-egll1980093-LHR",
                "x-timer": "S1768495325.785052,VS0,VE1",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/findByTags")
            .query({ tags: "blue%20black%20brown" })
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
                date: "Thu, 15 Jan 2026 16:38:56 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/query/spaceDelimited/array.json",
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

      describe(`object`, function () {
        it(`should handle when queryParams of an unexploded object are set`, async function () {
          nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
          })
            .get(
              "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/parameter-styles/query/spaceDelimited/object.json",
            )
            .reply(
              200,
              [
                "1f8b0800000000000013ed5a4d6fdc3610bdfb570c981e1ac0d13a76d0834f753e5c04fd4850c787c2351aae34bbcb441219925a470df2df0b525a2d4552d27ab33d04b00f8657226786c3f7e60db9fe720440b8c0920a46ce819c2527c91939364f535e085e62a91539872f47000044a52b2ce8f6811926916a7c8bda790840742dd018e4f30f986a6bb17d232417283543d59b614c518d4b2e6beff998b5718bf62dcb224f1d9bacd4b844e919b543165c1654b7837e7a46bc115ffd29a4a4058e7b535ab2721958ea7df6ec92cf451e5b58eb8cbcd8a4ad6fc4f9d433180fd20fd00b013fd342e47640c6974b8664d0bc5871cdaf651e6e46e7834a496bdf05d3584437702c75f74cd526b660b3c99da442a0818a9615ee98494d97075f6514e253201f86f94e409f867a04ec63709f04bc0ff91899e27be9ece63b7a582269eae37e5f60284d7535028d38c93254a96442335e5ab0a286c610b012f40a41692e31a0665915e41c6e085d5396d3798ee4d84c2e33eb0288e279466edd58bbbf9da889c44f159376a5374d4a8e5d32df3a43c33c7639344270e43beadcb46a911d442e22889fc07a8072efb5449abd29f33adcecaf236bfafe16d3c3ea83ea46ed3ea8ee83ea3ea86ee8f64175e1bb53ddb7a82f2c2da232e53326ca9631a68cb124ce9049764c88dba8bc85081c94b8870ab04f05884bdf541918087a9c9d532218ba1916c20991189189e94ee2fe491c14c5f1ea3795e5a8381e64e5030499a6c8184976a4c92e448952659c2c3bd025244c9c9243fb3d2e9c07a1634c40bf0d440342ba0359f712d3bde474ac11d85d5407f21b17d6c963e02597c5b71f05f739297879bf169939668331057c61332fbca51cbe75da786d777cc0ef480aaf45ce6986d925cbf1dbf398f26c248fbb1caacf4e8733d6da19cfd7e0ec0295a2cbfb19984cdc30fc82ed73d6396725dd6af9d666a0247b368cfe4ac2e805ead759dc55b84b4342b0354705fbe7230e34bbfd689a58daa944615a49a6eb2bf32d470f4fe4a2d22b2ed9bfb4c57a2c2b82fd8abdb46c8a487fb29b374b9b15d20ca517d2511b1661e5826fbf80d14c37add0d51d5d2e51c25bd46e49f529f96ec51430051494eda240a15c3bd3dacf09c05fbc829496b0606506bcd25098d7746efedc38a31a6e565a8bf3d94c358f12c66f7f0c1e3d062e819770c3649a2c2462c9334c4ad4c7f0a81d15993563329d3d4e002eb9046d026f623e86ba8dad52684b0a150c3e620def95c094d1fcc947acdf83e6a051e966849b7258b05ca354c9df9bec93354ad5a6e86972929c6c9e6b94857ab3b842b966a94d7418a61d33dbcc4879a969eade0076fbde6d35c182b2bc0589465afcbc35477a10cc598aa5c298b50b41d315c269172c00a964eec478777797503b2ae172396b6da9d96faf5fbcfae3ead593d3e42459e922271ec436b83772695f0dc2fee6b69b6a459408aa57cef78333817a6610f4bc7ed72f1f64e9df92aaaa28a83d93914b5666ca6212e635d8c2e3b0c483f4ef55ce0c92cd308b8a3982907ccd32cce08ee915a4bc2828281454b67a6438af12b85676dad363f3fbd4fe3e8385411b2acdca65e2ba35b262d76d6b1331ab3211b62b7315884a5aa0015897c0e667a0a7f0d6e754824f15cae0eeca67b459b6e62da6611e8c779a1fd3f805578a226f74714173e5bf55ba6eca8b1234c59798b38269cc7c17cdd7c0ffc769facfa9636d5915f36db1dcfec47af25f0e69ecf9dec6c65befa8c2bbd73ead0edf1899ecdd076528249aab8d70ab894425b821bfafcaa7272761d3e1414c55698a4a2daa1c3a12f81030650f4b1dc300152267a99d35fba03cb9ec460d62c8befd41e2c284f268b6fd378459fbdf07b3ee3aebbeb9f6d6d008af4dd1f059e2d90e097b5dae69ce32534f604df32ab82d1cf2143645416936f2acc2cadcaffca295f3c491a9f5e9b6ce37c57a83a4bea5ee4202b77cf517f86a8db2d62b562edb8ea0e655d344381af759a32c69fe92a75edfd88fd591bee1227fe97621d16e2d88bf7fb2f40d5e58489bc2d9b53e5cda3d19355a29a7f9f46dbed99043b559e98f1e4ec8d8625b5326bffe597930912a6c1e9b1d8f86b08bfbb6e3db3439833b68807af4f5e83f8e2ce9d847240000",
              ],
              {
                "accept-ranges": "bytes",
                "access-control-allow-origin": "*",
                "cache-control": "max-age=300",
                connection: "keep-alive",
                "content-encoding": "gzip",
                "content-length": "1546",
                "content-security-policy":
                  "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                "content-type": "text/plain; charset=utf-8",
                "cross-origin-resource-policy": "cross-origin",
                date: "Thu, 15 Jan 2026 15:48:35 GMT",
                etag: 'W/"da647f36ebeed54ba3edb5b1bdee0807df3da5649a01629f5dc482aed70a009f"',
                expires: "Thu, 15 Jan 2026 15:53:35 GMT",
                "source-age": "0",
                "strict-transport-security": "max-age=31536000",
                vary: "Authorization,Accept-Encoding",
                via: "1.1 varnish",
                "x-cache": "MISS",
                "x-cache-hits": "0",
                "x-content-type-options": "nosniff",
                "x-fastly-request-id":
                  "03aa3451e4b26c4c339648efdfccf467a5928649",
                "x-frame-options": "deny",
                "x-github-request-id": "52BC:3DF5BC:C0939:137C84:69690C51",
                "x-served-by": "cache-lhr-egll1980070-LHR",
                "x-timer": "S1768492115.102495,VS0,VE116",
                "x-xss-protection": "1; mode=block",
              },
            );

          nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/findByTags")
            .query({ tags: "R%20100%20G%20200%20B%20150" })
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
                date: "Thu, 15 Jan 2026 16:39:38 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
              },
            );

          const inputFile = new Input(
            "./test/mocks/inputs/parameter-styles/input.json",
            "inputs",
          );

          const arazzo = new Arazzo(
            "./test/mocks/arazzo/openapi-parameter-tests/query/spaceDelimited/object.json",
            "arazzo",
            { logger: logger },
            docFactory,
          );
          arazzo.setMainArazzo();

          try {
            await arazzo.runWorkflows(inputFile);
          } catch (err) {
            expect(err).to.not.be.instanceOf(Error);
          }
        });
      });
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
