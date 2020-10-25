import * as assert from 'assert'
import { describe, it } from 'mocha'
import { Keys } from '../src'
import { Network, Blockchain } from '../src'

describe('Lib/Emercoin', () => {
    // const instance = new Keys(Blockchain.EMERCOIN, Network.MAINNET)
    const instanceWithTestnet = new Keys(Blockchain.EMC, Network.TESTNET)

    describe('#signTx', () => {
        context('with testnet network', async () => {
            const data =
                '{"sum":"0.00002","fee":"0.00000452","inputs":[{"txId":"81a324487f7981837554e79e1d0d2225ba5dd175368897ed6c0567f2e565bb15","hex":"02000000a652755f015b02675ebbc567cb97b08f97f5887db338ac5af77698ad28ae6d1572974ae94c0100000049483045022100fbb2051c9043ab8b7c7de1764c99b32a8dfd9130acc504b81838340acba5f0c902203edea5582635462f382e14231994383978eab518dbde6ab43ba1982860409e5d01feffffff0280969800000000001976a9147dbde6768ac035ab3293a913aa1d8bcb5ef680e288acbc150100000000001976a914b1edad1084288e1ce1c8cba26fdb621560cc1aa088acf7320200","n":0,"value":"1000000000","address":"mjfDNnBFx6P2EYN1W23CkLBJPBUu1Jaewu","type":"pubkeyhash","scriptPubKeyHex":"76a9147dbde6768ac035ab3293a913aa1d8bcb5ef680e288ac"}],"outputs":[{"address":"mrypFXt7XugH37CAzJkieFb3znMWQRSLd2","amount":"2000"},{"address":"mrypFXt7XugH37CAzJkieFb3znMWQRSLd2","amount":"99999"}]}'
            const privateKey =
                '{"mjfDNnBFx6P2EYN1W23CkLBJPBUu1Jaewu":"cShaqka14VuShjqd5QV69JyEtvLMhWDeugyTq6Vnj1SBvcvGKZdr"}'

            const actual = await instanceWithTestnet.sign(
                data,
                privateKey,
                true,
            )

            it('should be return `02000000000000000115bb65e5f267056ced97883675d15dba25220d1d9ee754758381797f4824a381000000006b483045022100e685db4d52f31ce123bae91e1aef02d860bc8fb3add0bbfe99fc7b03950a363a02206e9f7ca2153707a9c61b3b9969747e1ab9cbb54bb687f97acc97b840b4cb2e860121032c3ab73ddb3e6e17c2a363fb310a8ae1fff95cf693ef2e3855f88067e9965c88ffffffff02d0070000000000001976a9147dbde6768ac035ab3293a913aa1d8bcb5ef680e288ac9f860100000000001976a9147dbde6768ac035ab3293a913aa1d8bcb5ef680e288ac00000000`', () => {
                assert.strictEqual(
                    actual,
                    '02000000000000000115bb65e5f267056ced97883675d15dba25220d1d9ee754758381797f4824a381000000006b483045022100e685db4d52f31ce123bae91e1aef02d860bc8fb3add0bbfe99fc7b03950a363a02206e9f7ca2153707a9c61b3b9969747e1ab9cbb54bb687f97acc97b840b4cb2e860121032c3ab73ddb3e6e17c2a363fb310a8ae1fff95cf693ef2e3855f88067e9965c88ffffffff02d0070000000000001976a9147dbde6768ac035ab3293a913aa1d8bcb5ef680e288ac9f860100000000001976a9147dbde6768ac035ab3293a913aa1d8bcb5ef680e288ac00000000',
                )
            })
            try {
                await instanceWithTestnet.sign(
                    data,
                    '{"mjfDNnBFx6P2EYN1W23CkLBJPBUu1Jaewu":"ali32142"}',
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
