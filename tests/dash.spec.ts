import * as assert from 'assert'
import * as sinon from 'sinon'
import { describe, it, after, before } from 'mocha'
import { Keys } from '../src'
import { Network, Blockchain } from '../src'

describe('Lib/Dashcoin', () => {
    const instance = new Keys(Blockchain.DASHCOIN, Network.MAINNET)
    const instanceWithTestnet = new Keys(Blockchain.DASHCOIN, Network.TESTNET)

    describe('#signTx', () => {
        context('with testnet network', async () => {
            const data =
                    '{"sum":"0.0002","fee":"0.00000452","inputs":[{"txId":"580d9f5c7309a0d888112652dc64864e7515abfec8906ec3b9fc29e4cacb3a07","hex":"020000000164ab8709510874621a1fe55ea927ad53701c31c7648a45aa0cdf36510813fcad220000006b483045022100c4e57e25f42936b707678045f23eb1d32ff9299d8a153e634825e724ee1112fb022077f6d21e008a2299a5d38b6b9a163adcb9669bd8b988f00ae3a2098735a4cc1d012103e40e71856814f197a400613a9ad1371ef029e26e037e163604eca40da694d9b3feffffff0240420f00000000001976a9142dfd452b772b5d4ced5aeaeff5c1fb5715c79f5888acdee01302000000001976a9145dfdbb66f3e451d4a0da617b497fc258bd866b1088ac25e80500","n":0,"value":"1000000","address":"yQWcfMfM48FoFXv6Pc85M873kmtsnRGbgU","type":"pubkeyhash","scriptPubKeyHex":"76a9142dfd452b772b5d4ced5aeaeff5c1fb5715c79f5888ac"}],"outputs":[{"address":"yRsKFAKjye5VSxGkN92oxfBSK2LNW3Vawz","amount":"20000"},{"address":"yQWcfMfM48FoFXv6Pc85M873kmtsnRGbgU","amount":"979548"}]}',
                privateKey =
                    "{\"yQWcfMfM48FoFXv6Pc85M873kmtsnRGbgU\":\"cSNGHTMXSJp9kS1ypnzAZoyrLJw2xFk428sgQHoZRMm4Tg9NzAv8\"}"

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
                    "{\"yQWcfMfM48FoFXv6Pc85M873kmtsnRGbgU\":\"cSNGHTMXSJp9kS1ypnzAZoyrLJw2xFk428sgQHoZRMm4Tg9NzAv0\"}",
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
