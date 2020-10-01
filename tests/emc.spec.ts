import * as assert from 'assert'
import * as sinon from 'sinon'
import {describe, it, after, before} from 'mocha'
import {Keys} from '../src'
import {Network, Blockchain} from '../src'

describe('Lib/Emercoin', () => {
    const instance = new Keys(Blockchain.EMERCOIN, Network.MAINNET)
    const instanceWithTestnet = new Keys(Blockchain.EMERCOIN, Network.TESTNET)

    describe('#signTx', () => {
        context('with testnet network', async () => {
            const data =
                '{"sum":"0.00002","fee":"0.00000452","inputs":[{"txId":"81a324487f7981837554e79e1d0d2225ba5dd175368897ed6c0567f2e565bb15","hex":"02000000a652755f015b02675ebbc567cb97b08f97f5887db338ac5af77698ad28ae6d1572974ae94c0100000049483045022100fbb2051c9043ab8b7c7de1764c99b32a8dfd9130acc504b81838340acba5f0c902203edea5582635462f382e14231994383978eab518dbde6ab43ba1982860409e5d01feffffff0280969800000000001976a9147dbde6768ac035ab3293a913aa1d8bcb5ef680e288acbc150100000000001976a914b1edad1084288e1ce1c8cba26fdb621560cc1aa088acf7320200","n":0,"value":"1000000000","address":"mrypFXt7XugH37CAzJkieFb3znMWQRSLd2","type":"pubkeyhash","scriptPubKeyHex":"76a9147dbde6768ac035ab3293a913aa1d8bcb5ef680e288ac"}],"outputs":[{"address":"mxgNHuKnqah6Q71Yf2Y92azdQ6frrdkAEx","amount":"2000"},{"address":"mrypFXt7XugH37CAzJkieFb3znMWQRSLd2","amount":"999997548"}]}'
            const privateKey =
                "{\"mrypFXt7XugH37CAzJkieFb3znMWQRSLd2\":\"cShaqka14VuShjqd5QV69JyEtvLMhWDeugyTq6Vnj1SBvcvGKZdr\"}"

            const actual = await instanceWithTestnet.sign(
                data,
                privateKey,
                true,
            )

            it('should be return `0200000001073acbcae429fcb9c36e90c8feab15754e8664dc52261188d8a009735c9f0d58000000006b4830450221009c66dcb5bd6473d96c0c33bad49a46dd014cb5fce902da370d0b2262c741222c0220258eb83fa22b877c02ae30946388dcc92056d9cb671d7dc5dec61f08af3d686d012102c1c1bb82002b776a29ef442b3ce5622a46a4fc3ef7b01fd39d0f199f4275986bffffffff02204e0000000000001976a9143cdf97913d4d6b3ad63db0d42f9871bcc1b8758f88ac5cf20e00000000001976a9142dfd452b772b5d4ced5aeaeff5c1fb5715c79f5888ac00000000`', () => {
                assert.strictEqual(
                    actual,
                    '0200000001073acbcae429fcb9c36e90c8feab15754e8664dc52261188d8a009735c9f0d58000000006b4830450221009c66dcb5bd6473d96c0c33bad49a46dd014cb5fce902da370d0b2262c741222c0220258eb83fa22b877c02ae30946388dcc92056d9cb671d7dc5dec61f08af3d686d012102c1c1bb82002b776a29ef442b3ce5622a46a4fc3ef7b01fd39d0f199f4275986bffffffff02204e0000000000001976a9143cdf97913d4d6b3ad63db0d42f9871bcc1b8758f88ac5cf20e00000000001976a9142dfd452b772b5d4ced5aeaeff5c1fb5715c79f5888ac00000000',
                )
            })
            try {
                await instanceWithTestnet.sign(
                    data,
                    "{\"mrypFXt7XugH37CAzJkieFb3znMWQRSLd2\":\"ali32142\"}",
                    true,
                ) // check behavior in case of invalid private Key
            } catch (ex) {
                it('should be throw an error with following message `Non-base58 character`', () => {
                    assert.strictEqual(ex.message, 'Non-base58 character')
                })
            }
        })
    })
})
