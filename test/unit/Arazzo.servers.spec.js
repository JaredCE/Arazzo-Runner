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

describe(`OpenAPI Servers`, function () {
  const logger = new Logger();

  describe(`operation`, function () {
    it(`should only use one server when there are multiple servers`, async function () {
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/servers/operation/multiple.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed594d6fdc3610bdfb570c981e1ac0915c27e8c1a7ba710c2c5a34469d1c0ad76868697697b144b224b5ce36f07f2f487dac4491d2daf12580f7b492c899e1e39b7943e9eb0100111239958c9c00799d1c25afc9a1bd9b89520a8edc6872025f0f000088ced658d2dd0d3b4c21357881a677138098ad446b50dc7cc6cc388bcd13a984446518eac10c6b8a1a5c09b5f5ee4f599bb6e89eb23c70b7679371832b549e5137642954494d33e8e737c41b71ef4f219c9638ed4d1bc5f86a646970edd9255fca22b4b0c61979dbc23634d2bb1a180c07e907e885805f68290b372017ab154312352fd7c2888faa186f46e7832a45b7be0b66b00c6ee014740f84aa8d6db4d9e44e5129d152c5a80af744d2d0d593af3248f13992c769be17d1e7a91e20fb14dd6709ef533e944ce1bdecede607fab48964a8cffbc712431b6aaa096a84932c479d29260d13dc91150dd4868071306b046d84c2516af2aa24277045e886b282de14480eed649e3b1740b4287272dd8fb5fbdf8b9a28fcb762caadf4aa86e4b09fccd7bda1631c3b0cad101cf88e3a378d5ae44f221701c6cf707dc472efb1429abfe7c576bcd9f7136bfafe1633e0eab3ea06ed3eabeeb3ea3eabeed8edb3eac277a7ba17684e5d5a0465cacf9860b64c65ca5496843364363b66c46d52dec60c8c4adc7305784c05084bdf5c1988043d9d9d732238761317c21991989089f94ee2e120464571bafacda11c14c72759792441e653642a49f64c937d1225982ad3c9b247ba8c13269c92b1fd9e16ce2749c790807e1b892242ba47b23e4a4c1f25a7538dc0fea21ac1372cacb3c7c073a1ca6f3f0a3ee6a4e0e1fe51e6f6980dd61488a5435e7a4b79fad6a9f5daec78c4ef04841f6521688ef9392bf0db71cc443e81e33e87ead7c771c41a3bd378456797a8355d3dccc02c7071fa8db6afb7ce1bc6e94ecb7736474af2c886d15fc9387a896691875d8d772926043b7354b27f6e31d2ec0ea3a96369a6128d59a598d95edaaf1c033e91d3caac8562ffd186eb215424fb0d07b0b4456438b98f9b4b9b35d21c9517d2411316617c29761f600c33752b747947572b547081a65f52fd94fcb0661a98060ada7551a0516d7ad39aeb04e02f514146392c19cf4154064afb98ded8bfad336ae06a6d8c3c49535ddf4a98b8fe7174eb25080582c3155359b254885ce498703487f0a2191598953295a52f138073a1c0d8c0eb980f61dbc456697425854a06b7b8854f5a62c668f1ea16b79fc00830a84d3da20f392c596150e9e4ef167db241a51b887e4a8e92a3f6be4155eaf7cb4b541b9639a0c761ba31693b2313dcd0acff06b0dbf76eab099694150d490cd2f2979d3932a060c132e41a43d64e25cdd608c75db000a452452fc6bbbbbb84ba518950abb4b1a5d3df176fdffd71f9eed5717294ac4d59108f622defad5cba4751da5f5d77539d881249cdbaf77d309568d2af2e9feffb6b58f9af48755596d41dc8c8b9259c6d146eb6b038eba787c7e53fd1548a3b2e33be2a6a65e90db73ae00275c5c4fabc40f3eb76910fe4822a5aa26543b7dafa176900eadae4bf4eaa9b1b6ad6338ab838b32a681767042817fff8356dd7abd83e6df4065016b58c2d69a1fda7f5e7d8509ff683c2a50de045bafb8c9b365f6fd37a4df15eaafbdf7ffbd0c8c1954564f05a62c49e209e11264d7954a8a5b004f695e5f8e8682c9c1ef2baca32d47a5915d0f1c287dea62e7213c28f4a59b0cccd4a3f6bafe4cfe33fbf075e63e9e310baf6bbf45a371c3af156f8cd1e582df886162c87c519e8ca2e1c478cdfd3d79b595f1768800b034b51f1bdbdec7a8701efac72cda4f1b040ca46f592b6fc66a24c37f126ef61c66ccdf58ced781d51777f115dc59cf1c544e7aa8978df999948aadbdde4ae92b7f93d34d62b833bd5f1b6f4dd06d5d6ac195f35edc256547587d113c02f0615a7c599c8bca672186e4f17e34270de6f5182addc28fee1b1d33778ea6a85add15d5f249463e2a4d14af73a53dfe6fbb6eae80695e1e83820538b6d4c597cfd837414483dee2ceb1d0f86b08ffba61d6c3ba0e80e5a961fdc1ffc0f405fc56064240000",
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
            date: "Fri, 16 Jan 2026 11:50:43 GMT",
            etag: 'W/"6c337454a7cac7f86426ffc2e3d4076f9ff208e54151e3f4b915f9f387ea44c2"',
            expires: "Fri, 16 Jan 2026 11:55:43 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "c1e7b49480f184f9587c56d1863462ea0c829284",
            "x-frame-options": "deny",
            "x-github-request-id": "6C2E:3BE113:51EFE:89F1A:696A2613",
            "x-served-by": "cache-lhr-egll1980071-LHR",
            "x-timer": "S1768564243.031476,VS0,VE116",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("http://petstore.swagger.com:80", { encodedQueryParams: true })
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
        "./test/mocks/inputs/servers/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-server-tests/operation/multiple.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      const spy = sinon.spy(OpenAPI.prototype, "buildOperation");

      try {
        await arazzo.runWorkflows(inputFile);

        expect(spy.returnValues[0]).not.be.an("array");
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }

      spy.restore();
    });

    it(`should only use one server when there is a single server`, async function () {
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/servers/operation/single.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed594d6fdc3610bdfb570c981e1ac0915c27e8c1a7ba710c2c5a34469d1c0ad768686976978944b2e4689d6de0ff5e505f2b5194b4feb804f09e561239337c7c336f287d3b00604aa3e45ab01360afa3a3e8353b747713956b2551926527f0ed000080d9648d39dfdd70c30c72c20ba4ce4d00465b8dcea0baf98c099516eb27da288d8604dade0c678a13ae94d97af7a7ac4d5b2c9f8a3470b7635348c2151acf683964a94ccea91ef4f31be68db8f3a730c9739cf666c908b91a58ea5d7b76d9d73c0b2dac76c6de36b0f58d74ae7a06c341fa017a21e0579eebac1c90aad54a201b35afd78ad447930d37a3f5c18de15bdf8520cc831b3805dd3da16a621b6c36bb355c6b74542153e09e48125f3df92a83149f23f938cdf722fa3cd503649fa2fb2ce17dca879229bc979dddfcc09f369188fbbc7f28312c712a26a8114eb2146d628426a164495624a80c8190406b044bcae020356591b313b8627cc345c66f3264876eb24c4b17c0acca5276dd8db5fddf899a19fcb710a65ce95505c9613799af3b438738b6183a2138f01db56e6ab5489f442e028c9fe1fa80e5de63833c7d2fb3ed70b3ef26d6f4fd2da6c7d567d50dda7d56dd67d57d56dda1db67d585ef4e752f904ecbb408ca949f31c16c99ca94a92c0967c86c76cc88dba4bc0d19382a71cf15e02115202c7d73656024e8e9ec9c13c1a19b71219c1189099998ef24ee0fe2a8284e57bf399483e2f8242b1f4990f914994a923dd3649f4409a6ca74b2ec912ec38409a7e4d87e4f0be793a46348401f47a21121dd23591f24a60f92d3a946607f511dc1372cacb3c7c07365f2c71f051f7252f070ffa85377cc06670ad4b2445e7b4b79fad6a9f15aeff888df09083fea4cf114d37391e1e3714c543a81e33e87ead7c7e388d576a6f11a9d9da3b57c753f03b3c08dd36fb07d9d75de08c9775abeb339509207368cfe4a86d16ba4451a7635dca53121d899e35afcf305479add7e34552cf5546631298ca0eda5fbcad1e3133b2d68ad8cf88fd75c0fa1a2c56fd883a52922fdc95ddccab459234fd178211dd4613121976af701860455add0e52d5fadd0c00552b7a4fa29f9612d2c080b1c6cd9458145b3e94cabaf2380bf54010997b01432055510e4ee31bf717f1b679ce06a4da44fe2d856b722a1ae7f1cdc7a09ca809270254c122d0da254294612e9105ed4a302b3626192f8650470ae0c900bbc8af910b6756c85c5b2a4702de00b6ee193d598089ebdfa82db4f400a082d5523ba90c3526484c6467f37e8b30d1a5b43f45374141d35f7094d6edf2f2fd16c4452023d0cb31c13373312258927dd3780edbeb75bcd30e722ab4942c8f35f76e6588f829948505a0c593bd53c59231cb7c102b0c2649d186f6f6f235e8e8a9459c5b52d1bffbe78fbee8fcb77af8ea3a3684d79c63c8a35bc7772593e1aa5fdd5753bb51451a639ad3bdf07638d147f2bf3f9aebb8695ff8ad41679cecb03193b7784738dc2cd161667ddf4f0b8fc27526164c965215759a52c9de14e07ca40cb62e27c5e20fdba5da43db9e086e7e8d8d0aeb6fa8d3400556df25f2755cd0da7f58c222ece9c0abac5910253c63f7c4ddbf62aae4f1bbc01d45925634b9e59ff69f53936d4a7fd6070e9027811ef3ee3c6f5d7dbb85ad3782fd5feefbe7da8e5e0ca21d27b2d31604f10cf11264d793468b57204f695e5f8e868289c1ef2b64812b4765964d0f2c287dea52e4a0ae1c7b5ce4452ce8a3f5bafe4cfe33fbf075e63e9e310baf6bbf44a374a74c65be1377b60b5901b9e89141667600bb7701c307e4f5f6f667d5d208154044b55c8bdbdec7a871eef9c72cda471bf40ea5af5a2a6fc262a8f37c7e12eab21a82fc8bedfb6c8cdf812aa75b5ab9f4d56f52d758acfaed67b40bedba0d9d25ac8552dd25b5554bade919daf8446f2ec4c255e2bd78fb5a346e3e5f7bcdb18041ba841fcfdc39e6ff0b4cc505719db6e449972ff278d16b6d30ffa36df37b96e6b54faa3c701995a6c6dcae1eb1f5f4781b4c37eaedaf16008fbb8af9bb0a6ef18dd4147d483bb83ff01a4bbc891da230000",
          ],
          {
            "accept-ranges": "bytes",
            "access-control-allow-origin": "*",
            "cache-control": "max-age=300",
            connection: "keep-alive",
            "content-encoding": "gzip",
            "content-length": "1494",
            "content-security-policy":
              "default-src 'none'; style-src 'unsafe-inline'; sandbox",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-resource-policy": "cross-origin",
            date: "Fri, 16 Jan 2026 11:46:29 GMT",
            etag: 'W/"15e6b0b7984b25ef9cf03e683a9d06758ecb18ea3d270d08e907eaf7bdfbf258"',
            expires: "Fri, 16 Jan 2026 11:51:29 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "f686270650075f3b3dfe7ea637cf92cbb30b212c",
            "x-frame-options": "deny",
            "x-github-request-id": "D124:C449E:4ED81:855F5:696A2514",
            "x-served-by": "cache-lhr-egll1980059-LHR",
            "x-timer": "S1768563989.130529,VS0,VE122",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("http://petstore.swagger.com:80", { encodedQueryParams: true })
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
        "./test/mocks/inputs/servers/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-server-tests/operation/single.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      const spy = sinon.spy(OpenAPI.prototype, "buildOperation");

      try {
        await arazzo.runWorkflows(inputFile);

        expect(spy.returnValues[0]).not.be.an("array");
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }

      spy.restore();
    });

    it(`should only use one server when there is a single server with default variables`, async function () {
      // nock.recorder.rec();
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/servers/operation/variable-default.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed59cf6fdb3614bee7af7860775881544ad362879c963509606c5883a63d0c59b032d2b3cd5622399272ea05f9df0752b22c51a4e43ab914884f9644be1f1fbfc7ef51ba3f00204222a7929113206f92a3e40d39b47733514ac1911b4d4ee0fe000080e86c8925dddeb0c314528397683a370188594bb406c5ed17cc8cb3d83c914a485486a1eecdb0a6a8c185506beffe98b5718bee29cb03773b361937b840e5197543e64295d434837e794bbc110ffe14c26989e3deb4518c2f06967ad79e5df2ad2c428935cec8bb0d6c7d239dab9ec170907e805e08f88d96b2700372b158302451f372298cf8a48ae162b43ea85274edbb6006cbe0028e41f79d506d621b2c36b953544ab45431aac21d913474f1e45906293e45f238cd7722fa34d503641fa3fb24e17dca878a29bc969dd5fc489fb6900cf579bf2f31b4a1a61aa146b8c872d49962d230c11d59d1406d081807b344d046281c9426af4a7202d784ae282be86d81e4d04ee6b97301448b222737dd58dbff9da889c27f2ba65ca6d7352487dd62bee90c1de2d8626885e0c077d4ba69d4227f12b908307e82eb03967b8f15d2fc3d2fd6c3c57e18c9e9c74ba6c7d567d50dda7d56dd67d57d56dda1db67d5851f4e752fd19cbab208ca945f31c16a19ab94b12a0957c864754c88dba8bc0d191895b8e71d609f1d202c7d53db4024e8f1ea9c12c1a19bb8104e88c4884c4c7712df0f625414c777bf299483e2f82499470a64ba44c68a64c732d9a55082a5325e2c3b94cbb060c225195bef71e17c92720c09e8e3481411d21d8a752f31dd4b4ec71a81dd4535826f5858278f811742958f3f0aee7352f070ff24737bcc066b0ac4dc212fbd549ebe75da786d563ce27704c24fb21034c7fc8215f8781c33918fe0b8cba1facd711cb1c6ce385ed1d9256a4d17df676012b838fd06cbd7c9f39671bad5f2adcd8192ecd930fa990ca397686679d8d570956242b0354725fbe72b469add7e34752ccd54a231ab1433eb2bfb95a3c727725a99a550ec3fda703d848a64bf630f96cd26d29fdcc5cd95cd12698eca0be9a0098b303e17db0f308699ba15babaa38b052ab844d3dd52fd92fcb8641a98060ada7551a051ad3ad39aeb04e02f51414639cc19cf4154064afb98dedabf1b67d4c0f5d2187992a6babe953071f3f3e0d64b100a04876ba6b264ae10b9c831e1680ee145332a302b652a4b5f2600174281b181d7311fc2ba89add2e8b6142a197cc5357cd61233468b575f71fd198c0083dad423ba90c39c1506954efedea04f56a87403d1ebe42839dadc37a84afd7e7e856ac53207f4304c3726ddccc8043734ebbe016cd7bd5d6a82256545431283b4fc756b8ef42858b00cb9c690b55349b325c2711b2c00a954d189f1eeee2ea16e5422d4226d6ce9f48fd9bbf33fafce5f1d2747c9d29405f128b6e1bd954bf7284afbeb9b76aa135122a95976be0fa6124d7aefeaf9a19bc3c27f45aaabb2a4ee40462e2ce16ca370bb86d959b73c3c2e7f405329eeb8ccf8a2a895a533dcea800bd46d26d6e7259adfd6b3bc271754d1122d1bda6ceb5fa401a8f726ff7552dddc50b39c50c4d99955419b9c11a05cfcc3d7b46daf62fbb4c11b4059d43236a785f69fd69f63437dda4f0ae7368017e9f6336eda7cbd4deb9ce2bd54fbbffbf6a191836b8b48efb5c4803d413c234c1af3a8504b6109ec2bcbf1d1d150383de4759565a8f5bc2aa0e5850fbd2d5de426841f95b260999b957ed1de963f8dfff41a788da58f43e8daefd26bdd70e8c45be1b73b6035e32b5ab01c6667a02b9b380e18bfa3afb793be2ed1001706e6a2e23b7bd9f60e3dde59e59a28e3fe06291bd54b3abbf9fd2dd57849cdf2c18f664515b32791e04168332b4c8c1ce7b42a5c93b27a3df19a245c07916ec04fbadd61f74a3492622cb95e5ac7818ece1387cd96d18fb4b3b36e03f15872be42b5364bc6174d07b21655ddb47434f59b41c5697126322ffc3e161da98d6bcb45b7eb09768783f8fb2759dfe0a9db7eecb6dfb65a4239728f1aad74a7d9f56dbedf6c64ba41a53f3a0ec858b28d298baf7f368f02a987cd6abde2c1107671df74989ba62aba82b6100e1e0efe073eea15d1b7240000",
          ],
          {
            "accept-ranges": "bytes",
            "access-control-allow-origin": "*",
            "cache-control": "max-age=300",
            connection: "keep-alive",
            "content-encoding": "gzip",
            "content-length": "1529",
            "content-security-policy":
              "default-src 'none'; style-src 'unsafe-inline'; sandbox",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-resource-policy": "cross-origin",
            date: "Fri, 16 Jan 2026 11:52:03 GMT",
            etag: 'W/"572698be994911903a995e3ea8dcd4f3b383140894c4c2d361820f1d2ce13bb7"',
            expires: "Fri, 16 Jan 2026 11:57:03 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "b892eb0ff31189f28e1bad8a935f80477d6ae0a6",
            "x-frame-options": "deny",
            "x-github-request-id": "1609:365968:50369:88B87:696A2660",
            "x-served-by": "cache-lhr-egll1980052-LHR",
            "x-timer": "S1768564324.785936,VS0,VE132",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
        .get("/v1/pet/1")
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
        "./test/mocks/inputs/servers/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-server-tests/operation/variable-default.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      const spy = sinon.spy(OpenAPI.prototype, "buildOperation");

      try {
        await arazzo.runWorkflows(inputFile);

        expect(spy.returnValues[0]).not.be.an("array");
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }

      spy.restore();
    });

    xit(`should only use one server when there is a single server with enum variables`, async function () {
      // nock.recorder.rec();
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/servers/root/variable-enum.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed59516fdb36107ecfaf20d83dac402a7949300c795ad63480b1610d9af661c8829591ce365b89e4c893532fc87f1f48c9324551929be6a540fc6449e4ddf1e377f71da5fb0342a8542098e2f494d0e364961cd3437b3793a59202041a7a4aee0f0821849a6c0525dbddb0c33430844b40ef262114370aac4179fb093274169b274a4b051a3998ce0c6b8a212ca5de04f7c7ac8d5b744f791eb9ebd9e40261093a30ea862ca42e1936837e3ea1c18887700a15ac84716f063517cb9ea5ce7560977e298bd8c21a67f4f516b6ae11efaa63301e64186010027c61a52adc805c2e971ce8a079b592283fe8a2bf19ad0fa635db842e384219ddc031e8be12aa6d6cbdcda6779a2905962aa82bd8134964cb275f6594e253241fa6f95e449fa67a84ec63749f247c48f95832c5f7d2dbcdf7ec69130959c8fbc712c320c36a841af124cbc1649a2be45238b20292da10e182e00a8841a9a1979aa22ae929b9a66ccd78c16e0ba08776b2c89d0b428d2c727ae3c7dafef7a2a61afeadb8762bbdae2139f493f9c61bdac7b1c5d00ac141e8a875d3a845fe24721161fc04d77b2c0f1e6b60f95b516cfa9bfd30b2a6ef6f311dae3eab6ed4eeb3ea3eabeeb3eaf6dd3eab2ef9ee54f712f0cca54554a6c28c8966cb58a68c65493c4326b36342dc46e5adcfc041897bae008fa90071e99b2a0303418f67e79408f6dd0c0be184488cc8c47427f1f5200e8ae278f59b42392a8e4fb2f28104994e91b124d9334df6499468aa8c27cb1ee9d24f98784a0eedf7b8703e493ac604f4db483420a47b24eba3c4f451723ad608ec2faa03f8c68575f218782175f9ed47c1c79c1402dc3fa8dc1eb3893545e4c221af82a53c7debb4f5daecf880df11083fa842b21cf20b5ec0b7e398c97c04c77d0ed5c747c3883576c6f11a9c5d82316cf9750626811ba65f6ffbbc75de72c1765abeb3d9539247368ce14afad12bc0791e77d5dfa52121d899638afff319069add6e34752ccd546a20ab34c7cd95fdcad1e1133dab702535ff8f355c8fa1a2f8efd081655b44ba937ddc5cdaac80e5a083900e9ab028170bb9fb00831ceb56e8ea8e2d97a0c925a05f52c3947cbfe28670431831ae8b2206f4da9bd65c2784fc252b923141165ce44456484afb98dddabf5b670cc9f50a519da6a9a96f255cdefcd8bbf592484da420d75c67c9420308994322000fc98b66546456ca7596be4c08b9909aa00dbc8ef9906c9ad82a03aea430c5c967d8908f4641c659f1ea336c3e129404c1603dc2879c2c7881a04df2f7167dba066d1a887e4a66c96c7b1f4197e6ede20af49a670ee87e986e4cba9d9149812cf3df00b6fbde6e358592f1a22109022b7fdd99a31d0a163c03612066ed4cb16c05e4a80d96105ae9c28bf1eeee2e616e5422f5326d6c99f48ff9eb377f5ebd797594cc921596050d28b6e5bd954bf76890f6d737ed5427a254315c79df07530598debb7c7ef0d7b00c5f919aaa2c993b90d10b4b38db28dc6ec8fcdc4f8f80cbef002b2d1c97b95816b5b278c3ad0eb8405d31b13e2f017fdbccf38e5c30cd4ab06c68575bff061a80ba3685af93eae686e16a4211e7e75605ede25012ede2efbfa66d7b15dba7f5de00aaa296b1052b4cf8b4fe1c1bebd37ed0b0b001bc48779f71d3e6eb6d5aaf69b8976afffb6f1f1a39b8b688745e4bf4d813c5738049631e3518252d814365399acdfac219206faa2c03631655415a5e84d0dbd4058131fc985205cfdcacf493094afe34fed37b103496210eb1ebb04baf75c3a133dc0a9fec81d55cac59c173323f27a6b20b871ee3f7f47532e9eb1290088964212bb1b7977eefd0ab6056c54cbf80750ba46a542fd995df7b25353ea4f7b7ccc025c3d5c3aeb8ae99e6f624127441db91212b7358b0aa708dc9daeb1bfd977dd65738ad3df9fc32b3a7949393e3e07ce2d9b50f47b0a84bf23651bb4078f56cb7c2606fdeac416f70c5c5b2d1fd8dacea56c153b22f085ab0e25c66012e5da83d811baee8177eaf11edc97af177cf8fa1c13397f4b6d8b60d8ed48e52a3462be3b598a1cdb7dbf2611a54baa38701195b6c63cae21b9e88078134fd16b1def16808fbb86ffaba6d2b33b88336cf0e1e0efe07d45302252d240000",
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
            date: "Fri, 16 Jan 2026 11:17:09 GMT",
            etag: 'W/"d58541518df7f0ef287c1560ab481468c9865b3c298389b1d65c880024843f9d"',
            expires: "Fri, 16 Jan 2026 11:22:09 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "dc52b83248fe2084ce0fd26874832664484d7394",
            "x-frame-options": "deny",
            "x-github-request-id": "77D4:365968:3D9FD:69ACC:696A1E34",
            "x-served-by": "cache-lhr-egll1980048-LHR",
            "x-timer": "S1768562229.957390,VS0,VE124",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("http://petstore.swagger.io:443", { encodedQueryParams: true })
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
        "./test/mocks/inputs/servers/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-server-tests/operation/variable-enum.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      const spy = sinon.spy(OpenAPI.prototype, "buildOperation");

      try {
        await arazzo.runWorkflows(inputFile);

        expect(spy.returnValues[0]).not.be.an("array");
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }

      spy.restore();
    });
  });

  describe(`path`, function () {
    it(`should only use one server when there are multiple servers`, async function () {
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/servers/path/multiple.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed594d6fdc3610bdfb570c981e1ac0d1ba4ed0834f75e31858b4688c3a3914aed1d0d2ec2e638964c9d13adbc0ffbda0a4d5521425ad1d5f02f8a60f7266f8386fde50fa7a00c09446c9b56027c05e2747c96b76e89ea6aad04aa224cb4ee0eb010000b3e90a0bbe7be08619e4841748de4300461b8dcea0baf98c2955169b37da288d8604dace0c678a132e95d904cfc7ac8d5bacde8a2cf2d4b32924e1124d60b41ab250a6e0d40cfaf90d0b46dc875398e4058e7bb364845cf62c75ee03bbec4b91c716d638636fb7b0758d78771d83f120c3008310f00b2f745e0dc8d47229900d9ad72b45eaa3c9fb9bd1fae0c6f04de8421016d10d1c83ee81506d63eb6d36bb335c6b74a942a6c43d9124be7cf25546537c2ac987d37caf449f4ef548b28fa5fb64c287291f23537c2fbdddfcc09f9648c4c3bc7f6c6258e2548ea4469c6419dad4084d42c92a5991a036044202ad102c29833d6acab2602770c5f89a8b9cdfe4c80edd6499552e80599567ecda8fb5bdf6a26606ff2d85a9567a554372e893f9da1bdac7b1c5d009c141e8a875d3a845f6247211c9f8895cef6579f0da20cfdecb7cd3dfecfb91357d7f8be9e4eab3ea46ed3eabeeb3ea3eab6edfedb3eac277a7ba1748a7152da232153226ca9631a68cb124ce9049764c88dba8bcf5337050e29e2bc0632a405cfaa6cac040d0e3ec9c12c1be9b61219c1089119998ee241e0ee2a0288e57bf2994a3e2f8242b1f20c83445c648b2274df6214a942ae364d9832e7dc2c42939b4dfe3c2f924748c09e8b725d18090ee41d64789e9a3e474ac11d85f5407f08d0bebe431f05c99e2db8f828f392904b87fd4993b668333056a5121af83a53c7debb4f5daecf880df11083fea5cf10cb37391e3b7e398aa6c04c77d0ed5af8f87116bec8ce33538bb406bf9f2610626811b4ebfdef679ebbc1192efb47c67b3a7248f6c18c395f4a3d748f32ceeaabf4b4342b033c7b5f8e716079add6e34752ccd5466312d8da0cda5fbcbd1c927765ad24a19f11f6f723d868a16bf6107966d11e94ef671ab68b3429ea109423a68c262422ed4ee070c09aa5ba1cb3bbe5ca2810b24bfa48694fcb0121684050eb6eaa2c0a2597bd39afb04e02f5542ca252c84cc409504857bcd6fdce5d61927b85a11e993d9ccd68f12a1ae7fec3d7a09ca809270254c9a2c0ca254192612e9105e34a322b366c2a4b39709c0b932402ef03ae643d834b19516ab92c2b5805bdcc027ab31153c7f758b9b4f400a082dd5237cc8612172426393bfb7e8b3351adb40f45372941c6d9f139ac2be5f5ca2598bb402ba1f663566b69d912a493cf5bf00b6fbde6e35c3828bbc4912425efcb233c73a29988b14a5c598b553cdd315c2711b2c002b4deec578777797f06a54a2cc72d6d8b2b3dfe76fdffd71f9eed5717294aca8c8599062dbbc777259bd1a4cfbabeb766a25a24c735a79ff07671a69f6b5e2f3bdbf863acb6cebc0771259886eb233d9c2e496b3f68ab1574c1f62265545d74c73d536046c197ecbb56551f0eae4c8ce1d335c4773b381f999cfe380747f22954656a4137299d712e80d778255215a553de7f302e9d7cd3cebe81a37bc400a5183a14ea52ea2e177afba0be3b49a90eef999936bb7385260aaf8fbdf93dba6ca3594bd4f953aaff576c1731bbeadff1bc71aca1f0c2e5c002f66bbffcdb3e637f3ac5ed370d3d75efb9f491addba728874be9ff4d23c8ae740ca8f793468b5724c0b25f0f8e8a8aff001f2b64c53b47651e6d0e64508bdab312829861fd73a1769356bf6d906da348dfff41e041d708843ec3e3c4ed40257a133dcb3bfd903abb95cf35c64303f035bba85632fe3f7f4f566d2d705124845b050a5dcdb4bbfc9e995da6e216c2be444e512aa2d5ccd52f69d99aaa4bcdd4d6e2bf796265d635e35d9a94c80ccbb359a0dad845c36edc146957547e109de174223797ea6d2a089ec86ebe9e0703d3df75b9268ebd68bbf7bcc0c0d9e569473a5aeed8394a93674d46869bd4e34b4f97e4b5edba0d21d3d0cc8d8621b530edff0e03c08a4ed7792f58e4743d8c77dd3fe6d3b9ec11d74597e707ff03f4e71fb8f54240000",
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
            date: "Fri, 16 Jan 2026 11:34:47 GMT",
            etag: 'W/"f601d600d430f9303341919af3ac1a5651af5923b60d2ea17262b8e68acf16c4"',
            expires: "Fri, 16 Jan 2026 11:39:47 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "2956fc6aec9f264a44f276689c466f1d274c6c5f",
            "x-frame-options": "deny",
            "x-github-request-id": "795C:12237E:4A869:7CDC7:696A2247",
            "x-served-by": "cache-lhr-egll1980036-LHR",
            "x-timer": "S1768563287.093410,VS0,VE127",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("http://petstore.swagger.org:80", { encodedQueryParams: true })
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
        "./test/mocks/inputs/servers/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-server-tests/path/multiple.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      const spy = sinon.spy(OpenAPI.prototype, "buildOperation");

      try {
        await arazzo.runWorkflows(inputFile);

        expect(spy.returnValues[0]).not.be.an("array");
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }

      spy.restore();
    });

    it(`should only use one server when there is a single server`, async function () {
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/servers/path/single.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed594d6fdc3610bdfb570c981e1ac0915c27e8c1a7ba710c2c5a34469d1c0ad76868697697b144b224b5f636f07f2f487dac4452d2c6f125806fbb1439337c7c336f287d3900204222a792911320af93a3e43539b4a39928a5e0c88d2627f0e5000080e86c8d25dd0dd8690aa9c10b34bd410062b612ad4171f31933e32c364fa412129561a8072bac296a7025d4d61b9fb2366dd13d657964b4679371832b549e5137652954494d33e9e737c49bf1e02f219c9638ed4d1bc5f82ab034f8efd925f76511db58e38cbc6d611b1ae9fd1b188c07e907e88580f7b494859b908bd58a2119352fd7c2888faa080fa3f34195a25bdf053358460f700abaaf84aa8d2d386c72a7a89468a96254857b2269e8eac97719a5f81cc9c769be17d1e7a91e21fb14dd6709ef533e964cf1b3ec9de607fab48964a8cffbc712431b6aaa096ac4932c479d29260d13dc91150dd4868071306b046d84c2203579559213b822744359416f0a24877631cf9d0b205a1439b9eec7dafdee454d14fe5b31e5767a554372d84fe6ebded410c70e432b0407bea3ce4da316f993c84584f1335c0f58ee3d5648f3f7bcd88687fd30b1a7ef6f3303ae3eab6ed4eeb3ea3eabeeb3ea866e9f5517be3bd5bd4073ead2222a537ec644b3652a53a6b2249e21b3d931236e93f216327054e29e2bc0632a405cfae6cac048d0d3d9392782a19b71219c1189099998ef24be1ec451519cae7e732847c5f149763e9220f3293295247ba6c93e89124d95e964d9235dc28489a7e4d8794f0be793a4634c40bf8d442342ba47b23e4a4c1f25a7538dc0fea23a826f5c5867af81e74295df7e157ccc4dc1c3fda3cced351bac29104b87bcf4b6f2f4ad53ebb539f111bf13107e9485a039e6e7acc06fc73113f9048efb5caa5f1f8f23d6d899c66b7475895ad3d5d71998056e9c7ec1f1f5f679c338dd69f9ce66a0248f6c18fd9d84d14b348b3cee2a3ca53121d899a392fd738b23cdee309a3a966629d198558a99eda5fdca31e01339adcc5a28f61f6db81e4345b2df70004b5b44868bfbb8b9b45923cd5179211d346111c69762f701c63053b742977774b542051768fa25d54fc90f6ba68169a0a05d17051ad5a6b7acf99f00fc252ac8288725e33988ca40691fd31bfbb375460d5cad8d912769aaeba18489eb1f83a1972014080e574c65c95221729163c2d11cc28b66566455ca5496be4c00ce85026303af633e846d135ba5d195142a19dce2163e698919a3c5ab5bdc7e0223c0a036f58c3ee4b0648541a593bf5bf4c906956e20fa29394a8eda7183aad4ef9797a8362c73408761ba3969bb2213dcd0acff06b03bf7eea8099694150d490cd2f2979d3932a060c132e41a63d64e25cdd608c75db000a452452fc6bbbbbb84ba598950abb4b1a5d3df176fdffd71f9eed5717294ac4d59108f622defad5cba47a3b4bfbaee963a1125929a75effb602ad1a45f5c3e3ff4f750b34c770efa4e221b910d3b9316a64c24d56dba390eab48a7e564e5bf86d555595277e923e796d4b619b9d9c2e2ac9f825ebefc89a652dce50be3aba256afde74ab350e0c57b0accf0b34bf6e17f94092a8a2251a7fc330d664d4f5cf7f65553750d4ac675477716695d66ece08502efef05570d70fd95e3078cb288b5a2a97b4d0fed3fa936fac17fc41e1d206f022dd7d2a4e9b2fc469bda7f17eadfbdd7fc3d148ce954564f0ea23606814cf11b64e7954a8a5b049e2abd7f1d15128ce1ef2baca32d47a5915d0f1c287de9607e426861f95b260995b957ed69eaccce33f7f065ef3eae310fbefdf046a6d72e88cb7db6ff6c06ac137b460392cce405776e318307e4f5f6f667d5da0012e0c2c45c5f7f612f62741951cd6b0aeb8cdd42e26bac2b5ab9b2dd387967a056157e3bdcdbddba0da9a35e3ab469cb7a2aaf5bc2737f70615a7c599c8bc166e186b4f85c64be279bf2188364e41fcc34b9e6ff0d4658dad565d1722943b9349a395eef581becdf76dfee90695e1ec7140a636db98b2f8fad7d6512075d8c7d5271e0d611ff74df3d5f61ba32768897af070f03fd4cbd190d2230000",
          ],
          {
            "accept-ranges": "bytes",
            "access-control-allow-origin": "*",
            "cache-control": "max-age=300",
            connection: "keep-alive",
            "content-encoding": "gzip",
            "content-length": "1494",
            "content-security-policy":
              "default-src 'none'; style-src 'unsafe-inline'; sandbox",
            "content-type": "text/plain; charset=utf-8",
            "cross-origin-resource-policy": "cross-origin",
            date: "Fri, 16 Jan 2026 11:20:03 GMT",
            etag: 'W/"589e6d732a44009d2d3d934052c59b18799a80c16d6d5174dffbfeae0ec92b90"',
            expires: "Fri, 16 Jan 2026 11:25:03 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "4135e71b06690017b5313a83a452aec5174035cc",
            "x-frame-options": "deny",
            "x-github-request-id": "626A:17F34F:3DB58:6ACA1:696A1EE1",
            "x-served-by": "cache-lhr-egll1980050-LHR",
            "x-timer": "S1768562403.916597,VS0,VE130",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("http://petstore.swagger.co.uk:80", { encodedQueryParams: true })
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
        "./test/mocks/inputs/servers/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-server-tests/path/single.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      const spy = sinon.spy(OpenAPI.prototype, "buildOperation");

      try {
        await arazzo.runWorkflows(inputFile);

        expect(spy.returnValues[0]).not.be.an("array");
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }

      spy.restore();
    });

    it(`should only use one server when there is a single server with default variables`, async function () {
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/servers/path/variable-default.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed59c16edc3610bdfb2b064c0f0de0685d3be8c1a7ba710c182d1aa34e0e856b34b434bbcb442259925a676bf8df0b525a2d4552d266e34b00df76257266f8386fde907a3800204222a79291532027d95176420eedd35c545270e446935378380000203a5f6245b70fec3085d4e0151aef2100316b89d6a0b8fb84b97116db37520989ca30d4bd19d61435b8106a1d3c1fb3366ed1bd6545e2a9679371830b54815137642e54454d3be8e7d72418f1184e219c5638ee4d1bc5f822b2d4fb1fd8255faa32b5b0d61979b381ad6fc4fbd733980e320c300801bfd04a966e4021160b8664d0bc5c0a233ea832de8cce07558aae4317cc6095dcc031e8be12aa4d6cd166937b45a5449b2a46d5b82392862e9e7c95c9149f4af2e134df29d1a7533d91ec63e93e99f061caa7c894de4b6f37dfd3a72592a161deef9b18da50538fa4469a6405ea5c316998e02e59d14063081807b344d046288ca8c9eb8a9cc20da12bca4a7a572239b49379e15c00d1a22cc8ad1f6bf7db8b9a28fcb766caadf4a681e4d027f3ad3734c6b1c3d00ac141e8a873d3aa45f1247291c8f8895c8fb23c78ad9016ef78b98e37fb71644ddfdf627ab9faacba49bbcfaafbacbacfaa1bbb7d565df8ee54f70acd99a34552a642c624d932c6943196a41932c98e09711b95b738030725eeb902ec5301d2d237550606821e67e79408c66e8685704224466462ba93f87a10074571bcfa4da19c14c72759f90041a6293246921d69b20b5192541927cb0e74890993a6e4d07e8f0be793d03125a0df96440342ba0359f712d3bde474ac11d85d5407f04d0bebe431f042a8eadb8f82fb9c1402dc3fc8c21eb3c19a023177c8cb60294fdf3a6dbcb63b3ee07704c20fb214b4c0e28295f8ed38e6a218c1719743f5c9f13062ad9d71bc066757a8355d7c9d8149e086d32fda3e6f9d778cd3ad966f6d464ab267c318ae248e5ea2b92cd2aee25d1a1282ad392ad93f9f71a0d9ed47d3c4d24e251af35a31b3beb65f397af944ce6ab3148afd47db5c4fa122d96fd883655344fa937ddc1c6d96480b544148076d5884f1b9d87e8031cc34add0f53d5d2c50c1151abfa486947cbf641a98060ada7551a051adbc69edff0ce02f51434e39cc192f40d4062afb9aded99f1b67d4c0cdd218793a9be9e651c6c4ed8fd1a3972014080e374ce5d95c21725160c6d11cc28b765462d68ca97cf63203b8100a8c0dbc89f910d66d6cb5465752a864f019d7f0514bcc192d5f7dc6f54730020c6ad38cf02187392b0d2a9dfdbd419fac50e916a29fb2a3ec68f3dca0aaf4bbf935aa15cb1dd071986ecc6c332317dcd0dcbf01ecf6bddb6a821565659b240669f5cbd61ce9a560c972e41a53d6ce24cd9708c75db000a456a517e3fdfd7d46dda84ca8c5acb5a567bf5fbe79fbc7f5db57c7d951b63455498214dbe4bd954bf76a30ed6f6ebba94e4489a466e97d1f9c4934b307c7e7477f0d4d96e9ce81ef24b110d96667e6a1fe7047355e51b37cec9f3d575431db2f24c46b3323d5c81438a775e9cac8ea64e40e2f2a5b5df34016e1bdafaeab8aba5326b9b02cb2ddcfdd1a2ecf7dce0704fd134dadb82328e38bb2914b6fb8153787beab90d6e7159a5fd797454f03a9a2159a106118ea6a9a821bde91351d9bc56b5ce62fcfadb4dbc51901cac51fdf3d770d986d3ea36b4d5936da3ca7a50edf36df98537bf683c2b90de0c56cfb6d7ad67e929e356bda6123fd2b9556e36e2c22bdbb968812493c07e831e651a196c2b23294cbe3a3a3388303e4759de7a8f5bc2ea1cb8b107a5b8f909b147e54ca92e56ed6ec930e746c1affe93d08bae51087d4fff0e8d188a14367b8bf7fbd0356977c454b56c0e539e8da2e1ca38cdfd1d7eb495f5768800b037351f39dbdc40d515496fb45b3aba67b15cb81423954247b05f238d1bd0542b061523f52afe06c0309c07bbb42b5364bc6176db7b11675d3a078faf9c5a0e2b43c1779107e1f0b4f56874bee85dfe1243bc128fefea9353478e65869ab61d75609e5f67cd468adbdc636b4f96ec36fdda2d21f3d0cc8d8625b5316dff01c3e08a48e1bd366c79321ece2beed26370dd4e00e5a221c3c1efc0fd043b460a3240000",
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
            date: "Fri, 16 Jan 2026 11:37:07 GMT",
            etag: 'W/"a37c319027adce7f180ef6dc6882598eadc3d69856d099039779a49857b7884e"',
            expires: "Fri, 16 Jan 2026 11:42:07 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "ddb2ed47f7e69d3deb9eb6b151bbb1cb9d9cd4c8",
            "x-frame-options": "deny",
            "x-github-request-id": "3398:FF71D:49475:7C749:696A22E2",
            "x-served-by": "cache-lhr-egll1980078-LHR",
            "x-timer": "S1768563427.493156,VS0,VE119",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
        .get("/v3/pet/1")
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
        "./test/mocks/inputs/servers/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-server-tests/path/variable-default.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      const spy = sinon.spy(OpenAPI.prototype, "buildOperation");

      try {
        await arazzo.runWorkflows(inputFile);

        expect(spy.returnValues[0]).not.be.an("array");
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }

      spy.restore();
    });

    xit(`should only use one server when there is a single server with enum variables`, async function () {
      // nock.recorder.rec();
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/servers/root/variable-enum.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed59516fdb36107ecfaf20d83dac402a7949300c795ad63480b1610d9af661c8829591ce365b89e4c893532fc87f1f48c9324551929be6a540fc6449e4ddf1e377f71da5fb0342a8542098e2f494d0e364961cd3437b3793a59202041a7a4aee0f0821849a6c0525dbddb0c33430844b40ef262114370aac4179fb093274169b274a4b051a3998ce0c6b8a212ca5de04f7c7ac8d5b744f791eb9ebd9e40261093a30ea862ca42e1936837e3ea1c18887700a15ac84716f063517cb9ea5ce7560977e298bd8c21a67f4f516b6ae11efaa63301e64186010027c61a52adc805c2e971ce8a079b592283fe8a2bf19ad0fa635db842e384219ddc031e8be12aa6d6cbdcda6779a2905962aa82bd8134964cb275f6594e253241fa6f95e449fa67a84ec63749f247c48f95832c5f7d2dbcdf7ec69130959c8fbc712c320c36a841af124cbc1649a2be45238b20292da10e182e00a8841a9a1979aa22ae929b9a66ccd78c16e0ba08776b2c89d0b428d2c727ae3c7dafef7a2a61afeadb8762bbdae2139f493f9c61bdac7b1c5d00ac141e8a875d3a845fe24721161fc04d77b2c0f1e6b60f95b516cfa9bfd30b2a6ef6f311dae3eab6ed4eeb3ea3eabeeb3eaf6dd3eab2ef9ee54f712f0cca54554a6c28c8966cb58a68c65493c4326b36342dc46e5adcfc041897bae008fa90071e99b2a0303418f67e79408f6dd0c0be184488cc8c47427f1f5200e8ae278f59b42392a8e4fb2f28104994e91b124d9334df6499468aa8c27cb1ee9d24f98784a0eedf7b8703e493ac604f4db483420a47b24eba3c4f451723ad608ec2faa03f8c68575f218782175f9ed47c1c79c1402dc3fa8dc1eb3893545e4c221af82a53c7debb4f5daecf880df11083fa842b21cf20b5ec0b7e398c97c04c77d0ed5c747c3883576c6f11a9c5d82316cf9750626811ba65f6ffbbc75de72c1765abeb3d9539247368ce14afad12bc0791e77d5dfa52121d899638afff319069add6e34752ccd546a20ab34c7cd95fdcad1e1133dab702535ff8f355c8fa1a2f8efd081655b44ba937ddc5cdaac80e5a083900e9ab028170bb9fb00831ceb56e8ea8e2d97a0c925a05f52c3947cbfe28670431831ae8b2206f4da9bd65c2784fc252b923141165ce44456484afb98dddabf5b670cc9f50a519da6a9a96f255cdefcd8bbf592484da420d75c67c9420308994322000fc98b66546456ca7596be4c08b9909aa00dbc8ef9906c9ad82a03aea430c5c967d8908f4641c659f1ea336c3e129404c1603dc2879c2c7881a04df2f7167dba066d1a887e4a66c96c7b1f4197e6ede20af49a670ee87e986e4cba9d9149812cf3df00b6fbde6e358592f1a22109022b7fdd99a31d0a163c03612066ed4cb16c05e4a80d96105ae9c28bf1eeee2e616e5422f5326d6c99f48ff9eb377f5ebd797594cc921596050d28b6e5bd954bf76890f6d737ed5427a254315c79df07530598debb7c7ef0d7b00c5f919aaa2c993b90d10b4b38db28dc6ec8fcdc4f8f80cbef002b2d1c97b95816b5b278c3ad0eb8405d31b13e2f017fdbccf38e5c30cd4ab06c68575bff061a80ba3685af93eae686e16a4211e7e75605ede25012ede2efbfa66d7b15dba7f5de00aaa296b1052b4cf8b4fe1c1bebd37ed0b0b001bc48779f71d3e6eb6d5aaf69b8976afffb6f1f1a39b8b688745e4bf4d813c5738049631e3518252d814365399acdfac219206faa2c03631655415a5e84d0dbd4058131fc985205cfdcacf493094afe34fed37b103496210eb1ebb04baf75c3a133dc0a9fec81d55cac59c173323f27a6b20b871ee3f7f47532e9eb1290088964212bb1b7977eefd0ab6056c54cbf80750ba46a542fd995df7b25353ea4f7b7ccc025c3d5c3aeb8ae99e6f624127441db91212b7358b0aa708dc9daeb1bfd977dd65738ad3df9fc32b3a7949393e3e07ce2d9b50f47b0a84bf23651bb4078f56cb7c2606fdeac416f70c5c5b2d1fd8dacea56c153b22f085ab0e25c66012e5da83d811baee8177eaf11edc97af177cf8fa1c13397f4b6d8b60d8ed48e52a3462be3b598a1cdb7dbf2611a54baa38701195b6c63cae21b9e88078134fd16b1def16808fbb86ffaba6d2b33b88336cf0e1e0efe07d45302252d240000",
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
            date: "Fri, 16 Jan 2026 11:17:09 GMT",
            etag: 'W/"d58541518df7f0ef287c1560ab481468c9865b3c298389b1d65c880024843f9d"',
            expires: "Fri, 16 Jan 2026 11:22:09 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "dc52b83248fe2084ce0fd26874832664484d7394",
            "x-frame-options": "deny",
            "x-github-request-id": "77D4:365968:3D9FD:69ACC:696A1E34",
            "x-served-by": "cache-lhr-egll1980048-LHR",
            "x-timer": "S1768562229.957390,VS0,VE124",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("http://petstore.swagger.io:443", { encodedQueryParams: true })
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
        "./test/mocks/inputs/servers/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-server-tests/path/variable-enum.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      const spy = sinon.spy(OpenAPI.prototype, "buildOperation");

      try {
        await arazzo.runWorkflows(inputFile);

        expect(spy.returnValues[0]).not.be.an("array");
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }

      spy.restore();
    });
  });

  describe(`root`, function () {
    it(`should only use one server when there are multiple servers`, async function () {
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/servers/root/multiple.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed594d6fdc3610bdfb570c981e1ac0d1ba4ed0834f75e31858b4688c3a3914aed1d0d2ac96b144b224b5f636f07f2f4869b512497dc4f12580f7b492c899e1e39b7943e9cb0100111239958c9c00799d1c25afc9a1bd9b8a520a8edc6872025f0e0000884ed758d2fd0d3b4c21357881a673138098ad446b50dc7cc6d4388bcd13a984446518eade0c6b8a1acc85da7af7c7ac8d5b744f5916b9dbb1c9b8c11c9567d40d59095552d30cfaf90df1463cf85308a7258e7bd346319e07967ad79e5d725f16b18535cec8db1d6c7d239dab9ec178907e805e08784f4b59b80199c8738664d0bc5c0b233eaa22dc8cd607558a6e7d17cc6019ddc031e8be12aa5d6cc166933b45a5444b15a32a9c89a4a1f993af324af129920fd37c16d1a7a91e21fb18dd2709ef533e964cf1bdecece607fab48964a8cffbc712431b6aaa116ac4932c439d2a260d13dc91150dd4868071306b046d84c2203579559213b822744359416f0a24877632cf9c0b205a1419b9eec6dafeef444d14fe5b31e5567a554372d84de6ebced010c716432b0407bea3d64da316d993c84584f1135c0f58ee3d5648b3f7bcd8869bfd30b2a6ef6f313dae3eab6ed4eeb3ea3eabeeb3ea866e9f5517be3bd5bd4073ead2222a537ec644b3652c53c6b2249e2193d931216ea3f216327050e29e2bc0632a405cfaa6cac040d0e3d9392582a19b61219c1089119998ee24be1ec441511caf7e532847c5f149563e9020d32932962433d3644ea24453653c5966a44b9830f1941cdaef71e17c92748c09e8b7916840486724eba3c4f451723ad608cc17d5017ce3c23a790c3c17aafcf6a3e0634e0a1eee1f65668fd9604d815839e4a5b794a76f9d765e9b1d1ff03b02e14759089a6176ce0afc761c53918de038e750fdfa7818b1c6ce385e83b34bd49ae65f676012b861fa05dbd759e70de374afe57b9b81923cb261f45712462fd12cb3b8ab70978684606f8e4af6cf2d0e34bbfd68ea589aa944635a2966b697f62b478f4fe4b4326ba1d87fb4e17a0c15c97ec31e2cbb22d29fdcc5cda5cd1a6986ca0be9a0098b30be12fb0f308699ba15babca3798e0a2ed0744baa9f921fd64c03d34041bb2e0a34aa4d675a739d00fc252a48298715e31988ca40691fd31bfb77e78c1ab85a1b234f160b5ddf4a98b8fe31b8f5128402c1e18aa9345929442e324c389a4378d18c8acc5a30952e5e2600e74281b181d7311fc2b689add2e84a0a950c6e710b9fb4c494d1e2d52d6e3f811160509b7a44177258b1c2a0d2c9df3bf4c906956e20fa29394a8e76f70daa52bf5f5da2dab0d4011d86e9c62c763352c10d4dbb6f00db7d6fb79a604959d190c4202d7fd99b233d0a162c45ae3166ed54d2748d70dc060b402a557462bcbbbb4ba81b9508952f1a5b7af1fbf2edbb3f2edfbd3a4e8e92b5290be2516cc77b2b97eed120edafaedba94e4489a466ddf93eb89068165f5c3e3f74d790fbaf48755596d41dc8c8b9259c6d146eb6b03ceba687c7e53fd1548a3b2e339e17b5b274865b1d7081ba62627d5ea0f975bbcc7a7241152dd1b2a15d6dfd1b6800eadae4bf4eaa9b1b6ad6138ab83cb32a6817670428177ff89ab6ed556c9f16bc0194452d632b5a68ff69fd3936d6a7fda070650378b1d87fc65d345f6f17f59a867ba9f67ff7ed432307571691de6b89803d513c079834e651a196c212d85796e3a3a350383de47595a6a8f5aa2aa0e5850fbd4d5de426861f95b260a99bb5f8acbd923f8dfff41e788da58f43ecdaefd26bdd70e80cb7c26f6660b5e41b5ab00c9667a02bbb700c183fd3d79b495f1768800b032b51f1d95ec2de21a86056c57458c0fa055236aa9774aaf9e6b85781e7ce4c4552ddee27b7057197267d639d6ab22fde1e32ef36a8b666cd78dea8ee5654b5507774e4dea0e2b43813a9d79bf5c3edc8cb703d3def2a7db4230ae2ef9fde7c83a72ee56ca96bdb0ba1dc868e1aad74a7c1f36dbedf25af6e50e98f1e06646cb18d298baf7f1e1d0452870d5abde3d110e6b86fbaaa5d2331b88396e5070f07ff03c8237584ab230000",
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
            date: "Fri, 16 Jan 2026 10:02:15 GMT",
            etag: 'W/"ed1946f9fcd17379996a01bb64cdd69129a8308726fc483cfdff40ddccc88c6e"',
            expires: "Fri, 16 Jan 2026 10:07:15 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "a359836ae84f226f611fa738c6b857794def3759",
            "x-frame-options": "deny",
            "x-github-request-id": "8398:365968:1B00A:2C72A:696A0CA7",
            "x-served-by": "cache-lhr-egll1980090-LHR",
            "x-timer": "S1768557735.472544,VS0,VE137",
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
        "./test/mocks/inputs/servers/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-server-tests/root/multiple.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      const spy = sinon.spy(OpenAPI.prototype, "buildOperation");

      try {
        await arazzo.runWorkflows(inputFile);

        expect(spy.returnValues[0]).not.be.an("array");
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }

      spy.restore();
    });

    it(`should only use one server when there is a single server`, async function () {
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/servers/root/single.json",
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
        "./test/mocks/inputs/servers/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-server-tests/root/single.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      const spy = sinon.spy(OpenAPI.prototype, "buildOperation");

      try {
        await arazzo.runWorkflows(inputFile);

        expect(spy.returnValues[0]).not.be.an("array");
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }

      spy.restore();
    });

    it(`should only use one server when there is a single server with default variables`, async function () {
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/servers/root/variable-default.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed59c16edc3610bdfb2b064c0f0de0685d27e8c1a7ba710c2c5a34469d1c0ad768686976c544225972b4f6d6f0bf17a4b4bb1245491bc79700ded34a2267868f6fe60da5fb0300a6344aae053b01f63a394a5eb343773755a5561225597602f7070000cca639967c77c30d33c8092f905a370118ad353a83eae633a6e42d364fb4511a0d09b49d19ce14275c2ab30eee8f591bb7e89f8a2c72b7655348c2259ac0a81fb250a6e4d40cfaf90d0b463c845398e4258e7bb364845cf62c75ae03bbecae2c620b6b9cb1b71bd8ba465a571d83f120c3008310f08e97baf00332b55c0a6483e675ae487d34457f33b63eb8317c1dba1084657403c7a0fb4aa836b1f5369bdd1aae353aaa90a9704f24892f9f7c95518a4f917c98e67b117d9aea11b28fd17d92f021e563c914dfcbd66e7ee04f9b48c443de3f961896385523d4882759863635429350d29315096a432024508e604919eca5a6ac4a7602578cafb828f84d81ecd04d96997701ccaa2263d7ed58b7ff5b513383ff56c2f8955ed5901cb693f9ba35b48fe31643270407a1a3ad9b462db227918b08e327b8de6379f0d820cfdecb62dddfec8791357d7f8be970f55975a3769f55f759759f55b7eff65975e1bb53dd0ba4539f1651990a33269a2d6399329625f10c99cc8e09711b95b73e030725eeb9023ca602c4a56faa0c0c043d9e9d5322d877332c841322312213d39dc4d78338288ae3d56f0ae5a8383ec9ca0712643a45c69264cf34d92751a2a9329e2c7ba44b3f61e22939b4dfe3c2f924e91813d06f23d18090ee91ac8f12d347c9e95823b0bfa80ee01b17d6c963e0b932e5b71f051f73520870ffa83377cc06670ad4c223af83a53c7debb4f1daecf880df11083fea42f10cb37351e0b7e398aa6c04c77d0ed5af8f87116bec8ce33538bb446bf9f2eb0c4c02374cbfdef6b5d6792324df69f9ce664f491ed930862be947af91e659dc557f97868460678e6bf1cf171c6876bbd1d4b1345399c5b43282d697ee2b47874fecb4a25c19f11f6fb81e43458bdfb003cba6887427b771f3699323cfd004211d34613121176af7018604d5add0e52d5f2ed1c00552bba48629f921171684050ed6775160d1ac5ad39aeb04e02f5541ca252c84cc405504a57bcc6fdcdf8d334e709513e993d9ccd6b712a1ae7fecdd7a09ca809270254c9a2c0ca254192612e9105e34a322b366c2a4b39709c0b932402ef03ae6435837b155167d49e15ac0175cc327ab3115bc78f505d79f8014105aaa47b421878528088d4dfedea0cf56686c03d14fc95172b4b94f684afb7e71896625520f743f4c3f66b699912a493c6dbf01dceefb76ab19965c140d490879f9cbce1ceb50b010294a8b316ba79aa739c2f13658005699a215e3eded6dc2fda84499e5acb16567bfcfdfbefbe3f2ddabe3e428c9a92c5840b10def9d5cfa4783b4bfbade4ef522ca34a7bcf57d70a69166f73e9f1fda6b5886af486d5596dc1fc8d8b9239c6b146ed6303f6ba747c0e53f912a233d97855c16b5b2b4863b1df081fa62e27c5e20fdba9e671db9e08697e8d8b05d6dfd1b6800eada14be4eaa9b1b4ef98422cecf9c0abac59102e3e3efbfa6ddf62aae4febbd01d4452d630b5ed8f069fd3936d6a7fd6070e1027831db7dc69d355f6f67f59a867ba9edfff6db87460eae1c229dd7123df644f11c60d2984783562b47e050598e8f8efac219206fab34456b1755015b5e84d0bbd4454931fcb8d68548fdacd9671b94fc69fca7f720682c431c62d761975eeb864767b8157eb3075673b9e285c8607e06b6720bc71ee3f7f4f566d2d705124845b05095dcdb4bbf77e85530a762b65fc0ba055237aa97b4aaf9fd0db778c1297fd895d51537c29d4182fe673332e463860b5e15be25591d471a9da0666e32a91b69abe0ec0209c07bb742b3a65cc86523cc6b55d55ade929a3b42237971a6d220fc2e162d051a2eb9e7ed6620da34f5e2ef1ef04283a73e2b5d35dc7620caf83d1f355ad9560f18da7cbfc96fdba0d21d3d0cc8d8621b530edff0c83a08a4edf770f58e4743d8c77dd3786d7a8dc11d748970f070f03fe0a5c7a8ce230000",
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
            date: "Fri, 16 Jan 2026 10:51:09 GMT",
            etag: 'W/"4d429ad3bb851cef0ed46129e1229536f3de7d4eacb61efd3107482f4a2ae97a"',
            expires: "Fri, 16 Jan 2026 10:56:09 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "dcd621a01861210fc0c718bcd13eb8ae0005e01b",
            "x-frame-options": "deny",
            "x-github-request-id": "5296:7620:31D8A:54A78:696A181D",
            "x-served-by": "cache-lhr-egll1980057-LHR",
            "x-timer": "S1768560670.854802,VS0,VE129",
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
        "./test/mocks/inputs/servers/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-server-tests/root/variable-default.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      const spy = sinon.spy(OpenAPI.prototype, "buildOperation");

      try {
        await arazzo.runWorkflows(inputFile);

        expect(spy.returnValues[0]).not.be.an("array");
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }

      spy.restore();
    });

    xit(`should only use one server when there is a single server with enum variables`, async function () {
      // nock.recorder.rec();
      nock("https://raw.githubusercontent.com:443", {
        encodedQueryParams: true,
      })
        .get(
          "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/servers/root/variable-enum.json",
        )
        .reply(
          200,
          [
            "1f8b0800000000000013ed59516fdb36107ecfaf20d83dac402a7949300c795ad63480b1610d9af661c8829591ce365b89e4c893532fc87f1f48c9324551929be6a540fc6449e4ddf1e377f71da5fb0342a8542098e2f494d0e364961cd3437b3793a59202041a7a4aee0f0821849a6c0525dbddb0c33430844b40ef262114370aac4179fb093274169b274a4b051a3998ce0c6b8a212ca5de04f7c7ac8d5b744f791eb9ebd9e40261093a30ea862ca42e1936837e3ea1c18887700a15ac84716f063517cb9ea5ce7560977e298bd8c21a67f4f516b6ae11efaa63301e64186010027c61a52adc805c2e971ce8a079b592283fe8a2bf19ad0fa635db842e384219ddc031e8be12aa6d6cbdcda6779a2905962aa82bd8134964cb275f6594e253241fa6f95e449fa67a84ec63749f247c48f95832c5f7d2dbcdf7ec69130959c8fbc712c320c36a841af124cbc1649a2be45238b20292da10e182e00a8841a9a1979aa22ae929b9a66ccd78c16e0ba08776b2c89d0b428d2c727ae3c7dafef7a2a61afeadb8762bbdae2139f493f9c61bdac7b1c5d00ac141e8a875d3a845fe24721161fc04d77b2c0f1e6b60f95b516cfa9bfd30b2a6ef6f311dae3eab6ed4eeb3ea3eabeeb3eaf6dd3eab2ef9ee54f712f0cca54554a6c28c8966cb58a68c65493c4326b36342dc46e5adcfc041897bae008fa90071e99b2a0303418f67e79408f6dd0c0be184488cc8c47427f1f5200e8ae278f59b42392a8e4fb2f28104994e91b124d9334df6499468aa8c27cb1ee9d24f98784a0eedf7b8703e493ac604f4db483420a47b24eba3c4f451723ad608ec2faa03f8c68575f218782175f9ed47c1c79c1402dc3fa8dc1eb3893545e4c221af82a53c7debb4f5daecf880df11083fa842b21cf20b5ec0b7e398c97c04c77d0ed5c747c3883576c6f11a9c5d82316cf9750626811ba65f6ffbbc75de72c1765abeb3d9539247368ce14afad12bc0791e77d5dfa52121d899638afff319069add6e34752ccd546a20ab34c7cd95fdcad1e1133dab702535ff8f355c8fa1a2f8efd081655b44ba937ddc5cdaac80e5a083900e9ab028170bb9fb00831ceb56e8ea8e2d97a0c925a05f52c3947cbfe28670431831ae8b2206f4da9bd65c2784fc252b923141165ce44456484afb98dddabf5b670cc9f50a519da6a9a96f255cdefcd8bbf592484da420d75c67c9420308994322000fc98b66546456ca7596be4c08b9909aa00dbc8ef9906c9ad82a03aea430c5c967d8908f4641c659f1ea336c3e129404c1603dc2879c2c7881a04df2f7167dba066d1a887e4a66c96c7b1f4197e6ede20af49a670ee87e986e4cba9d9149812cf3df00b6fbde6e358592f1a22109022b7fdd99a31d0a163c03612066ed4cb16c05e4a80d96105ae9c28bf1eeee2e616e5422f5326d6c99f48ff9eb377f5ebd797594cc921596050d28b6e5bd954bf76890f6d737ed5427a254315c79df07530598debb7c7ef0d7b00c5f919aaa2c993b90d10b4b38db28dc6ec8fcdc4f8f80cbef002b2d1c97b95816b5b278c3ad0eb8405d31b13e2f017fdbccf38e5c30cd4ab06c68575bff061a80ba3685af93eae686e16a4211e7e75605ede25012ede2efbfa66d7b15dba7f5de00aaa296b1052b4cf8b4fe1c1bebd37ed0b0b001bc48779f71d3e6eb6d5aaf69b8976afffb6f1f1a39b8b688745e4bf4d813c5738049631e3518252d814365399acdfac219206faa2c03631655415a5e84d0dbd4058131fc985205cfdcacf493094afe34fed37b103496210eb1ebb04baf75c3a133dc0a9fec81d55cac59c173323f27a6b20b871ee3f7f47532e9eb1290088964212bb1b7977eefd0ab6056c54cbf80750ba46a542fd995df7b25353ea4f7b7ccc025c3d5c3aeb8ae99e6f624127441db91212b7358b0aa708dc9daeb1bfd977dd65738ad3df9fc32b3a7949393e3e07ce2d9b50f47b0a84bf23651bb4078f56cb7c2606fdeac416f70c5c5b2d1fd8dacea56c153b22f085ab0e25c66012e5da83d811baee8177eaf11edc97af177cf8fa1c13397f4b6d8b60d8ed48e52a3462be3b598a1cdb7dbf2611a54baa38701195b6c63cae21b9e88078134fd16b1def16808fbb86ffaba6d2b33b88336cf0e1e0efe07d45302252d240000",
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
            date: "Fri, 16 Jan 2026 11:17:09 GMT",
            etag: 'W/"d58541518df7f0ef287c1560ab481468c9865b3c298389b1d65c880024843f9d"',
            expires: "Fri, 16 Jan 2026 11:22:09 GMT",
            "source-age": "0",
            "strict-transport-security": "max-age=31536000",
            vary: "Authorization,Accept-Encoding",
            via: "1.1 varnish",
            "x-cache": "MISS",
            "x-cache-hits": "0",
            "x-content-type-options": "nosniff",
            "x-fastly-request-id": "dc52b83248fe2084ce0fd26874832664484d7394",
            "x-frame-options": "deny",
            "x-github-request-id": "77D4:365968:3D9FD:69ACC:696A1E34",
            "x-served-by": "cache-lhr-egll1980048-LHR",
            "x-timer": "S1768562229.957390,VS0,VE124",
            "x-xss-protection": "1; mode=block",
          },
        );

      nock("http://petstore.swagger.io:443", { encodedQueryParams: true })
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
        "./test/mocks/inputs/servers/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-server-tests/root/variable-enum.json",
        "arazzo",
        { logger: logger },
        docFactory,
      );
      arazzo.setMainArazzo();

      const spy = sinon.spy(OpenAPI.prototype, "buildOperation");

      try {
        await arazzo.runWorkflows(inputFile);

        expect(spy.returnValues[0]).not.be.an("array");
      } catch (err) {
        console.error(err);
        expect(err).to.not.be.instanceOf(Error);
      }

      spy.restore();
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
