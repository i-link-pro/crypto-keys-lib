import * as assert from 'assert'
import * as sinon from 'sinon'
import { describe, it, after, before } from 'mocha'
import { Keys } from '../src'
import { Network, Blockchain } from '../src'
import { Dogecoin } from '../src/blockchains/dogecoin'

describe('Lib/Dashcoin', () => {
    const instance = new Keys(Blockchain.DASHCOIN, Network.MAINNET)
    const instanceWithTestnet = new Keys(Blockchain.DASHCOIN, Network.TESTNET)

    describe('#signTx', () => {
        context('with testnet network', async () => {
            const data =
                    '{"sum":"0.0002","fee":"0.00000452","inputs":[{"txId":"580d9f5c7309a0d888112652dc64864e7515abfec8906ec3b9fc29e4cacb3a07","hex":"020000000164ab8709510874621a1fe55ea927ad53701c31c7648a45aa0cdf36510813fcad220000006b483045022100c4e57e25f42936b707678045f23eb1d32ff9299d8a153e634825e724ee1112fb022077f6d21e008a2299a5d38b6b9a163adcb9669bd8b988f00ae3a2098735a4cc1d012103e40e71856814f197a400613a9ad1371ef029e26e037e163604eca40da694d9b3feffffff0240420f00000000001976a9142dfd452b772b5d4ced5aeaeff5c1fb5715c79f5888acdee01302000000001976a9145dfdbb66f3e451d4a0da617b497fc258bd866b1088ac25e80500","n":0,"value":"1000000","address":"yQWcfMfM48FoFXv6Pc85M873kmtsnRGbgU","type":"pubkeyhash","scriptPubKeyHex":"76a9142dfd452b772b5d4ced5aeaeff5c1fb5715c79f5888ac"}],"outputs":[{"address":"yRsKFAKjye5VSxGkN92oxfBSK2LNW3Vawz","amount":"20000"},{"address":"yQWcfMfM48FoFXv6Pc85M873kmtsnRGbgU","amount":"979548"}]}',
                privateKey =
                    'chPVs597uAbAm4sGJT1WxoGfQJfx3pCwNkMHtvjYuhQmwHEoDQop'

            const actual = await instanceWithTestnet.sign(
                data,
                privateKey,
                false,
            )

            it('should be return `1d7feaa7c549aa7281c080da0d5b2636f8308d0ba9074d0a8d84b81542cf98407ace5aa539d13a4f668b3c7621643ca2f8b35bd07c6569b9104c9267bb8ac98d`', () => {
                assert.strictEqual(
                    actual,
                    '1d7feaa7c549aa7281c080da0d5b2636f8308d0ba9074d0a8d84b81542cf98407ace5aa539d13a4f668b3c7621643ca2f8b35bd07c6569b9104c9267bb8ac98d',
                )
            })
            try {
                await instanceWithTestnet.sign(
                    data,
                    'Invalid_Private_Key',
                    false,
                ) // check behavior in case of invalid private Key
            } catch (ex) {
                it('should be throw an error with following message `Non-base58 character`', () => {
                    assert.strictEqual(ex.message, 'Non-base58 character')
                })
            }
        })
    })
})
