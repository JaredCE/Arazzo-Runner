'use strict';

const expect = require("chai").expect;
const nock = require("nock");
const sinon = require("sinon");

const docFactory = require("../../src/DocFactory.js");
const Input = require("../../src/Input.js");
const Logger = require("../../src/Logger.js");

const Arazzo = require("../../src/Arazzo.js");

describe(`Arazzo dependsOn`, function () {
    const logger = new Logger();
    const AccessToken =
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ";

    it(`runs a dependsOn workflow first`, async function () {
        nock('https://raw.githubusercontent.com:443', { "encodedQueryParams": true })
            .get('/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/security/api-key/users-openapi.json')
            .reply(200, ["1f8b0800000000000013ed5a5b6fdb36147ecfaf3850f7b00289eca6dd1ef2b4346d8760415b2c29b6212b50463ab6d84aa4461ec5f18afcf781d4c51265c9d724ee9a3c38b6481e9ecb773e9247fcba07e0c914054bb97704de737fe83ff7f6cdd34026a91428487b47f0750f00c0d34184099b3d30dd1432c20f1a55ed298047d3148d4479f51903b2228b9654c9141571d48d11005ea6510996a0f3bc264d93e262ecd51a6ff7eb12465c697abb9188986d2a0113c6e3f587a74ceb8954e10612222936d0df84e19c18656e806a32b8201ca3f2f69bcd23a912464587e7876e73883a503c252e85e9635003c54c756daaef35bdbc9bc4f5a95760c5ca990928875783bdeda093f744641977fcfca2dfe58fc87f44feb6916f0c3ab10c1dee5c022c505bf7eacd9462d3bada9c306969dc69659f9df32d5d686bbfb50ed23a73a517ac75a7f53bd0e0e2d8bae801bcd749668b8c73c1d349692b0aea24b615e5ac1732474827c9ad2a672ed5ad28a487f056067c8bf496a63d07d70da0b5c9af93fe1673ca991c73b10bfbd4b556ba1ee36263d8efa85329346e6ee07110a0d617f20b8a6d697873a018e141cc134ef3152c51d61afae7c1eb9b942bd407c723eadac935b56986bd15abae517bb5b19ec620539ca6e7e6d0d3f091779c512415ff9715c09e47b129ff0d1b1c5b82b639b84ec23647226461cd0b7be5a755cbe3622467e731e2145b99ef913449856033a230c049be8b886be01a186896a4318246758d0aaab1f96f1fe02f9941c0048cb80841660489696657e6ebf9848dc7a880115c4644e9d160a0f3473e971f7f6c3d7a0a52811470c955e08f14a29021fa02691f9e14bde68c1a70150c9efa006fa402328ae73aefc3b4d02dd3081421b094c3179cc2279d62c0597cf005a79f8024106aca7bd4fd0d231e132aedff5dbadebb46a50b173df387feb07c4ea812fd6e748eea9a07d6cb6d356d9f41392290825850877715f42aced522621042c8925f66e2bc06fe621e60339b67104a5910211c56ca1aa0abb8a6e36432f199ede54b351e14b2f4e0ecf4e4f5dbf3d70787fed08f28893d075f25e8bd23b8b44d9d98bffc580dfd6887a68ca25aad6090354f5d5e2ab593f93a4b12a6cc5c5ebed9834c379699b91036d197229ec215422805c2d5d4c63996e33186c02d36945f176378ceea7d6a18b75eb3a8d321532c41030e6b5dad85d858570ea9f1ca8cfbeabd15fe93a1a697329cbabcea9853ec70adbe306f9765447165f7c0a4326cb419b0a1a0363fb3348d7960cd1d7cd6b2cde05521674e0b80f783c291d1eec96056021a14959f41cd75cec8dbbdae5ff34f35aa58ad5a8bcfe1f059dba8791b89a03820387b9a2ec72ce79a7ee72c724ffdbcd51a7cdbef31c78c7c1db0dee9de1dbd18feb4d057a7e29ac5dc24469a91ebacae59da2b79839baca10518fee014b9678d65925d43cc35811c59fc6b98708a60ccaf51e4aa42eb94e218b65486eb4abd53c7fead257c8b33f33f272a1dfce9fa7b3d2639ab79f21b6192d911f5a18944c3c96e3289fe1ea9c440797799c468f748248f44f248243b4a24b153e2e9e78f3339d639d6b93067c608414f3561b21e59d8c91ffe5c6177c7b6d605a65e606a74cd52c34ee6f1ac407777793c5c884c9dd9dad7288ba10aee2ea573b3d2b7bd7c760de9acd775392e6071ac21450591cc14b03896130ccbc3b973b0df86271a1a2e7644ab36dd5756ec323234450a2ee0c3c5094c221440a6460a980bdab281ae82ab06bb87a117e741c9d065fd745096ac416706e3ed456e53da965963df37c66eda5e9b9de537b771bb632adb28685f4b70dc2e1bb85f91f2e5f66a9affb715cdb5a2394632ebdccbe95b474433a8dde1288ba9d51b02c7357939de543517bccc779b7b96d63e4258bc3a5a2d97580cef1bc81dd0b957203fe49a3caf1c7a475bebd5897b65be76667cb15c3156488291ccc406cb42f52a23cdba19e4431a5635f3bb7f5390d9d9fa77f4f7c030368e14310281189ab75b5708b96e2d7f7f77ecb3d5fa471d5e79fda3f3d83462b1de8573d39dbe8cf94e1827c418093b49e7956dbe27cec9757970ceb988109abca30be2c9157c249e4df6efffefbcda2b3fcb4b05e662896edf2968de59488b8b287eed82c5f5e1ec86427ecda011d9d6cd88468abae6bd2b134d1797599abdf1868ca3e3573268c6cb95f366cebd1853f3b0dad793b669dfcc2cddbede931b37578565a62faee5943751ba2636f3deeeddfe076e0f2055f7310000"], {
                'accept-ranges': 'bytes',
                'access-control-allow-origin': '*',
                'cache-control': 'max-age=300',
                connection: 'keep-alive',
                'content-encoding': 'gzip',
                'content-length': '1638',
                'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                'content-type': 'text/plain; charset=utf-8',
                'cross-origin-resource-policy': 'cross-origin',
                date: 'Fri, 30 Jan 2026 16:03:19 GMT',
                etag: 'W/"d38379461bc9571f3e57ed61b7c4f2b6d189a3b3cf79f0449c1fde6e9379637e"',
                expires: 'Fri, 30 Jan 2026 16:08:19 GMT',
                'source-age': '0',
                'strict-transport-security': 'max-age=31536000',
                vary: 'Authorization,Accept-Encoding',
                via: '1.1 varnish',
                'x-cache': 'HIT',
                'x-cache-hits': '0',
                'x-content-type-options': 'nosniff',
                'x-fastly-request-id': 'ceae5dc92656de71ac82d67c46aeaff5389cb7eb',
                'x-frame-options': 'deny',
                'x-github-request-id': '897F:1797ED:1B9B20:3322E8:697CD2E7',
                'x-served-by': 'cache-lhr-egll1980065-LHR',
                'x-timer': 'S1769788999.282862,VS0,VE105',
                'x-xss-protection': '1; mode=block'
            });

        nock('http://petstore.swagger.io:80', { "encodedQueryParams": true })
            .post('/v2/user/login', { "username": "DannyB", "password": "P4ssW0rd" })
            .times(3)
            .reply(200, { AccessToken }, {
                'access-control-allow-headers': 'Content-Type, api_key, Authorization',
                'access-control-allow-methods': 'GET, POST, DELETE, PUT',
                'access-control-allow-origin': '*',
                connection: 'keep-alive',
                'content-type': 'application/json',
                date: 'Fri, 30 Jan 2026 16:03:20 GMT',
                server: 'Jetty(9.2.9.v20150224)',
                'transfer-encoding': 'chunked',
                'x-expires-after': 'Fri Jan 30 17:03:20 UTC 2026',
                'x-rate-limit': '5000'
            });

        nock("https://raw.githubusercontent.com:443", {
            encodedQueryParams: true,
        })
            .get(
                "/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/pet-openapi.json",
            )
            .reply(
                200,
                [
                    "1f8b0800000000000013ed5add6fdb38127fcf5f31d0dec32d90c869dabb873e5dba6980e03e5a6cdb5d1c7ac52d2d8d6d6e25924b52767c45fff70329d996f825c749b169d7790812491c0e8733bfdf0c879f4e00322e901141b3e7903dcdcff3a7d9a9795af05a70864cabec397c3a0100c854b1c09aec1e98cf24128daf51f71e02647a2dd008e4d35fb1d05662f746482e506a8a6a30c288221ae75cae9de729696989f62d2d034f7b3229d33847e908b59fccb8ac89ee3efaebb3ccf9e2b33b2463a4c6f46c4a4bcae69ea4c1ff8edcecb6ae420beb26cb7ed8986d28a4f7df4060584957414705bc25b5a8ec07259fcf296651f162c1357f272b7f33b6731029c9da9d826aac831b9832dd1d4db5d1cddbec6c258910685c45cb06f7b4a426f3075f65d0c5c79c3ceee67b39fab8ab079c3de5eea30eefba7c2898c27bd9dbcdb7e461034913d7ef0f750ca5896e12ae110eb2125521a9d09433ebaca8a1150494815e2028cd257aa1c99a3a7b0eef5dc5c992d08a4c2b7780f12564a53fbfd19b57e5d0a41ffa6bdcfedd5b6d26f1b7864a6ba1be0ead5523c8b07dfaa127c8df9dedce187ad94d7ee228d17150f920241488a39108f262c7792d9194af58b5f65de873624d5fdf62067b7de4f2a0dc23971fb9fcc8e5feb4472e87239743c77b9736d882e4e7c661300653f1978abd70dc8dc6dc08652649d3f7eb28711e71e5105c0913ea18b844944ec7fc18b5fad3c4e975847a12e4339e9fdcdd8851aa4d63ea98958394fb202b8f04c87888a48264cf30d9275082a1920e963dc2c50f987048c6f63b4dc70f128e215abe9f1345e8798f603d88a2e3249da4e9045107a97a48d6a9f42442d921d20ed3f680b8237b1826efd102f69acbfafe45ec21358eb3b7ef44690e08c088023eb3bb2b9ca53c7cd2b799b5f3aac8bc0913be1315272596d7b4c2fbdbb1e065c28efb1c073cbd885bac9393b65774748d4a91f9dd048c1a2eee7edef6f5d639a58cecf2859d4c8fad0e4c4add95f8da0bd43765782a7f976264b3134704fdef478c24d4436d5a5dbaa199c2a29154afdf98aecfc09fb2cb462fb8a4ff239daf87ac22e8df7160960d880c07f7ed66c36681a444e9a874d2a9955136e3bb8694a6ba4db7deacc87c8e125ea3eec3b61b926f175401554040d94c0d14ca656f58f77f0ef06fde404118cc282b81371a6af39a4ccd9f9bc98886f70badc5f3c944b58f72ca3ffcd97bf43d70099cc17b2a8b7c2611192f3167a84fe1bbeeabc0a80995c5e4fb1ce09a4bd046f156e7535877ba350a2da41041e123aee11725b0a0a43afb88eb5f4073d0a874fb45dfe430a39546a9f2ff6cac9f2d51aace444ff2f3fc7cf35ca3acd5abd91b944b5a5843fb6ada6f269b1105679a14fdb3cbedbe6fb73ac39ad0aa73128da4fedb4e5c3670c18a16c81486a45d0a522c102eb6ca02648dac7a3aae56ab9cd8af722ee7934e969afce3e68797ff7af3f2ec223fcf17baae32c7c5367ebfa5d4a8dbbfffb01d6a493413442f7afdd289189ce266822be7545735754d6cb5975d96251060b8321461772f9083b80edd7f6580df6a66d12323a53d11ef730391a446b3f556f7de9b0edc0645ff80a8fa1f7bf6697f1ce48ed8aa1fd5ae6093cba0d22f78e996bfeeb25fa38696fb402f880686582a63b32902294b2c63f61b664c26db1c1e5b73a691699f878810152dec5a26bf2a07f33676b1ddf17002fc278933a3f877935d5f7dd2b5d327bb1e7a3af50db3dfc0804a70e3e3aef92ece9ff86b0ad8b4eba4b85940cc2cfb19266d9afd8c5306ac13a84892a5424b2cd636f17cfad9f95f462d75c396a4a22550261aaf83119b2545f84d1c15da24120803bca54a5336b719e44188d058594750388202dc05145ab7f96383c2f9dea0707305aa31ebf72db6e75ccff6da15c635cc78c30e9d651ce67e32eb693346bc2d5038e97a72321fed06799d498c2626b57eb17e3bacabb2b9dbf8ee81e13565a5b2c93a4cd760f1290e84ff6c2a6a527cf3994d97a70842f2253548b0a27a0105af6b020a0d04b685ba2986540eef941df6e4d4fcbeb0bf9fc2cca4e16821384f80ac5995d1b05b591469e320d93b2c53aebddb12e9b706a5d78e744b1db36ccdbb641fa6def709c8b347d9a26a0f0c022fa3919b8e5abba03dd0eb60122a51482c2c58b97aa760703cb8555314a8d4aca960bbdd8f090fb75db3c786869acc6149aac63b89bc0f707cb227249fef821ab6a69aaee1e62a81183fa26e24b3a70394cd2b74332d27d2e7a85fa37eb1be29ef13e5ed694f30cc4d353912e53757e65cb12b18a5d5ff6e717e6028b75a7fc958fe8209e5b70d048f0e031e6d46e463cdae244b9dd4b43599c1091378fd6e519b57982359288926f72cd37ea67a610fb18ff0f235c1cb9ef52a6baa2a5683ce48a50e28426fcf56abd59971bfb34656c84ccb2778a7e5e0aa74d3d54b234a38c8f6c1e0dfe3f8a5c40a3546a3fdcabeeea2fdb0886e67481ebcfc5123f9747ce19b065670e95db728bdf8c44abd483b7ca91b3dbf52d88a46e437c9f42710a92a268d6d1edfd4c37e743a2368c728734c4bedc00389dfb6ade9e002c91127e0d187ceefc7f8bcd0a8cf949648ea0725fade158a2fc5f5df42bd35b8a2e38d7e98c22b065ebd86b5b9b4a0fc7ef5b01f2eba4b0e79af79bfbcd875bfdb16f620a6bcae7b3f0572f7eae512e55a2f4c8baabd27b1e64d7bb5a2d7f9bfd52819a9ae78e1dca619eadabb101087d2ebfedd8ce01d164fff61ebc71578699dcd20dff6420897764f92421bd5cb405c99af366eab3aab0cbf8e1b24b5d84e94b1af7743206648e55fa969773ca8c23ed377f76036573fa23b681cf5e4f3ff01bd7b64136c3e0000",
                ],
                {
                    "accept-ranges": "bytes",
                    "access-control-allow-origin": "*",
                    "cache-control": "max-age=300",
                    connection: "keep-alive",
                    "content-encoding": "gzip",
                    "content-length": "2071",
                    "content-security-policy":
                        "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                    "content-type": "text/plain; charset=utf-8",
                    "cross-origin-resource-policy": "cross-origin",
                    date: "Sat, 10 Jan 2026 17:17:37 GMT",
                    etag: 'W/"d6e36862dd911cce065e1743245638158293d3d29b41be7182d8d2721a8116d4"',
                    expires: "Sat, 10 Jan 2026 17:22:37 GMT",
                    "source-age": "0",
                    "strict-transport-security": "max-age=31536000",
                    vary: "Authorization,Accept-Encoding",
                    via: "1.1 varnish",
                    "x-cache": "HIT",
                    "x-cache-hits": "0",
                    "x-content-type-options": "nosniff",
                    "x-fastly-request-id":
                        "9bf191f42207d4117da8abef9fc1e2b6cdafa1e5",
                    "x-frame-options": "deny",
                    "x-github-request-id": "20FD:1E51F4:3D72CA:745DBD:69628091",
                    "x-served-by": "cache-lhr-egll1980076-LHR",
                    "x-timer": "S1768065457.093817,VS0,VE93",
                    "x-xss-protection": "1; mode=block",
                },
            );

        nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .post("/v2/pet")
            .times(2)
            .reply(200, { id: 1 }, {
                "access-control-allow-headers":
                    "Content-Type, api_key, Authorization",
                "access-control-allow-methods": "GET, POST, DELETE, PUT",
                "access-control-allow-origin": "*",
                connection: "keep-alive",
                "content-type": "application/json",
                date: "Sat, 10 Jan 2026 17:45:37 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
            });

        nock("http://petstore.swagger.io:80", { encodedQueryParams: true })
            .get("/v2/pet/findByTags")
            .query({ tags: "found" })
            .reply(200, [{ id: 1 }, { id: 2 }], {
                "access-control-allow-headers":
                    "Content-Type, api_key, Authorization",
                "access-control-allow-methods": "GET, POST, DELETE, PUT",
                "access-control-allow-origin": "*",
                connection: "keep-alive",
                "content-type": "application/json",
                date: "Sat, 10 Jan 2026 17:45:37 GMT",
                server: "Jetty(9.2.9.v20150224)",
                "transfer-encoding": "chunked",
            });

        const inputFile = new Input(
            "./test/mocks/inputs/dependsOn/input.json",
            "inputs",
        );

        const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-dependsOn/internal-workflow.json",
            "arazzo",
            { logger: logger },
            docFactory,
        );
        arazzo.setFilePath();

        try {
            await arazzo.runWorkflows(inputFile);
        } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
        }
    });

    it(`runs a dependsOn workflow belonging to another arazzo document first`, async function () {
        nock('https://raw.githubusercontent.com:443', { "encodedQueryParams": true })
            .get('/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/arazzo/arazzo-outputs/between-workflows.json')
            .reply(200, ["1f8b0800000000000013a5554d53db3010bdfb57ecb81c8905576e69e140cb8169617ae87010f62611b125555a911ac6ffbd23d9f1b7c3747a4b76df7ebe7dd67b041073c3dfde547c05f16572915cc6e7de28e4c69bde2300809804e5e811cea2b101011067685323340925bdef6187b00eb9e0a732fb4dae0eb0510638dc23c10f5206e1d1a239865b5714dc943e746d381f87cd07bda2b14d3ddfed451c0154a163ab9c49f1baebc9c657f02b44d55300c49217dd182ba551aeef6f9bd400b133b9f7ee88b4bd62ccf043b215b473cf1e9f2a4928294955c1be7283d9971b568fbbfaeea444c30c6e2cdb21cf2c2bb8908cd0122b54bab7cc97e25a308ba933824ac6b558edb1645d275c8be4c52ad9b543a50edd36de38d8ab08e0290c7c68b63533e7d1759bf9f83bb515d22f71c5b5f8866557a147c135e64868817608a933062581eb163fa5fb4e6d6bb4478190c065e6ff4bc8ba5445172ea47664db9b1a4ef8fc8229b55880581ba5d190c06104d4dc353cf6edbd6c968c90dbb8e7accefb1934b7f6a04cf64f19a2f1afaadb22a1ee48e813d1ba7b44dcfc119684dc3ef6971b807e62eed75ba3f3236d4394c1df0e2d7d5659391da039d287660eae752ed290930d6eabdd44992b3e5dc470cdf159cd5dd2dacec7e8de4a5b746b1b80ab455a94a3c98504c73a4dd1da07b5c770786706ad56d262f2acb2f213ebbb4f32f6d43236576a5226d09a4c384b9ae064a66e5da9196b418db53abed4121bd0fb911c1f4fc9f118c017d43b27bf05292dcaa0ea0b745e44cbb1ff251b3ffaedf07c3ffac8cd75bd50a0a6e443412ec13437bc40f22f637f9a7141e8bf406b473b65c45b483fd593089cfab764542c785f79ee6a61b66f40329effd4994ef672b2d565d5d75d6a4ebb533d8e3f1e8b9f83a7a962bb272faaa2bf80eacb4aae080000"], {
                'accept-ranges': 'bytes',
                'access-control-allow-origin': '*',
                'cache-control': 'max-age=300',
                connection: 'keep-alive',
                'content-encoding': 'gzip',
                'content-length': '675',
                'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                'content-type': 'text/plain; charset=utf-8',
                'cross-origin-resource-policy': 'cross-origin',
                date: 'Sat, 24 Jan 2026 12:24:46 GMT',
                etag: 'W/"fa7fc42e8c3d7ee40756d4974abeaed122eb1af30a4c461b12e1e7cfccfc230c"',
                expires: 'Sat, 24 Jan 2026 12:29:46 GMT',
                'source-age': '126',
                'strict-transport-security': 'max-age=31536000',
                vary: 'Authorization,Accept-Encoding',
                via: '1.1 varnish',
                'x-cache': 'HIT',
                'x-cache-hits': '0',
                'x-content-type-options': 'nosniff',
                'x-fastly-request-id': '27943485fb3105d8c0540a614abba1ad75517788',
                'x-frame-options': 'deny',
                'x-github-request-id': '0DB8:16B559:41DD87:7E7099:6974B98E',
                'x-served-by': 'cache-lhr-egll1980054-LHR',
                'x-timer': 'S1769257487.911025,VS0,VE1',
                'x-xss-protection': '1; mode=block'
            });

        nock('http://petstore.swagger.io:80', { "encodedQueryParams": true })
            .post('/v2/user/login', { "username": "DannyB", "password": "P4ssW0rd" })
            .reply(200, { AccessToken, }, {
                'access-control-allow-headers': 'Content-Type, api_key, Authorization',
                'access-control-allow-methods': 'GET, POST, DELETE, PUT',
                'access-control-allow-origin': '*',
                connection: 'keep-alive',
                'content-type': 'application/json',
                date: 'Sat, 24 Jan 2026 12:32:35 GMT',
                server: 'Jetty(9.2.9.v20150224)',
                'transfer-encoding': 'chunked',
                'x-expires-after': 'Sat Jan 24 13:32:35 UTC 2026',
                'x-rate-limit': '5000'
            });

        nock('https://raw.githubusercontent.com:443', { "encodedQueryParams": true })
            .get('/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/security/api-key/users-openapi.json')
            .reply(200, ["1f8b0800000000000013ed5a5b6fdb36147ecfaf3850f7b00289eca6dd1ef2b4346d8760415b2c29b6212b50463ab6d84aa4461ec5f18afcf781d4c51265c9d724ee9a3c38b6481e9ecb773e9247fcba07e0c914054bb97704de737fe83ff7f6cdd34026a91428487b47f0750f00c0d34184099b3d30dd1432c20f1a55ed298047d3148d4479f51903b2228b9654c9141571d48d11005ea6510996a0f3bc264d93e262ecd51a6ff7eb12465c697abb9188986d2a0113c6e3f587a74ceb8954e10612222936d0df84e19c18656e806a32b8201ca3f2f69bcd23a912464587e7876e73883a503c252e85e9635003c54c756daaef35bdbc9bc4f5a95760c5ca990928875783bdeda093f744641977fcfca2dfe58fc87f44feb6916f0c3ab10c1dee5c022c505bf7eacd9462d3bada9c306969dc69659f9df32d5d686bbfb50ed23a73a517ac75a7f53bd0e0e2d8bae801bcd749668b8c73c1d349692b0aea24b615e5ac1732474827c9ad2a672ed5ad28a487f056067c8bf496a63d07d70da0b5c9af93fe1673ca991c73b10bfbd4b556ba1ee36263d8efa85329346e6ee07110a0d617f20b8a6d697873a018e141cc134ef3152c51d61afae7c1eb9b942bd407c723eadac935b56986bd15abae517bb5b19ec620539ca6e7e6d0d3f091779c512415ff9715c09e47b129ff0d1b1c5b82b639b84ec23647226461cd0b7be5a755cbe3622467e731e2145b99ef913449856033a230c049be8b886be01a186896a4318246758d0aaab1f96f1fe02f9941c0048cb80841660489696657e6ebf9848dc7a880115c4644e9d160a0f3473e971f7f6c3d7a0a52811470c955e08f14a29021fa02691f9e14bde68c1a70150c9efa006fa402328ae73aefc3b4d02dd3081421b094c3179cc2279d62c0597cf005a79f8024106aca7bd4fd0d231e132aedff5dbadebb46a50b173df387feb07c4ea812fd6e748eea9a07d6cb6d356d9f41392290825850877715f42aced522621042c8925f66e2bc06fe621e60339b67104a5910211c56ca1aa0abb8a6e36432f199ede54b351e14b2f4e0ecf4e4f5dbf3d70787fed08f28893d075f25e8bd23b8b44d9d98bffc580dfd6887a68ca25aad6090354f5d5e2ab593f93a4b12a6cc5c5ebed9834c379699b91036d197229ec215422805c2d5d4c63996e33186c02d36945f176378ceea7d6a18b75eb3a8d321532c41030e6b5dad85d858570ea9f1ca8cfbeabd15fe93a1a697329cbabcea9853ec70adbe306f9765447165f7c0a4326cb419b0a1a0363fb3348d7960cd1d7cd6b2cde05521674e0b80f783c291d1eec96056021a14959f41cd75cec8dbbdae5ff34f35aa58ad5a8bcfe1f059dba8791b89a03820387b9a2ec72ce79a7ee72c724ffdbcd51a7cdbef31c78c7c1db0dee9de1dbd18feb4d057a7e29ac5dc24469a91ebacae59da2b79839baca10518fee014b9678d65925d43cc35811c59fc6b98708a60ccaf51e4aa42eb94e218b65486eb4abd53c7fead257c8b33f33f272a1dfce9fa7b3d2639ab79f21b6192d911f5a18944c3c96e3289fe1ea9c440797799c468f748248f44f248243b4a24b153e2e9e78f3339d639d6b93067c608414f3561b21e59d8c91ffe5c6177c7b6d605a65e606a74cd52c34ee6f1ac407777793c5c884c9dd9dad7288ba10aee2ea573b3d2b7bd7c760de9acd775392e6071ac21450591cc14b03896130ccbc3b973b0df86271a1a2e7644ab36dd5756ec323234450a2ee0c3c5094c221440a6460a980bdab281ae82ab06bb87a117e741c9d065fd745096ac416706e3ed456e53da965963df37c66eda5e9b9de537b771bb632adb28685f4b70dc2e1bb85f91f2e5f66a9affb715cdb5a2394632ebdccbe95b474433a8dde1288ba9d51b02c7357939de543517bccc779b7b96d63e4258bc3a5a2d97580cef1bc81dd0b957203fe49a3caf1c7a475bebd5897b65be76667cb15c3156488291ccc406cb42f52a23cdba19e4431a5635f3bb7f5390d9d9fa77f4f7c030368e14310281189ab75b5708b96e2d7f7f77ecb3d5fa471d5e79fda3f3d83462b1de8573d39dbe8cf94e1827c418093b49e7956dbe27cec9757970ceb988109abca30be2c9157c249e4df6efffefbcda2b3fcb4b05e662896edf2968de59488b8b287eed82c5f5e1ec86427ecda011d9d6cd88468abae6bd2b134d1797599abdf1868ca3e3573268c6cb95f366cebd1853f3b0dad793b669dfcc2cddbede931b37578565a62faee5943751ba2636f3deeeddfe076e0f2055f7310000"], {
                'accept-ranges': 'bytes',
                'access-control-allow-origin': '*',
                'cache-control': 'max-age=300',
                connection: 'keep-alive',
                'content-encoding': 'gzip',
                'content-length': '1638',
                'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                'content-type': 'text/plain; charset=utf-8',
                'cross-origin-resource-policy': 'cross-origin',
                date: 'Sat, 24 Jan 2026 12:32:34 GMT',
                etag: 'W/"d38379461bc9571f3e57ed61b7c4f2b6d189a3b3cf79f0449c1fde6e9379637e"',
                expires: 'Sat, 24 Jan 2026 12:37:34 GMT',
                'source-age': '0',
                'strict-transport-security': 'max-age=31536000',
                vary: 'Authorization,Accept-Encoding',
                via: '1.1 varnish',
                'x-cache': 'HIT',
                'x-cache-hits': '0',
                'x-content-type-options': 'nosniff',
                'x-fastly-request-id': '7c5f54482e4ddaa1b8641cabb0bad87254c69e04',
                'x-frame-options': 'deny',
                'x-github-request-id': '9A38:2AD7EF:40999B:7C2270:6974AEA4',
                'x-served-by': 'cache-lhr-egll1980093-LHR',
                'x-timer': 'S1769257955.773658,VS0,VE95',
                'x-xss-protection': '1; mode=block'
            });

        nock('https://raw.githubusercontent.com:443', { "encodedQueryParams": true })
            .get('/JaredCE/Arazzo-Runner/refs/heads/main/test/mocks/openapi/microservices/user.json')
            .reply(200, ["1f8b0800000000000013ed59db6e1b37107dd7570c367d680067a5d86e1ffc54c7490aa38113c0098ac235106a35d232d95d6ec95929aae17f2fc8bd88cbbd48beabb0f2e0d84b72387378e670485e0d003c9162c252ee1d8177e08ffc036f4f7f0d449c8a041352de115c0d00003c158418b3d507dd4d2223fca2505a5f013c5aa6a82d8af1370cc8982c5a52295294c451d5460078994299b0189def963545922733cf6abcdeb32d4cb9547476271311bbab058c198f6e3f3c654a2d849cdcc14228923bf8af97e19c1865ee02593678423843e9edd59ba742c68c8a0e07fb6ef3045520794a5c24ba8f660d1433d9de54bf5b7e793f621753afe08ab1b332500eaf067bf7c34edeb3229bc0f1eb613fe43be6ef987fdfccd7019d18859e6c5d02ac715bf5facda4644bdb6d4e18373cee8cb22fcef648d7c6da1fadc3b4ce5ce925ab0d5a3f809a17c706a22740af53ccd605e792a753d26e68a853d86e68e7764be618e914b99bda6995ba1b1ae911bc1b13be217a1bcb9ec3eb1ad19ae2d7297feb35a5c1ca0eb0f2d1c5584f6190494ecb735dfdd608ef1d67140ac9ff6545846db996f23fb0966ca5f7f5c176361ab04264935578854b83c22d8f2753b12acc8953646c7e425224248281a608c05985cf2157c01530502c4e230485728e12aab1f9df3ec05f2283802530e5c904444610eb6636d6bf9e2fd86c861218c14548941e0d872affe47371f973e3d34b10124402175c06fe54222662827e82b4072f8a5e2da3865c06c3973ec07b2181b4e3b9cf7bb02c7ccb140285082ce5f01d97f055a5187016bdfa8ecbaf40020815e53d6cbc61ca2342a9fcbf4be8bd394a5540f4da1ff9a3f23ba18cd5c7e939ca390f0cca4d374d9f6139221009b1806ca6948b5ead73a5269a21842cfe6d65ceabf12fe201260adbac1da72c0811f62b6735d16564f9b8582c7c667af942ce86852d35fc707af2eeecfcddab7d7fe48714479ec3af92f4de115c98a64ece5f5c56432fcdd09451681d1a8759bdfcf652a1a89e2b2a8b6326f55c5ebeeb43a66a7ad34a61bdfa228996304698880461bc34eb1c89d90c27c00d37a46f9bd19b96f1fb54ebaf7d78b52b2026598c9a1c263aab85d84c558058bab2d220bbb7c47f3254f4464c96eed6ea8453943ac65f68db6eb5292e4d314432c35a9b261b26d4544996a6110f4cb8c36fcad1a7127973a26f6901f07e9238d5debd18aeee0286c515c0d082ce19793de8faabbdbc95a852a139e982b43f7add0caa6d47098a4ad1d9dcba80d90c9a7e70d6c16317de8dc1d7fd883961e4fb8041a77b9b3c1cfdb216abd364ce22ae1323cdc805ab6b96e68e5ad326136841863f39856ed1b949b22b88b8221053c37f050b4e21ccf81c93dc556894ab4e601b65b8aadc3b75e2bfb7846f6866fecf59950efd74f1be9d927cb090fc9f28c9eaacf2d442a2e0643b95443d4729d154de5e25d1deed846427243b21d95221b92a0ffcd7b688ccb05b437e47cae93e5ee6ff9b53d6adc46286a479f06679e698a82b44776e9707bcead6c28126bf22d027ad3537cd6e734fdaf6d16b3db58c971b24da63ab6207752e37cbf7d15a06ab2c0850a969164145826d4afbb623da03a5fb7ab0ca742f09032ad3f1378572c3190f373b202682602ab264e3699a0a535daf689dea52902fe9a43ac73ffced456666ebbfbd78048531eb482123481027fac66d8c90fbd6c0fbd9a9cfbdd66436bdf29aacb3249bb2486d4b4df660e5d833519c094648d8293a6f4df323694eeecb936bcee710a1ae3baa109edcc19df06c243ccf32af06e5cff2a1433f76a9e63b47fd1d252d1ec77cebd167bebf7a35c99f3e6a2bdb78ada9a5a81bdec732d154f1c056ef8d3f48031dbd15417dbd5c3bef5bdeea4426c1786f276d3dbe5558aaf9e49807d7eac226d3174f85e5eb58d7c47adeebc1f5e03ff912045a95280000"], {
                'accept-ranges': 'bytes',
                'access-control-allow-origin': '*',
                'cache-control': 'max-age=300',
                connection: 'keep-alive',
                'content-encoding': 'gzip',
                'content-length': '1407',
                'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
                'content-type': 'text/plain; charset=utf-8',
                'cross-origin-resource-policy': 'cross-origin',
                date: 'Sat, 24 Jan 2026 12:37:16 GMT',
                etag: 'W/"b13187726bd6876ac4a624d7e81f30db75f7e703322c5f9f7bc06d780fb3cf7e"',
                expires: 'Sat, 24 Jan 2026 12:42:16 GMT',
                'source-age': '0',
                'strict-transport-security': 'max-age=31536000',
                vary: 'Authorization,Accept-Encoding',
                via: '1.1 varnish',
                'x-cache': 'HIT',
                'x-cache-hits': '0',
                'x-content-type-options': 'nosniff',
                'x-fastly-request-id': '38c0a5568c729b72cc70f4ab26ce9b7a15981cf2',
                'x-frame-options': 'deny',
                'x-github-request-id': 'CB6D:332E6A:41ED07:7E7C68:6974B968',
                'x-served-by': 'cache-lhr-egll1980052-LHR',
                'x-timer': 'S1769258236.244061,VS0,VE99',
                'x-xss-protection': '1; mode=block'
            });

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
            "./test/mocks/inputs/dependsOn/input.json",
            "inputs",
        );

        const arazzo = new Arazzo(
            "./test/mocks/arazzo/arazzo-dependsOn/external-workflow.json",
            "arazzo",
            { logger: logger },
            docFactory,
        );
        arazzo.setFilePath();

        try {
            await arazzo.runWorkflows(inputFile);
        } catch (err) {
            console.error(err)
            expect(err).to.not.be.instanceOf(Error);
        }
    });
});
