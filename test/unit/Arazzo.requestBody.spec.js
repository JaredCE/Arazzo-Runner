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

describe(`OpenAPI Request Body Types`, function () {
  const logger = new Logger();

  describe(`application/json`, function () {
    it(`handles a body`, async function () {
      nock('https://raw.githubusercontent.com:443', { "encodedQueryParams": true })
        .get('/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/request-bodies/application-json/body.json')
        .reply(200, ["1f8b0800000000000013ed594d6fdc3610bdfb570c981e1a20d13a4eda834f75d318085a34019c1c0ad768686976978944b224b5f626c87f2f446977297e69fd7129b03e792972387c336fde48fc76044084444e2523a7405e16c7c54bf2ac1b2d452305476e3439856f47000044974b6ce86ea09ba6901a7c8fc6190420662db13328ae3f6369acc5e1895442a2320cf56845678a1a5c08b5f6c673d6f216ed535645461d9b8c1b5ca0f28cda2973a11a6a86493fbf22de8ceffe12c26983f9ddb4518c2f024ba3df9e5d72dbd4b1830d9b91d71bd8c6469c5f238371277d073d17f09636b2b6132ab158302449f372298cf8a8ea3018db3da85274ed6fc10c36d100e6a0bb23541bdf8260931b45a5c42e558c6a714f240d5d3cfa29a3293e95e4e934df2bd1a7533d92ecb9749f4c783fe563648ac7d289e607fab84432d4cffbfb268636d4b499d48893ac425d2a260d13dc262b1ae80d01e3609608da0885013579db9053b8f41da72bca6a7a5dfb0bba5c425e85fb777e8bba1a437ae59e71fbbf735aa2f0df96298b90eb438f6aa2326c47af1c436174b691e9e465b7f991e7c4a041d5a388508447130c0ab8e33d5648ab77bc5e8729f43d73a6ffdf6146b13e6879d4ee41cb0f5a7ed0f270db8396c341cb61d0bd334bb6a8f8f93c8c7230c7bf1cf7e2bc9be4dc8464664533cceba4701eeaca7dea4a5c50a78a4bc2e93ce7a7a435dc262daf13d293119fe9fee4ee2026a5365f53a7508e4aeea39c3c4190698ae448b2274df6214a942a79b2ec41979030714aa6e29d97e347a1634c961f96440979de83acf792e8b44867653a23d451a91e8b75ae3d4948764cb4e3b23d12ee440ce3e23df9027b2e54f3f097d8fbbce378b1fd28abee030174a640cc6d74a57794c76ffa36bb0e5995d83703e147590b5a6175ce6a7c388ea5a83238eef339e0e5491ab1c14e1eafe4ea06b5a68bbb1998042e9d7e41f89c735e334e77fdc2ce66a056f76c4afd9384de4b346fabf85661945262b3334725fbe70b261aeab137bd2fc352a2b16c1533eb8beed667944fe4ac354ba1d8573ae47a0c15c97ec7112c9b22325eece26669b3445aa1f25c3a1adc228ccfc5ee42ca30d3b75b173774b14005efd1b865dba7e48725d3c03450d0b653038d6ae52c1b7e17007f89164aca61ce7805a235d0748fe975f7ef66336ae072698c3c9dcd743f543071f56330f4148402c1e192a9b2982b442e2a2c389a67f0649815593563aa9c3d2d00ce8502d339defbfc0cd6836fad465b52a864f005d7f0494b2c19ad9f7fc1f52730020c6ad3cf70218739ab0d2a5dfcbd419fac50e901a217c57171bc1937a81afd6e7e816ac54a0b74e8a69d33dbac280537b474bf5d6ee3be0d35c186b27a481283b4f965678e8c52b06625728d316b6792964b8493adb300a455b5e3e3cdcd4d41edac42a8c56cb0a5677fbc7dfde6cf8b37cf4f8ae362699a9a7829b6c9fbada426d3fef26abbd48a2891d42c9dfbd2991c7dc5255268efabae6e9b86dab73d7256554081e34d2711367a911ec44f68f75157f8ad67b67a105ad92fe2ae3650451bec426f7d779e0cc56df4d23f122a7772804fffe755ee04562eab7dc35d2f83dafc2a2afff5d73ff67b34d06b1f982535c0112bdd61768d40ab0aab147ee38ea9eb36c79fad0537c84da84354ca9a95f62cb3cfdaab791b5ceced78bc01fe41e1bc73fcc96c77af3e1baed367bb3bf47ceb1b57bf11805a8a2ec77df84e8e5f84678a603adca4f85d400a96fd80c943b31f3855049dc81b49f655a117168b4dba9f7e75fcd324526ff98ad6ac02c6651bdc60a47609053f283b9df4e8b0ea8cab9a1ca4aa704af0ea6457c3fa42342274503ba55317fcc3bd59a15a9b25e38b41edd6a2ed05d2a9dfb70615a7f56fa2f47aa2b1af4e594f97b0735761a39d48e0ff98d5bec1b3b2446dabc156d685b231c91a6db5d358f936df6d6aab1e5019cf4e03923bec60aac337a8f3292075d818f5118fbab0cff64337b311f06404bb443dfa7ef41f719a9f5f33240000"], {
          'accept-ranges': 'bytes',
          'access-control-allow-origin': '*',
          'cache-control': 'max-age=300',
          connection: 'keep-alive',
          'content-encoding': 'gzip',
          'content-length': '1462',
          'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
          'content-type': 'text/plain; charset=utf-8',
          'cross-origin-resource-policy': 'cross-origin',
          date: 'Fri, 23 Jan 2026 18:07:50 GMT',
          etag: 'W/"77f8130554c46524073e5657c3c235fc5c555fafce4bafa6e52bc3b3cd0bef20"',
          expires: 'Fri, 23 Jan 2026 18:12:50 GMT',
          'source-age': '0',
          'strict-transport-security': 'max-age=31536000',
          vary: 'Authorization,Accept-Encoding',
          via: '1.1 varnish',
          'x-cache': 'MISS',
          'x-cache-hits': '0',
          'x-content-type-options': 'nosniff',
          'x-fastly-request-id': '214b12da7c50cd1e6a306021663b6bb162ceaebe',
          'x-frame-options': 'deny',
          'x-github-request-id': '64AF:36D053:29CA84:4DEBFE:6973B8F6',
          'x-served-by': 'cache-lhr-egll1980066-LHR',
          'x-timer': 'S1769191671.596314,VS0,VE142',
          'x-xss-protection': '1; mode=block'
        });

      nock('http://petstore.swagger.io:80', { "encodedQueryParams": true, reqheaders: { 'content-type': 'application/json' } })
        .post('/v2/pet', { "category": { "id": 1, "name": "mammal" }, "name": "pooch", "photoUrls": ["https://google.com"], "tags": [{ "id": 1, "name": "dog" }], "status": "pending" })
        .reply(200, { id: 1 }, {
          'access-control-allow-headers': 'Content-Type, api_key, Authorization',
          'access-control-allow-methods': 'GET, POST, DELETE, PUT',
          'access-control-allow-origin': '*',
          connection: 'keep-alive',
          'content-length': '102',
          'content-type': 'application/json',
          date: 'Fri, 23 Jan 2026 18:07:51 GMT',
          server: 'Jetty(9.2.9.v20150224)'
        });

      const inputFile = new Input(
        "./test/mocks/inputs/request-bodies/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-requestBody-tests/application-json.json",
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

  describe(`application/xml`, function () {
    it(`handles a body`, async function () {
      // nock.recorder.rec();
      nock('https://raw.githubusercontent.com:443', { "encodedQueryParams": true })
        .get('/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/request-bodies/application-xml/body.json')
        .reply(200, ["1f8b0800000000000013ed5a4b6fdc3610befb57104a0f0de0685d27edc1a7ba490c182d9a004e5014aed170a5d95dd612c992a3b5b781ff7b413d76293e24f9910605f6e695c8e13cbe996f86f2e7034212218153c9921392bc4c8fd297c9a1799a89520a0e1c7572423e1f104248a2b3159474f7c02c534011de035a0f09497023c10814f3bf20c35a62fb462a21412103dddb61445184a5501be7f990b46189f55b96079e5a32194758827284d64b16429514db453fbc4a9c1577ee9684d312864fd3a8185f7a927abf1db9c96d59840c6b0f4b5e776eeb0bb17ef504869574157454805b5acaa25e908be5924112152f5702c54755f8c1d89e4195a21bf7088650060338e4ba7bbaaad3cd0b7672a3a89460a082aa82899e44ba7c722b83101f03791ce693803e0ef500d887e03e0a7817f2a1640ac7d28ae607fab48984d4c5fd4381a1916235008d7092e5a033c52432c16bb002924610619ce00a8846a1c04b4d5e95c909b97415a76bca0a3a2fdc0d064bc073ff7ca3b728f2be4baf6c1bb77f5bd6260afeae98aa3d64ebd078355219b64faf2c417e74b69131f4b23bfcc051a2e5a0fc49482890472319e4e58ef35a01cddff162e343e86ec0a6ff9f31bd58efb93c2877cfe57b2edf73b97fec9ecbc99ecb49cb7ba775b205c9cfcdc3600e0ee5df50ee85f36e34e746287390347d5c4789735f571e5257c2843a565c224a0fe7fc18b5fac7c4e975847a06c867bc3fb9bf13a3543b5c53c7bc1ca4dc27b13c9220e32932942413d3644aa2045365385926a48b9f30e1948cc57b988e9f241d43b4fc381045e87942b23e88a2e3243d48d303441da4ea3e590fb52711ca0e917698b67bc41d896198bc4707d833a1cac70fb10f99719cd87e94b9b920204614118b3abad231e5e99bbeeed416559173075cf8511682e6909fb1021eefc74ce4037e9c721df0f238eeb156ceb0bfa2bb4bd09a2eef2760d47171f879e1b3ec9c334e77fdc24ea6c7560f6c4a5d4b7ced25e0791e3eca8f528c6c76e2a8647f5e43a4a1ee6bd3d3e18d62fcfaeba4efc870971bcd7ef5cb5bbb444b9ad5eb5688f26436d312e83550bd49e754cdba6f5881ee1916ecb656caeddba2b8657ca92067bdaf649e8df7bb3cf846c1c2ec7a36db7d81eb949e9d6fcf7bd4dd89adf6c894fc153c3c901a96fd5ff4729457e5dc2f8693bd7a9e7f39647a6f29a262f30ae17ef71a5f202f770e98909ce43fc2ce81657aa221ab14c3cd8539a60789e4b4c29550ec1fdad277a8d04bf633f42a7d67797fb34d057527b0029a834afa2a1db46a258c2fc4ee1b3b326c26c88b1bba5c8222ef01ed4ed4ed323eac98264c134a743d7c120d6a6d6d6b7fa784fc2e2a92514e168ce74454484af39acecd9fdd6114c9651798e651cac4d5b7dea3e744282238b9642a4b170a808b1c520e78489eb5ab02bb664c65b3e72921674211348a373a1f924dab5ba5a1ee92a864e41a36e4939690315abcb886cd27828220686c56d82e270b5620289dfed1793f5983d2ad8bbe4b8fd2a3ee39822af5bbc505a835eb27e34ecd7acdacdb91098e34b32bce36eedb5027505256b42041a0e58f3b71490f8205cb806b08493b95345b0139de2a4b4852a9c2d2f1e6e626a5f5aa54a8e5ac95a567bf9cbf7efbebc5db17c7e951bac2b2481c8875b8df4e0951d85f5e6db7d673412229aeac7f019949c0d9e7ba45b9b36d90423b3559576549eb8bacb61336183553963d5e911b862b627a189253a476ea3838b75f99925e2b5cf74949558b7f0ff81bc355ddf5d90440152dc180c3199122234ed37db96cdd8c881457233dfff91bd3e71b2b5110055829eeeeb026369f60db7fb1b97763d0683da12edab7b46d4bdbbbeaed8d27f6620f42412f46e034a485f10768fc49e4eea5a7e35c5e15456cf65dd042f75c5967addb2790a61f9605cb6a056711428b066142189ab6d9d977372132fd8b782d85c96cd723af8ebef72d7231c8d7b46039615c56de07d6868a6ab99388d32a218646b45f41fa154ab6b4935ae5747dbcab474d51e921cfab830683db02e818f7760d6a832bc6972d736d44d5909d558b6f1114a7c51b9139235b5f57ab44c7ebce99cd960e851f86f5ef5f1cb9024fb30cb436f5614bd142d53119145a69ab217565beeb0aa26ebdd25f1d77c890b1ad28e35ff72a2cea48ed37394dc4832a4c39beed4c3a328e46d000f5e0eee05f771bac18d2280000"], {
          'accept-ranges': 'bytes',
          'access-control-allow-origin': '*',
          'cache-control': 'max-age=300',
          connection: 'keep-alive',
          'content-encoding': 'gzip',
          'content-length': '1593',
          'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
          'content-type': 'text/plain; charset=utf-8',
          'cross-origin-resource-policy': 'cross-origin',
          date: 'Fri, 23 Jan 2026 18:47:14 GMT',
          etag: 'W/"c19e5f64ab734f8e013e6c963d22c76857f445471daa41d64a22f7fe73cafc73"',
          expires: 'Fri, 23 Jan 2026 18:52:14 GMT',
          'source-age': '0',
          'strict-transport-security': 'max-age=31536000',
          vary: 'Authorization,Accept-Encoding',
          via: '1.1 varnish',
          'x-cache': 'MISS',
          'x-cache-hits': '0',
          'x-content-type-options': 'nosniff',
          'x-fastly-request-id': '1460a4df52a3c24b5430ced58451ddd988c4f34d',
          'x-frame-options': 'deny',
          'x-github-request-id': '5157:1E520A:2B4199:504413:6973C232',
          'x-served-by': 'cache-lhr-egll1980057-LHR',
          'x-timer': 'S1769194035.835823,VS0,VE122',
          'x-xss-protection': '1; mode=block'
        });

      nock('http://petstore.swagger.io:80', { "encodedQueryParams": true, reqheaders: { 'content-type': 'application/xml; charset=utf-8' } })
        .post('/v2/pet/1', "<?xml version=\"1.0\" encoding=\"UTF-8\"?><root><name>water</name><ingredients><id>1</id><name>water</name></ingredients></root>")
        .reply(200, { id: 1 }, {
          'access-control-allow-headers': 'Content-Type, api_key, Authorization',
          'access-control-allow-methods': 'GET, POST, DELETE, PUT',
          'access-control-allow-origin': '*',
          connection: 'keep-alive',
          'content-type': 'application/json',
          date: 'Fri, 23 Jan 2026 18:47:15 GMT',
          server: 'Jetty(9.2.9.v20150224)',
          'transfer-encoding': 'chunked'
        });

      const inputFile = new Input(
        "./test/mocks/inputs/request-bodies/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-requestBody-tests/application-xml.json",
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

  describe(`application/x-www-form-urlencoded`, function () {
    it(`handles a body as an object`, async function () {
      // nock.recorder.rec();
      nock('https://raw.githubusercontent.com:443', { "encodedQueryParams": true })
        .get('/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/request-bodies/application-x-www-form-urlencoded/body.json')
        .reply(200, ["1f8b0800000000000013ed594d6fdc3610bdfb57104a0f0d106b5d27edc1a7ba490c042d9a004e5014aed1d0d2ec8a8d44b2e468d79bc0ffbd20a5dda5f821ad3f2e05f6b64b91c3e1cc7bf346d4b7234232218153c9b23392bdcc4ff297d90b335a88460a0e1c757646be1d114248a68b0a1aba1b30d31450840f80ce202119ae251883e2e61f28d05aec9f4825242864a0072b8c298ab0106aed8d8f591bb7689fb23232ead8641c6101ca336aa7cc856a28f6937e7a957933eefc2519a70d8cefa65131be082c0dfe7b76b3dba68e1dacdf2c7bbd09dbd088f36f6030eea4efa0e702dcd246d6764229160b0659d2bcac048a4faa0e93b1dd832a45d7fe160ca18926702c74f70cd5c6b720d9d94a5129c14005550b7b4612e9e2c94f1985f814c8d330df0be8d3508f807d0cee9380f7211f23533c974e363fd2a72512521ff70f0586468aed0834e2242b41178a4964825bb00292ce10619c600544a350105093b74d7646ae7cc7e992b29aded4fe028325e065b8bff15bd4e530a4d7ee19b7bf9dd3660afe6d99b211727de8a29aa80cdbd16bc750989d6d668cbcec363ff29ce835a87c12118af06882410177bcc70a68f99ed7eb1042772367faff1d6690eb839647ed1eb4fca0e5072d0fb73d6839396839e975efdc922d2a7e3e0fa31c1ce3df18f7e2bc9be4dc84648e8a6688eba4701eeaca43ea4a5c50a78a4bc2e971ce4f496bb84d5a5e27a467447ca6fb93fb073129b5e335752aca51c97d92932708324d913192ec49937d8812a5ca3859f6a04b4898382553f91e97e327a1634c961f07a2843cef41d60749745aa447657a44a8a3523d14ebb1f62421d931d18ecbf640b813398c8bf7e40bec8550cde35f621ff28ee3e5f6932ccd050131a68898dbec4aef284fdff46d76ed5195d87724849f642d6809e505abe1f1712c443912c77dae035e9ea623d6db198f577275035ad3c5fd0c4c062e0dbf207dce396f18a7bb7e61673350ab0736a5fe4942ef25e0bb32be5598a594d8eccc51c9fefe0289867ae84de74bbf34d350b48ae1fad27cf519e0293b6fb1128a7da53dd6635191ec571884655344868bddb859da54404b509e4b47bd5b19e373b1fb20850cbb76eb7245170b50e403a05bb67d4a7eac98264c134ab4edd48806b57496f5ff7342fe142d29282773c64b225a248d794c6fcccfcd6614c9558528cf6633dd0de54c5c7f1f0c3d274211c1c91553453e57005c949073c017e4593f2bb26ac654317b9e1372211441e378e7f30bb2ee7d6b35d8924225235f604d3e6b0905a3f5f117587f26280882c66e861b7232673582d2f95f9be8674b50ba0fd10ff9497eb21947508d7e3fbf04b564850d74e8a69d33dbac2804475ab87797dbbc6f539d414359dd830481363fefcc650308d6ac00ae2166ed5cd2a20272ba759690ac55b5e3e36ab5caa99d950bb598f5b6f4ecb777afdffe7ef9f6f8343fc92b6ceacc83d806f75b494dc2feea7abbd48a68262956cef7d299049c7db37cbe73cf2085f66e7775db34d4bef5f5b261306a5a12b717212b86153184272545ea52c7c3b9fbc8e88175d81695acb5e63f00fec1b0b225d2550faa6803061c5e3f91e807ba52e5df8b75fd14c56a4220dfbd31a2684e898228c056717f85d3de98d6d06ffeecf7e858f3f79d82b9d9e2d96cf71d7bd67fbe9e755ea71baced6ff74aa3afff837b918196bb93030845a39880d39817261ea0f11751fa37045e70795bd7a946714e6b3d08a5652d700cf5974a59b3c23a38bb3d5ead56c7067ec7adaa819b86227a63924ccb5462363de3f81b40bc091804494b61a8ee87e8d5c98fe1117d50f225ad594918976df079a2d3266b37e14642b63a5dd1614919962cd9eb50eed4d7e5e9ae4075556600c5a0301a506e2ba277b8b74b506bac185ff452b6166da77e4e71be45509cd66f44e1353c435f9d9a9d2e4417ae7c46db8cc0ffe16b976ff0bc28406b5330b69a2d94cdc9a8d1563b5d936ff3fda642ea3e2ac3d9e9808c1db63765e2ebbf482603a9c3aea7cb78d4857db6ef5b958d3a273368807a7477f41f1d9a486610240000"], {
          'accept-ranges': 'bytes',
          'access-control-allow-origin': '*',
          'cache-control': 'max-age=300',
          connection: 'keep-alive',
          'content-encoding': 'gzip',
          'content-length': '1483',
          'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
          'content-type': 'text/plain; charset=utf-8',
          'cross-origin-resource-policy': 'cross-origin',
          date: 'Fri, 23 Jan 2026 19:07:33 GMT',
          etag: 'W/"2a6912fd1a5f4fe66f4eee792852ed17da67ba02d2e61adc4e6545b2d230f932"',
          expires: 'Fri, 23 Jan 2026 19:12:33 GMT',
          'source-age': '0',
          'strict-transport-security': 'max-age=31536000',
          vary: 'Authorization,Accept-Encoding',
          via: '1.1 varnish',
          'x-cache': 'MISS',
          'x-cache-hits': '0',
          'x-content-type-options': 'nosniff',
          'x-fastly-request-id': '435070d4579968b53ae602424d570ec263ee212f',
          'x-frame-options': 'deny',
          'x-github-request-id': '7C04:31EC12:2C2745:519D6A:6973C6F5',
          'x-served-by': 'cache-lhr-egll1980033-LHR',
          'x-timer': 'S1769195253.083830,VS0,VE133',
          'x-xss-protection': '1; mode=block'
        });

      nock('http://petstore.swagger.io:80', { "encodedQueryParams": true, reqheaders: { 'content-type': 'application/x-www-form-urlencoded' } })
        .post('/v2/pet/1', "name=pete&status=pending")
        .reply(200, { id: 1 }, {
          'access-control-allow-headers': 'Content-Type, api_key, Authorization',
          'access-control-allow-methods': 'GET, POST, DELETE, PUT',
          'access-control-allow-origin': '*',
          connection: 'keep-alive',
          'content-type': 'application/json',
          date: 'Fri, 23 Jan 2026 19:07:33 GMT',
          server: 'Jetty(9.2.9.v20150224)',
          'transfer-encoding': 'chunked'
        });

      const inputFile = new Input(
        "./test/mocks/inputs/request-bodies/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-requestBody-tests/application-x-www-form-urlencoded.json",
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

    it(`handles a body as a string`, async function () {
      // nock.recorder.rec();
      nock('https://raw.githubusercontent.com:443', { "encodedQueryParams": true })
        .get('/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/request-bodies/application-x-www-form-urlencoded/body.json')
        .reply(200, ["1f8b0800000000000013ed594d6fdc3610bdfb57104a0f0d106b5d27edc1a7ba490c042d9a004e5014aed1d0d2ec8a8d44b2e468d79bc0ffbd20a5dda5f821ad3f2e05f6b64b91c3e1cc7bf346d4b7234232218153c9b23392bdcc4ff297d90b335a88460a0e1c757646be1d114248a68b0a1aba1b30d31450840f80ce202119ae251883e2e61f28d05aec9f4825242864a0072b8c298ab0106aed8d8f591bb7689fb23232ead8641c6101ca336aa7cc856a28f6937e7a957933eefc2519a70d8cefa65131be082c0dfe7b76b3dba68e1dacdf2c7bbd09dbd088f36f6030eea4efa0e702dcd246d6764229160b0659d2bcac048a4faa0e93b1dd832a45d7fe160ca18926702c74f70cd5c6b720d9d94a5129c14005550b7b4612e9e2c94f1985f814c8d330df0be8d3508f807d0cee9380f7211f23533c974e363fd2a72512521ff70f0586468aed0834e2242b41178a4964825bb00292ce10619c600544a350105093b74d7646ae7cc7e992b29aded4fe028325e065b8bff15bd4e530a4d7ee19b7bf9dd3660afe6d99b211727de8a29aa80cdbd16bc750989d6d668cbcec363ff29ce835a87c12118af06882410177bcc70a68f99ed7eb1042772367faff1d6690eb839647ed1eb4fca0e5072d0fb73d6839396839e975efdc922d2a7e3e0fa31c1ce3df18f7e2bc9be4dc84648e8a6688eba4701eeaca43ea4a5c50a78a4bc2e971ce4f496bb84d5a5e27a467447ca6fb93fb073129b5e335752aca51c97d92932708324d913192ec49937d8812a5ca3859f6a04b4898382553f91e97e327a1634c961f07a2843cef41d60749745aa447657a44a8a3523d14ebb1f62421d931d18ecbf640b813398c8bf7e40bec8550cde35f621ff28ee3e5f6932ccd050131a68898dbec4aef284fdff46d76ed5195d87724849f642d6809e505abe1f1712c443912c77dae035e9ea623d6db198f577275035ad3c5fd0c4c062e0dbf207dce396f18a7bb7e61673350ab0736a5fe4942ef25e0bb32be5598a594d8eccc51c9fefe0289867ae84de74bbf34d350b48ae1fad27cf519e0293b6fb1128a7da53dd6635191ec571884655344868bddb859da54404b509e4b47bd5b19e373b1fb20850cbb76eb7245170b50e403a05bb67d4a7eac98264c134ab4edd48806b57496f5ff7342fe142d29282773c64b225a248d794c6fcccfcd6614c9558528cf6633dd0de54c5c7f1f0c3d274211c1c91553453e57005c949073c017e4593f2bb26ac654317b9e1372211441e378e7f30bb2ee7d6b35d8924225235f604d3e6b0905a3f5f117587f26280882c66e861b7232673582d2f95f9be8674b50ba0fd10ff9497eb21947508d7e3fbf04b564850d74e8a69d33dbac2804475ab87797dbbc6f539d414359dd830481363fefcc650308d6ac00ae2166ed5cd2a20272ba759690ac55b5e3e36ab5caa99d950bb598f5b6f4ecb777afdffe7ef9f6f8343fc92b6ceacc83d806f75b494dc2feea7abbd48a68262956cef7d299049c7db37cbe73cf2085f66e7775db34d4bef5f5b261306a5a12b717212b86153184272545ea52c7c3b9fbc8e88175d81695acb5e63f00fec1b0b225d2550faa6803061c5e3f91e807ba52e5df8b75fd14c56a4220dfbd31a2684e898228c056717f85d3de98d6d06ffeecf7e858f3f79d82b9d9e2d96cf71d7bd67fbe9e755ea71baced6ff74aa3afff837b918196bb93030845a39880d39817261ea0f11751fa37045e70795bd7a946714e6b3d08a5652d700cf5974a59b3c23a38bb3d5ead56c7067ec7adaa819b86227a63924ccb5462363de3f81b40bc091804494b61a8ee87e8d5c98fe1117d50f225ad594918976df079a2d3266b37e14642b63a5dd1614919962cd9eb50eed4d7e5e9ae4075556600c5a0301a506e2ba277b8b74b506bac185ff452b6166da77e4e71be45509cd66f44e1353c435f9d9a9d2e4417ae7c46db8cc0ffe16b976ff0bc28406b5330b69a2d94cdc9a8d1563b5d936ff3fda642ea3e2ac3d9e9808c1db63765e2ebbf482603a9c3aea7cb78d4857db6ef5b958d3a273368807a7477f41f1d9a486610240000"], {
          'accept-ranges': 'bytes',
          'access-control-allow-origin': '*',
          'cache-control': 'max-age=300',
          connection: 'keep-alive',
          'content-encoding': 'gzip',
          'content-length': '1483',
          'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
          'content-type': 'text/plain; charset=utf-8',
          'cross-origin-resource-policy': 'cross-origin',
          date: 'Fri, 23 Jan 2026 19:15:04 GMT',
          etag: 'W/"2a6912fd1a5f4fe66f4eee792852ed17da67ba02d2e61adc4e6545b2d230f932"',
          expires: 'Fri, 23 Jan 2026 19:20:04 GMT',
          'source-age': '0',
          'strict-transport-security': 'max-age=31536000',
          vary: 'Authorization,Accept-Encoding',
          via: '1.1 varnish',
          'x-cache': 'HIT',
          'x-cache-hits': '0',
          'x-content-type-options': 'nosniff',
          'x-fastly-request-id': 'da61c8c9c9fd30d8c20e1a111e2c99295c8282f0',
          'x-frame-options': 'deny',
          'x-github-request-id': '7C04:31EC12:2C2745:519D6A:6973C6F5',
          'x-served-by': 'cache-lhr-egll1980046-LHR',
          'x-timer': 'S1769195704.360711,VS0,VE99',
          'x-xss-protection': '1; mode=block'
        });

      nock('http://petstore.swagger.io:80', { "encodedQueryParams": true, reqheaders: { 'content-type': 'application/x-www-form-urlencoded' } })
        .post('/v2/pet/1', "name=pete&status=pending")
        .reply(200, { "id": 1, "category": { "id": 1, "name": "cat" }, "name": "dog", "photoUrls": [], "tags": [], "status": "sold" }, {
          'access-control-allow-headers': 'Content-Type, api_key, Authorization',
          'access-control-allow-methods': 'GET, POST, DELETE, PUT',
          'access-control-allow-origin': '*',
          connection: 'keep-alive',
          'content-type': 'application/json',
          date: 'Fri, 23 Jan 2026 19:15:04 GMT',
          server: 'Jetty(9.2.9.v20150224)',
          'transfer-encoding': 'chunked'
        });

      const inputFile = new Input(
        "./test/mocks/inputs/request-bodies/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-requestBody-tests/application-x-www-form-urlencoded-string.json",
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

  describe(`multipart/form-data`, function () {
    it(`handles a body`, async function () {
      // nock.recorder.rec();
      nock('https://raw.githubusercontent.com:443', { "encodedQueryParams": true })
        .get('/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/request-bodies/multipart-form-data/body.json')
        .reply(200, ["1f8b0800000000000013ed594d6fdc3610bdfb57104a0f0d104bae53f4e053dd24068c164d002787c2351a5a9add6522892c39b2b309fcdf0b525a2dc52fad9dbd14d8db2e450e876fe6cd1b4adf8e08c9b880960a969d91ec657e92bfcc5ee8d1923782b7d0a2cacec8b7234208c954b982866e07f4340914e11da0354848866b01da20bffd04251a8bc31321b900890cd46485364511965cae9df194b5b445f394558151cb266b1196201da366ca82cb86e230e9979f3367c683bb246b6903e9dd144ad62e3d4b93ff8eddec4b53870e366c96bddac0363562fd9b180c3be93ae8b8005f68236a33a1e2cb25832c6a5eac38f20fb2f68331ee41a5a46b770b86d004039882ee91506d7cf3829ddd4b2a04e85441d9c18e48225deefd94c1149f4bf2789aef94e8f3a91e48f654bacf26bc9bf2213285636945f33ddd2f9190ba79ffd4c45048b14ba446986415a85232818cb7265901496f88b096e00a88422ec1a366db35d919b9761da77794d5f4b67617e85c82b6f2f7d77ef3ba9a427a639f71fc6d9d3693f06fc7a441c8f6a147355219c6d11bcb901f9d31325a5eb69b1f394e0c1a54ed4584023c9a6190c71de7b1045abd6debb59f420f8933fdff0e3389f541cb83760f5a7ed0f28396fbdb1eb49c1cb49c0cba776ec816143f9787410ea6f897e25e9877b39c9b91cca468fa791d15ce435d794a5d090bea5c7189389de6fc9cb4fadbc4e575467a12e233df9f3c1ec4a8d4a66bea1cca41c9ddcbc9230499a7488a243bd26417a204a99226cb0e74f10913a6642cde6939de0b1d43b2fc7d491491e71dc8fa24898e8b7452a613421d94eaa958a7da93886487443b2cdb13e18ec4302cdeb317d80b2e9befbfc43ee58ee3c4f683a8f40b02a24d11be30d115ce51f6dff46d761db22ab26f02c20fa2e6b482ea82d5f0fd3896bc4ae0b8cbeb8097a771c4063b69bca2ab1b508a2e1f676016b8fda4dfc2053fe45714b55bd6d269f791f2db53c42736be2e5afe4e02f0b20a6fe567424cd0b6e6a860ff7c8648d33ef5a6f765589a29283bc9707da5bf2c4dc0cfce3b5c71c9bed2814f215404fb1d26b06c0ad574b18d9ba1e60a6805d271e968702b63ed826f3f7a21c3bea5bbbaa7cb2548f20ed0960697f6ef574c11a60825ca74834481bcb3960dff7342fee21d29694b16acad08ef9034fa31bdd53f379b5124d72b44715614aa1fca19bff9d11b7a4eb824bc25d74c96f94202b4bc82bc057c419e0db302ab0a26cbe2794ec8059704b5e3bdcf2fc87af0ad5360ca16158c7c8635f9a804948cd6c79f61fd912027080afb1936e464c16a04a9f2bf37e8677720d500d14ff9497eb21947908d7abbb80279c74a03b4efa699536c5694bc455adaef47c7b88fa1cea0a1ac1e92048136bf6ecd659314ac5909ad8290b57341cb1590d3d15942b24ed6968ff7f7f73935b3722e97c5604b157f5cbe7af3e7d59be3d3fc245f6153674e8a6df27e94ed68da5fdf8c4b8d506782e2cafa265b08c0e29be1f343d199c277d94c6b6926b872de26abae69a8b96566fd1a45684b985968b1c5496dfb91ae97c6475347062b46a9ecb24a256d402782d39f44fa8bbe2cb9efd9fafe8ce26a46702f5f6b91d58d1c7222013bd9ba2bac7649b79a6e3369be6f879ac91f242cf416cf8aed77f162f81c5ef45ec71bb6f1b7fd8a64a8f593f72c93dec09eeca54b10c548eaa4bcd07880c2df78e5be7170c06dbbba8e359e0b5aab099486a1d0a2af9b4d5723135462a135e5b8a218843b1a88b95058ca9fbe46841579828c125c73d9c5e5f4e4c43f979389aa2b4b506ad1d564e4899b8a318c8c9c8a9a956655f14939eab70b48bbc1347496de6aefa23785ce3947afa506a608aa1199ed7550f925705a62c5a09bb9a50777a7db82da57c5099dbc42ae8935567027566fee40ae71c5dae520bd6bdef56a6d89c91704d9d2fa352f9d066deaaba531f12a7a61cb7db02df2fc9f5e455d83e726d974d11b7b0c2e4d4c92463b657579aecdb79bb455032ad3d9714052871d4c697cddcb751448e577697dc4832eecb2fdd05a6dba89680475a21e3d1cfd0797df3b7a24250000"], {
          'accept-ranges': 'bytes',
          'access-control-allow-origin': '*',
          'cache-control': 'max-age=300',
          connection: 'keep-alive',
          'content-encoding': 'gzip',
          'content-length': '1499',
          'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
          'content-type': 'text/plain; charset=utf-8',
          'cross-origin-resource-policy': 'cross-origin',
          date: 'Fri, 23 Jan 2026 19:24:21 GMT',
          etag: 'W/"4512659d1e12a7ffacc20f48700cfa13c5a24c422f411440f135f387e1905238"',
          expires: 'Fri, 23 Jan 2026 19:29:21 GMT',
          'source-age': '0',
          'strict-transport-security': 'max-age=31536000',
          vary: 'Authorization,Accept-Encoding',
          via: '1.1 varnish',
          'x-cache': 'MISS',
          'x-cache-hits': '0',
          'x-content-type-options': 'nosniff',
          'x-fastly-request-id': '6319c1cf8d4b589114ae7f6feb6008580707f68c',
          'x-frame-options': 'deny',
          'x-github-request-id': '5871:253D51:2C1778:51EC59:6973CAE4',
          'x-served-by': 'cache-lhr-egll1980042-LHR',
          'x-timer': 'S1769196262.822146,VS0,VE130',
          'x-xss-protection': '1; mode=block'
        });

      nock('http://petstore.swagger.io:80', { "encodedQueryParams": true })
        .matchHeader('content-type', /(multipart\/form-data)/)
        .post('/v2/pet/1/uploadImage')
        .reply(200, { id: 1 }, {
          'access-control-allow-headers': 'Content-Type, api_key, Authorization',
          'access-control-allow-methods': 'GET, POST, DELETE, PUT',
          'access-control-allow-origin': '*',
          connection: 'keep-alive',
          'content-length': '102',
          'content-type': 'application/json',
          date: 'Fri, 23 Jan 2026 19:24:22 GMT',
          server: 'Jetty(9.2.9.v20150224)'
        });

      const inputFile = new Input(
        "./test/mocks/inputs/request-bodies/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-requestBody-tests/multipart-form-data.json",
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

  describe(`text/plain`, function () {
    it(`handles a body`, async function () {
      // nock.recorder.rec();
      nock('https://raw.githubusercontent.com:443', { "encodedQueryParams": true })
        .get('/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/request-bodies/text-plain/body.json')
        .reply(200, ["1f8b0800000000000013ed5a5b6fdb36147ef7af20d43dac402a6769b7873c2d6b1b20d8b016488b61c88295968e2d2e12c991474ebc22ff7da02e36c58be45cf630c06fb14c1e9ecbf79def88ced719218990c0a964c929495ea7c7e9ebe4c83ccd442505078e3a39255f67841092e8ac808aee1e98650a28c24740eb2121096e24188362f11764d858ecbe914a4850c8400f761853146125d4c6793e666ddc62f32dcb034f2d9b8c23ac4039469b254ba12a8adda21fde24ce8a7b774bc26905e3a769548caf3c4b83cf8edde4ae2a43817587256ffbb40d8d589f0606c34eba0e3a2ec01dad64d92cc8c56ac520899a978540f159957e31b66750a5e8c63d822154c1028ea5ee81a9ea7df38a9ddc2a2a2518a8a0aa61cf4c225d3d7b9441884f813c0ef3bd803e0df500d8c7e03e097817f22132856b6955f3137d5e22217571ff586068a4588f40234cb21c74a698442678035640d21a228c132c8068140a3c6af2ba4a4ec995eb385d5356d245e96e3058029efbe71bbf45990f537a6dc7b8fddb8a3651f077cd549321db8736ab91ceb07d7a6d19f2abb3ad8c9197dde133c7894e83f26711a1008f2618e471c7f95a01cd3ff072e343e87e24a6ff5f30835a1fb43c68f7a0e5072d3f68b97fec41cbc941cb49a77b670dd982e2e7f230c8c131fe8d712fccbb49ce4d48e6a868fab88e0ae7a1af3ca6af840575aab9449c1ee7fc94b4fac7c4e575427a46c4677a3e797812a3523bde53a7b21c94dc67893c4290698a8c91644f9aec43942055c6c9b2075d7cc2842919abf7b81c3f0b1d43b2fc341045e4790fb23e4aa2e3223d2ad323421d94eaa1588f8d2711c90e897658b607c21da96158bc275f60cf85aa9efe12fb98771ca7b69f656e2e08883145c4b2a9ae744279fea1af3fb54355e4dc91147e96a5a039e4e7ac84a7e73113f9481ef7b90e787d12cf5867673c5fd1dd15684d570f333099b838fcbcf259712e18a7bb796167d353ab470ea56e24bef712f0220f1fe5572926363b7354b23f6f2032500fbd19f8f04e317ef3b05d177ca52067c0ffe3bb2b5e570b1fab13af846cebdc45ee7775b34a4b9a354b0b44793a9f6b09f406a8dea40baae6fd8f5f81b11b96ecaec94b402e28a2628b1ae161af9d8fe97a7b27e0575f1adc149027e4201ea28ffa99157aa221ab15c3cda539660089e4acc64228f60fedba6b888792fd0c0322f6910f37db4c6d1a75013407950c5d9a756e258c2fc5ee275064d80ef897b774b502453e02da83822b029f0aa609d38412ddbc1b100d6a6d6deb3ea784fc2e6a92514e968ce744d4482af3355d983ffbc32892abbe30eda39489eb6fbd472f8950447072c554962e15001739a41cf088bce8560576cd99cae62f5342ce8522681c6f7d3e229bceb75a432362543272031bf2454bc8182d5fddc0e60b41411034b62bec9493252b11944effe8b39fac41e92e45dfa5c7e971ff1c4155fac3f212d49a0dc9b873b35933ef77648223cdec8eb3adfbb6d4095494951d481068f5e3ce5c328060c932e01a42d6ce24cd0a20275b6709496a555a3edededea6b459950ab59a77b6f4fc978bb7ef7fbd7cffea243d4e0baccac481588ffbed101785fdd5f5766b33b625926261fd423f9780f3af8d82dcdb3148a19d9eacebaaa2cd3d4337a8188c9a21d89e7ec92dc38218892139456a53c7c1b9fd9569e98dc38d8c257563fe23e06f0c8b46946d01a08a5660c0e14cb09109b41547f726b69de029161323d9c53b33869928511005582beeeeb0066ad3aeddd78da60186baec370a96e68817f3dd7f4ef4fd72de7abd475fb42fd1ba8963701337981eedc51e8482598cc069cc0b930fd0f893c8dd3b2927b9bc2ecbd8abc992967a90ca86b5ee9cd0460d77389725653c94e568fef7a8403bd038fbeef728caf08a544b6148ed26e3cdf1f77e302efcf89a962c278ccbdafbe9ab55a1c6ee5e9a69750fa320da6f1ec3e6243bc549ad4eba3ed9b5a2b69f0c40e7b54003bf6def73827bbf06b5c182f155275a1b51b73a67b5e13b04c569f94e64ce303df4d5eacef196736e0ba5a3de4761ff87aff4aec1b32c03ad4d6bd8aab3504d4d468dd6da9a455d9b1ffa5ea8bbac0c57c71332166c67cae4d7bda4882652fbf34d5bf1a00bfb1cdf0d25bd0e472b68803abb9ffd0b6903f8aa6c260000"], {
          'accept-ranges': 'bytes',
          'access-control-allow-origin': '*',
          'cache-control': 'max-age=300',
          connection: 'keep-alive',
          'content-encoding': 'gzip',
          'content-length': '1560',
          'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
          'content-type': 'text/plain; charset=utf-8',
          'cross-origin-resource-policy': 'cross-origin',
          date: 'Fri, 23 Jan 2026 19:39:59 GMT',
          etag: 'W/"2dd906cb2a769146808379b3aafb08004e2ffbc9129ac450416962452dbf79fe"',
          expires: 'Fri, 23 Jan 2026 19:44:59 GMT',
          'source-age': '0',
          'strict-transport-security': 'max-age=31536000',
          vary: 'Authorization,Accept-Encoding',
          via: '1.1 varnish',
          'x-cache': 'MISS',
          'x-cache-hits': '0',
          'x-content-type-options': 'nosniff',
          'x-fastly-request-id': '4a92d2cfd5446becd1a43e03eec3d49bf567aa8f',
          'x-frame-options': 'deny',
          'x-github-request-id': 'CA34:36DE1C:2DBAD9:53EA7D:6973CE8E',
          'x-served-by': 'cache-lhr-egll1980040-LHR',
          'x-timer': 'S1769197199.935299,VS0,VE147',
          'x-xss-protection': '1; mode=block'
        });

      nock('http://petstore.swagger.io:80', { "encodedQueryParams": true, reqheaders: { 'content-type': 'text/plain; charset=utf-8' } })
        .post('/v2/pet/1', "Hello World!")
        .reply(200, { id: 1 }, {
          'access-control-allow-headers': 'Content-Type, api_key, Authorization',
          'access-control-allow-methods': 'GET, POST, DELETE, PUT',
          'access-control-allow-origin': '*',
          connection: 'keep-alive',
          'content-type': 'application/json',
          date: 'Fri, 23 Jan 2026 19:41:09 GMT',
          server: 'Jetty(9.2.9.v20150224)',
          'transfer-encoding': 'chunked'
        });

      const inputFile = new Input(
        "./test/mocks/inputs/request-bodies/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-requestBody-tests/text-plain.json",
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

  describe(`text/xml`, function () {
    it(`handles a body`, async function () {
      // nock.recorder.rec();
      nock('https://raw.githubusercontent.com:443', { "encodedQueryParams": true })
        .get('/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/request-bodies/text-xml/body.json')
        .reply(200, ["1f8b0800000000000013ed5a4b6fdc3610befb57104a0f0de0685d27edc1a7ba490c182d9a004e5014aed170a5d9156b8964c9d1dadbc0ffbda0a4dda5f890e4471a14d89b572287f3f866be19ca9f0f084984044e254b4e48f2323d4a5f2687e669262a293870d4c909f97c40082189ce0aa8e8ee8159a68022bc07b41e1292e05a821128e67f41868dc4ee8d5442824206bab7c388a2084ba1d6cef32169c3129bb72c0f3cb564328eb004e5086d962c84aa28768b7e7895382beedc2d09a7150c9fa65131bef424f57e3b7293dbaa0c19d61d96bcdeb8ad2fc4fad5131856d255d051016e6925cb66412e964b064954bc2c048a8faaf483b13d832a45d7ee110ca10a0670c875f774d546372fd8c98da25282810aaa1a267a12e9f2c9ad0c427c0ce471984f02fa38d403601f82fb28e05dc88792291c4b2b9a1fe8d326125217f70f0586468af50034c2499683ce1493c8046fc00a485a4184718205108d4281979abcae921372e92a4e579495745eba1b0c9680e7fef9466f51e67d975ed9366effb6ac4d14fc5d33d578c8d6a1f56aa4326c9f5e5982fce86c2363e86577f881a344c741f9939050208f4632c8cb1de7b5029abfe3e5da87d0dd804dff3f637ab1de737950ee9ecbf75cbee772ffd83d97933d97938ef74e9b640b929f9b87c11c1ccabfa1dc0be7dd68ce8d50e62069fab88e12e7beae3ca4ae840975acb844941ecef9316af58f89d3eb08f50c90cf787f727f2746a976b8a68e793948b94f62792441c65364284926a6c9944409a6ca70b24c48173f61c229198bf7301d3f493a8668f971208ad0f384647d1045c7497a90a607883a48d57db21e6a4f22941d22ed306df7883b12c330798f0eb06742558f1f621f32e338b1fd28737341408c2822164d74a563cad3377d9b533b5445ce1d70e147590a9a437ec64a78bc1f33910ff871ca75c0cbe3b8c73a39c3fe8aeeae406bbabc9f8051c7c5e1e785cfb273ce38ddf50b3b991e5b3db029752df1b59780e779f8283f4a31b2d989a392fd790d9186baaf4d4f87378af1ebaf93be23c35d6e34fbd52f6fdd122d69d6ac2b10e5c96ca625d06ba07a9dcea99a6dbe6105ba6758b0db4629b76f8be296f1a5829cf5be927936deeff2e01b050bb3ebd96cf7056ea3f4ec7c7bdea3ee4e6cb547a6e4afe0e181d4b0ecffa297a3bcaee67e319cecd5f3fccb21d37b4b11159bd708f7bbd7f80279b973c084e424ff11760e2cd3130d59ad18ae2fcc313d4824a7351642b17f6847dfa1422fd9cfd0abf41bcbfb9b6d2a683a8102680e2ae9ab74d0a99530be10bb6fecc8b09d202f6ee872098abc07b43b51b7cbf850304d982694e866f8241ad4cadad6fd4e09f95dd424a39c2c18cf89a89154e6359d9b3f37875124979bc0b48f5226aebef51e3d274211c1c9255359ba50005ce49072c043f2ac5b15d835632a9b3d4f0939138aa051bcd5f990ac3bdd6a0d4d97442523d7b0269fb4848cd1f2c535ac3f1114044163bbc2763959b01241e9f48f8df7931528ddb9e8bbf4283dda3c4750957eb7b800b562fd64dca9d9ac996d76648223cdec8ab38dfb36d4095494951d481068f5e34e5cd28360c932e01a42d24e25cd0a20c75b6509496a555a3adedcdca4b459950ab59c75b2f4ec97f3d76f7fbd78fbe2383d4a0baccac481d806f7db29210afbcbabedd6662e4824c5c2fa179099049c7d6e5a943bdb0629b45393755d55b4b9c8ea3a6183513365d9e315b9615810d3c3909c22b553c7c1b9fdca94f446e1a64f4aea46fc7bc0df18164dd767130055b402030e67448a8c386df7e5b2753b22522c467afef337a6cf3756a2200ab056dcdd614d6c3ec176ff6273efc6a0d57a425db46f69bb96b677d5db1b4fecc51e84825e8cc069480be30fd0f893c8dd4b4fc7b9bc2ecbd8ecbba0a5eeb9b2c95ab74f68ad865b9c45982ceafd09fe6ffb6567dfdd8490f46fe0b51426a55d57bc3afade37c5051f5fd192e58471597b5f565b0e6ae44e624cab7618fed07ee9e89726d9f14d6ad5d1d5f1ae10b5d5a40739af001af06d2b9f63dcdb15a835168c2f3bca5a8bba6539ab08df22284ecb37227366b5beae566d8e179c339b261dee3e0cebdfbf3172059e6619686d0ac3969b856a623228b4d65627eaca7cb7a984baf34a7f75dc2143c676a28c7fdd3bb0a823b5dfddb4110faa30e5f8ae25d9b070348206a8077707ff0274f027adcb280000"], {
          'accept-ranges': 'bytes',
          'access-control-allow-origin': '*',
          'cache-control': 'max-age=300',
          connection: 'keep-alive',
          'content-encoding': 'gzip',
          'content-length': '1589',
          'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
          'content-type': 'text/plain; charset=utf-8',
          'cross-origin-resource-policy': 'cross-origin',
          date: 'Fri, 23 Jan 2026 18:54:05 GMT',
          etag: 'W/"5d08ac342d1de92f3e9acd11261510906565c517e0b256d3a8168b56b82e8a5b"',
          expires: 'Fri, 23 Jan 2026 18:59:05 GMT',
          'source-age': '0',
          'strict-transport-security': 'max-age=31536000',
          vary: 'Authorization,Accept-Encoding',
          via: '1.1 varnish',
          'x-cache': 'MISS',
          'x-cache-hits': '0',
          'x-content-type-options': 'nosniff',
          'x-fastly-request-id': '99ae447f0651d890365034effac52639598e5088',
          'x-frame-options': 'deny',
          'x-github-request-id': '7480:1D3D22:2BA976:50D251:6973C3CA',
          'x-served-by': 'cache-lhr-egll1980090-LHR',
          'x-timer': 'S1769194445.171387,VS0,VE122',
          'x-xss-protection': '1; mode=block'
        });

      nock('http://petstore.swagger.io:80', { "encodedQueryParams": true, reqheaders: { 'content-type': 'text/xml; charset=utf-8' } })
        .post('/v2/pet/1', "<?xml version=\"1.0\" encoding=\"UTF-8\"?><root><name>water</name><ingredients><id>1</id><name>water</name></ingredients></root>")
        .reply(200, { "id": 1, "category": { "id": 1, "name": "cat" }, "name": "dog", "photoUrls": [], "tags": [], "status": "sold" }, {
          'access-control-allow-headers': 'Content-Type, api_key, Authorization',
          'access-control-allow-methods': 'GET, POST, DELETE, PUT',
          'access-control-allow-origin': '*',
          connection: 'keep-alive',
          'content-type': 'application/json',
          date: 'Fri, 23 Jan 2026 18:54:05 GMT',
          server: 'Jetty(9.2.9.v20150224)',
          'transfer-encoding': 'chunked'
        });

      const inputFile = new Input(
        "./test/mocks/inputs/request-bodies/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-requestBody-tests/text-xml.json",
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

  describe(`text/html`, function () {
    it(`handles a body`, async function () {
      // nock.recorder.rec();
      nock('https://raw.githubusercontent.com:443', { "encodedQueryParams": true })
        .get('/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/request-bodies/text-html/body.json')
        .reply(200, ["1f8b0800000000000013ed59df6fdb36107ef75f41a87b588156ced26e0f795ad63640b1612d9016c390052b239d2d2e12c99127276e91ff7d2025db144552ce8f97017eb329f278bcfbbefb4ed4b719219990c0a964d909c95ee547f9abec85192d442305078e3a3b21df66841092e9a28286ee06cc340514e123a0334848866b09c6a0b8fa070ab416fb275209090a19e8c10a638a222c855a7be3296b698bf6292b03a38e4dc61196a03ca376ca42a886623fe9a7d79937e3ce5f9271da407a378d8af1e5c8d2e0bf6737bb6dead0c1facdb2379bb00d8d38ff0606c34efa0e7a2ec02d6d646d279462b9649045cdcb4aa0f8acea7132b67b50a5e8dadf822134c104a64277cf506d7c1b253bbb51544a305041d5c29e9144ba7cf25306213e05f238ccf702fa34d403604fc17d12f03ee443640ae7d2c9e627fab44442eae3fea1c0d048b14d40234cb21274a1984426b8052b20e90c11c6095640340a05236af2b6c94ec885ef385d5156d3abda5f60b004bc1cef6ffc1675390ce9a57bc6ed6fe7b499827f5ba66c845c1fbaa8462ac376f4d23134cece3633465e769bcf3c277a0d2a9f4484023c9a60d0883bde6305b4fcc0ebf51842778933fdff0e33c8f541cb83760f5a7ed0f283968fb73d6839396839e975efd4922d287e3e0f831c4cf12fc5bd30ef263937219949d11ce33a2a9c87baf290ba1216d4a9e212713acdf929691d6f1397d709e94988cf747f72ff2046a5365d53a7a21c94dc2739798420d3144991644f9aec43942055d264d9832e63c2842919cb775a8e9f848e21597e1c8822f2bc07591f24d171914eca7442a883523d14eb547b1291ec906887657b20dc911c86c57bf205f64ca8e6f12fb10f79c7f172fb5996e682801853442c6c76a57794a76ffa36bbf6a88aec9b08e167590b5a4279c66a787c1c0b5126e2b8cf75c0abe378c47a3be978455737a0355ddecfc064e0e2f01ba5cf39e715e374d72fec6c8ed4ea814da97f92b1f712f07d19de6a9ca598d8eccc51c9febe8648433df466e0c35bc5f8f55eab66ceda4c43d12a86eb73f3ad6880c2ecb4c54a28f695f60c09c552b25f6110cc4de9192e76a36dc956012d41792ecd7ab732c61762f7190b19764ddaf90d5d2e41918f806eb1f789fca9629a304d28d1b6bf231ad4ca59d6ffcf09f953b4a4a09c2c182f89689134e631bd323f379b51241715a23c99cf7537943371f9fd68e839118a084e2e982af28502e0a2849c03be20cffa59815573a68af9f39c9033a1081ac73b9f5f9075ef5babc116222a19b98635f9a225148cd62faf61fd85a020081abb196ec8c982d5084ae77f6da29fad40e93e443fe447f9d1661c4135fac3e21cd48a1536d06337ed9cf966452138d2c2bdf1dce67d9bea0c1acaea1e2408b4f979672e1b40b06605700d216ba792161590e3adb38464adaa1d1f6f6e6e726a67e5422de7bd2d3dffedfd9b77bf9fbf7b799c1fe5153675e6416c83fbad1047617f71b95d6aa53793142be72beb5c02cebfd92a70e79e410aeddd09ebb669a87d57ecc5c660d434326e07436e1856c494095252a42e753c9cbb8f8c8a58876d29ca5a6bfe23e01f0c2b5b585dcda18a3660c0e17521912ea22b70fe6d5ad78551ac2664f5fd5b23a5e6942888026c15f757384d916928fd96d17ec50eb58cdf2958982d9ecd775fbfe7fd47ef79e775bc2ddbfe762f427ad518dca60c3a0077f20842c12846e094f2c2c40334fe224aff5ec10b2e6feb3ad65e2e68ad07a1b4ac058e01d5865b9c5b9204821c0dff1e09e83429fd8210ee1106d1d052184efbb1787df4e3f82c3efaf88ad6ac248ccb76f4f5a213216b37e246449f3a01d1e3da31ac4db2179cdc29a4abe35d25eacac90073a30a68d0b72d7ddee1dead40adb1627cd96bd65ab49dcc3955f81641715abf1585d70f0d7d758a73bce29cb93a19ec2746fe0fdfca7c83a745015a9bcab01567a16c4e92465bed3455becd0f9b52a8fba80c67c703923a6c6fcac4d77fcf8c06528fdb9b2ee34117f6d9beef4936321ccda001eaec6ef61f04f674322f240000"], {
          'accept-ranges': 'bytes',
          'access-control-allow-origin': '*',
          'cache-control': 'max-age=300',
          connection: 'keep-alive',
          'content-encoding': 'gzip',
          'content-length': '1475',
          'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
          'content-type': 'text/plain; charset=utf-8',
          'cross-origin-resource-policy': 'cross-origin',
          date: 'Fri, 23 Jan 2026 19:42:56 GMT',
          etag: 'W/"981f0e32166c08974db3848aef9eecced4a853995f3ced6ff803969fd907633e"',
          expires: 'Fri, 23 Jan 2026 19:47:56 GMT',
          'source-age': '0',
          'strict-transport-security': 'max-age=31536000',
          vary: 'Authorization,Accept-Encoding',
          via: '1.1 varnish',
          'x-cache': 'MISS',
          'x-cache-hits': '0',
          'x-content-type-options': 'nosniff',
          'x-fastly-request-id': '3f071e0bece54c45c81ca84e92507e600dedf169',
          'x-frame-options': 'deny',
          'x-github-request-id': 'BE36:3EC026:2C9221:52D241:6973CF40',
          'x-served-by': 'cache-lhr-egll1980090-LHR',
          'x-timer': 'S1769197377.671029,VS0,VE119',
          'x-xss-protection': '1; mode=block'
        });

      nock('http://petstore.swagger.io:80', { "encodedQueryParams": true, reqheaders: { 'content-type': 'text/html; charset=utf-8' } })
        .post('/v2/pet/1', "<html><body><p>Hello World!</p></body></html>")
        .reply(404, { id: 1 }, {
          'access-control-allow-headers': 'Content-Type, api_key, Authorization',
          'access-control-allow-methods': 'GET, POST, DELETE, PUT',
          'access-control-allow-origin': '*',
          connection: 'keep-alive',
          'content-type': 'application/json',
          date: 'Fri, 23 Jan 2026 19:42:57 GMT',
          server: 'Jetty(9.2.9.v20150224)',
          'transfer-encoding': 'chunked'
        });

      const inputFile = new Input(
        "./test/mocks/inputs/request-bodies/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-requestBody-tests/text-html.json",
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

  describe(`application/octet-stream`, function () {
    it(`handles a body`, async function () {
      // nock.recorder.rec();
      nock('https://raw.githubusercontent.com:443', { "encodedQueryParams": true })
        .get('/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/request-bodies/application-octet-stream/body.json')
        .reply(200, ["1f8b0800000000000013ed594d6fdc3610bdfb57104c0f0de048ae53f4e053dd24068c164d002787c2351a5a9add6522912c39b2bd0dfcdf0b52da5d8a1fd2c6f12580f7b44b91c3e19b37f386ab2f078450a94030c5e909a12f8ba3e2253db4a3956c951420d0d013f2e5801042a8a956d0b2dd809da68121bc03f40609a1b856600dcaeb4f50a1b3383c515a2ad0c8c18c5658530c6129f53a189fb2366dd13de57562d4b3c905c2127460d44d5948dd321c26fdf2330d66dc874ba8602d4cef665073b18c2c8d7e0776e95ddba40e366c465f6d601b1bf17e8d0ca69d0c1d0c5c803bd6aac64da8e572c98166cdab9544f941377130b67b30add93adc8223b4c9004e41f795506d7c8b824d6f35530a2c555077b02792c8968f7eca24c5e7489ea7f95e449fa77a82ec53749f257c48f95432a563e945f33d7bdc444216f2fea1c430c8b09ba0463ac96a3095e60ab9148eac80a43744b820b80262506a885253742d3d219794dd30deb0eb06e8a15d2c6ab705a1463635bdf27ddd7ef7bca61afeedb87627bdec2139f493f9ca9b1ae3b8c5d00ac141b8d1769b412dea47918b04e367b81eb13c78ac81d56f45b38e837d3f71a6efef3023ae3ea96ed2ee93ea3ea9ee93eac6db3ea92ef9ee54f71de0a94b8ba44c851993cc96a94c99ca927486cc66c78cb84dca5bccc0acc43d5580875480b4f4cd95818cd3d3d9392782f13679219c1189099998ef24be1ec4ac284e57bf399493e2f82827cf24c87c8a4c25c99e69b24fa22453653a59f648973861d229998bf7b4703e4a3aa604f4db489411d23d92f54162fa20399d6a04f617d50cbe69619dbd069e49dd7efb55f021378500f70faab6d76c624d11b970c8abe0288fdf3a6d761d229ed97702c20faa91ac86fa8c37f0ed3856b29ec0719f4bf5cbe33c62839d69bcb2ab5b30862dbfcec02c7079fa45e1f3ce79cd05db69f9ce66a4240f6c18c393c4de2bc0f33abd551ca59c10eccc31c5fff90c996677ec4defcbb0941aa83acd717d61df728cf8444f3b5c49cdff6303d753a828fe3b8c60d91491f1621f3797362b6035e8c0a583c12dcac542ee5ec020c7be15bab865cb2568f20ed02fa9614abe5f7143b8218c18d7451103fac65b36fc2e08f94b76a462822cb8a889ec90b4f631bbb65f379b3124972b44755296a61f2ab8bcfa311a7a4ea42652904baeab62a10184aca1108087e4d9302bb1aae4ba2a9f17849c494dd03adefb7c48d6836f9d01575298e2e433acc947a3a0e2ac79f119d61f094a8260b09fe1434e16bc41d0a6f87b833ebd016d06887e2a8e8aa3cd38826ecddbc505e81b5e39a06337dd9c72b3a2920259e5ff03b88dfb36d4145ac69b812408acfd75678e8e28d8f00a848194b553c5aa1590e3adb384d04e379e8fb7b7b70573b30aa997e560cb947f9cbf7af3e7c59b17c7c551b1c2b6a101c536bcb772e91e65697f79b55dea44942a862beffd60a900cb2f2e9fefcbce15a5f3765ce7a89226f8bfd4746dcbdced8cf66b0c618270b7d0cb9680dafe232b01ce475747062b4e457ca5609ab56089b03d68ffc9687f5f96c27f92fabe86e16a460ccf5f5b01b40d104aa2013b2dc2155e9b625bb4b00973ef5a534dd80f1a16768b67e5ee1d6d39bc9a2d7baff38dd2f6bbffd7c250eb7d50e848b7fdc9115d922866a833e585c5030cfe26ebf0a61e802bbaa6c9357c0bd69811942e434160acb54ca98657cec1525608f8c2a006d6a630cf46632e1e9e344ff7e069a91fc16394b4091d82737c74141f2ea0a3e9aa0a8c59740dd9264bc8c71c5001549f4c2081fb80b41f4c43eb17ad8e6e4993d7975e501d4c1954335adb8ba189ebe0b8ceaa413c0b4f146e8e7755b52f8da39c8aaab9cdae6d190f62f5e606f41a575c2c07fd5dcbae976c4f51ee10b460cd6b59055ddad8574f68f2a5f4ccd7fc646f14f93fbec785064f1dd96ce5db361a52bb984c1aed8cd7ea8536df6e686b0654c6b3f3804c1d763065f10d6fa659204ddcaaf5114fbab0cff6437fb56929b211b4443db83ff81f76e48291b5230000"], {
          'accept-ranges': 'bytes',
          'access-control-allow-origin': '*',
          'cache-control': 'max-age=300',
          connection: 'keep-alive',
          'content-encoding': 'gzip',
          'content-length': '1473',
          'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
          'content-type': 'text/plain; charset=utf-8',
          'cross-origin-resource-policy': 'cross-origin',
          date: 'Fri, 23 Jan 2026 19:48:47 GMT',
          etag: 'W/"05b4667c2f33eee64a3bc6f88f1045354d96c9f61e2dd1a35d76ae3e5ec13555"',
          expires: 'Fri, 23 Jan 2026 19:53:47 GMT',
          'source-age': '0',
          'strict-transport-security': 'max-age=31536000',
          vary: 'Authorization,Accept-Encoding',
          via: '1.1 varnish',
          'x-cache': 'MISS',
          'x-cache-hits': '0',
          'x-content-type-options': 'nosniff',
          'x-fastly-request-id': '04691e2a825dcd9b245ffde18b5764553c6e08b9',
          'x-frame-options': 'deny',
          'x-github-request-id': '3E96:253D51:2CA23E:530258:6973D09F',
          'x-served-by': 'cache-lhr-egll1980084-LHR',
          'x-timer': 'S1769197728.538130,VS0,VE290',
          'x-xss-protection': '1; mode=block'
        });

      nock('http://petstore.swagger.io:80', { "encodedQueryParams": true, reqheaders: { 'content-type': 'application/octet-stream' } })
        .post('/v2/pet/1/uploadImage', "SGVsbG8gd29ybGQh")
        .reply(200, { id: 1 }, {
          'access-control-allow-headers': 'Content-Type, api_key, Authorization',
          'access-control-allow-methods': 'GET, POST, DELETE, PUT',
          'access-control-allow-origin': '*',
          connection: 'keep-alive',
          'content-length': '102',
          'content-type': 'application/json',
          date: 'Fri, 23 Jan 2026 19:48:48 GMT',
          server: 'Jetty(9.2.9.v20150224)'
        });

      const inputFile = new Input(
        "./test/mocks/inputs/request-bodies/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-requestBody-tests/application-octet-stream.json",
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

  describe(`unknown`, function () {
    xit(`handles a body`, async function () {
      nock.recorder.rec();
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
        "./test/mocks/inputs/request-bodies/input.json",
        "inputs",
      );

      const arazzo = new Arazzo(
        "./test/mocks/arazzo/openapi-requestBody-tests/other.json",
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
