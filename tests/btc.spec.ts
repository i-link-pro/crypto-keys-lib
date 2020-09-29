import * as assert from 'assert'
import * as sinon from 'sinon'
import { describe, it, after, before } from 'mocha'
import { Keys } from '../src/lib'
import { Network, Blockchain } from '../src/types'
import { BitcoinBase } from '../src/blockchains/bitcoin-base'
import { TEST_VECTORS } from './fixtures/vectors'

describe('BitcoinBase', () => {
    const instance = new BitcoinBase(Network.MAINNET)
    describe('#getMasterAddressFromSeed', () => {
        TEST_VECTORS.forEach(vector => {
            const actual = instance.getMasterAddressFromSeed(vector.seed)
            it(`should be generate correct public key ${vector.masterPublicKey}`, () => {
                assert.strictEqual(
                    actual['masterPublicKey'],
                    vector.masterPublicKey,
                )
            })
            it(`should be generate correct private key ${vector.masterPrivateKey}`, () => {
                assert.strictEqual(
                    actual['masterPrivateKey'],
                    vector.masterPrivateKey,
                )
            })
        })
    })
})

describe('Lib/BitcoinBase', () => {
    const instance = new Keys(Blockchain.BITCOIN, Network.MAINNET)
    const instanceWithTestnet = new Keys(Blockchain.BITCOIN, Network.TESTNET)
    describe('#getDataFromSeed/generateSeedPhrase', () => {
        const seed = instance.generateSeedPhrase(12)
        const actual = instance.getDataFromSeed(seed['seedPhrase'])
        it(`should be return \`${seed['seedPhrase']}\` seedPhrase`, () => {
            assert.strictEqual(actual['seedPhrase'], seed['seedPhrase'])
        })

        it(`should be return \`${seed['masterPublicKey']}\` masterPublicKey`, () => {
            assert.strictEqual(
                actual['masterPublicKey'],
                seed['masterPublicKey'],
            )
        })

        it(`should be return \`${seed['masterPrivateKey']}\` masterPrivateKey`, () => {
            assert.strictEqual(
                actual['masterPrivateKey'],
                seed['masterPrivateKey'],
            )
        })
    })

    describe('#getDefaultPaths', () => {
        const actualPaths = instance.getDefaultPaths()
        it('should return exact paths', () => {
            const expectedPaths = [
                {
                    blockchain: 'bitcoin',
                    network: 'mainnet',
                    path: "m/44'/0'/0'/0/0",
                },
                {
                    blockchain: 'bitcoin',
                    network: 'testnet',
                    path: "m/44'/1'/0'/0/0",
                },
            ]
            assert.deepEqual(actualPaths, expectedPaths)
        })
    })

    describe('#checkSeedPhrase', () => {
        const seedPhrase =
            'crouch congress lake quantum smoke play glove firm pony capital wise cream'
        const actual = instance.checkSeedPhrase(seedPhrase)
        it('should return `true`', () => {
            assert.strictEqual(actual, true)
        })
    })
    describe('#derivateKeys', () => {
        context('with mainnet network', () => {
            const instance = new Keys(Blockchain.BITCOIN, Network.MAINNET)
            context('with masterPrivateKey', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(
                        BitcoinBase.prototype,
                        'derivateFromPrivate',
                    )
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    const masterPrivateKey = {
                        masterPrivateKey:
                            'xprv9s21ZrQH143K3VDSXCXAqm4Wkw7TXBHfkxmaJ7RLRjqFADEeB7CiRjbfz7pxM8uzGFDcmAgz3jfAm2f88FSRFMKGGZeVo1qCpnSdFtXzeHt',
                    }
                    actual = instance.derivateKeys(masterPrivateKey, cursor)
                    done()
                })
                after((done): void => {
                    sinon.restore()
                    done()
                })
                context('positive result', () => {
                    const expected: [
                        {
                            path: string
                            address: string
                            publicKey: string
                            privateKey: string
                        },
                    ] = [
                        {
                            path: "m/44'/0'/0'/0/2",
                            address: '1DZ5ZFyhtZq9L1wLKHec3n2MjqKc478Nnn',
                            publicKey:
                                '03c8c63066b53f1ece9652084115fd67bf02f37785944b604da73bc9384333acc5',
                            privateKey:
                                'KxmUfeuHWUXBpHXkHhmkRNiF7MZQhFL3gzGC9fNCzPVxg8MXAmV9',
                        },
                    ]
                    it(`should be return correct ${expected[0]['path']} path`, () => {
                        assert.strictEqual(
                            actual[0]['path'],
                            expected[0]['path'],
                        )
                    })

                    it(`should be return correct ${expected[0]['address']} address`, () => {
                        assert.strictEqual(
                            actual[0]['address'],
                            expected[0]['address'],
                        )
                    })

                    it(`should be return correct ${expected[0]['publicKey']} publicKey`, () => {
                        assert.strictEqual(
                            actual[0]['publicKey'],
                            expected[0]['publicKey'],
                        )
                    })

                    it(`should be return correct ${expected[0]['privateKey']} privateKey`, () => {
                        assert.strictEqual(
                            actual[0]['privateKey'],
                            expected[0]['privateKey'],
                        )
                    })

                    it(`should be call {derivateFromPrivate} function 1 time`, () => {
                        assert.strictEqual(spy.callCount, 1)
                    })

                    it(`should be call {derivateFromPrivate} function with following args 
              ['xprv9s21ZrQH143K3VDSXCXAqm4Wkw7TXBHfkxmaJ7RLRjqFADEeB7CiRjbfz7pxM8uzGFDcmAgz3jfAm2f88FSRFMKGGZeVo1qCpnSdFtXzeHt',
              { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'xprv9s21ZrQH143K3VDSXCXAqm4Wkw7TXBHfkxmaJ7RLRjqFADEeB7CiRjbfz7pxM8uzGFDcmAgz3jfAm2f88FSRFMKGGZeVo1qCpnSdFtXzeHt',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
            context('with masterPublicKey', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(BitcoinBase.prototype, 'derivateFromPublic')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    const masterPublicKey = {
                        masterPublicKey:
                            'xpub661MyMwAqRbcFkod8bRLkBLEpxJuHD1jdsLwzn2PsPLxs3YtAjyKPHFp4m4EssQC9aQNWymqLeKyhELT8MFKQFZgv8VBdrdVod1r9NtESMP',
                    }
                    actual = instance.derivateKeys(masterPublicKey, cursor)
                    done()
                })
                after((done): void => {
                    sinon.restore()
                    done()
                })
                context('positive result', () => {
                    const expected: [
                        { path: string; address: string; publicKey: string },
                    ] = [
                        {
                            path: "m/44'/0'/0'/0/2",
                            address: '14UQMUzbNPKqFjEeox5UGESLry3FK9catx',
                            publicKey:
                                '03589ba6d047be9acf960f3a204be09f288245768db2de3dd62704fe24730b5ebf',
                        },
                    ]
                    it(`should be return correct ${expected[0]['path']} path`, () => {
                        assert.strictEqual(
                            actual[0]['path'],
                            expected[0]['path'],
                        )
                    })

                    it(`should be return correct ${expected[0]['address']} address`, () => {
                        assert.strictEqual(
                            actual[0]['address'],
                            expected[0]['address'],
                        )
                    })

                    it(`should be return correct ${expected[0]['publicKey']} publicKey`, () => {
                        assert.strictEqual(
                            actual[0]['publicKey'],
                            expected[0]['publicKey'],
                        )
                    })

                    it(`should be call {derivateFromPublic} function 1 time`, () => {
                        assert.strictEqual(spy.callCount, 1)
                    })

                    it(`should be call {derivateFromPublic} function with following args 
              ['xpub661MyMwAqRbcFkod8bRLkBLEpxJuHD1jdsLwzn2PsPLxs3YtAjyKPHFp4m4EssQC9aQNWymqLeKyhELT8MFKQFZgv8VBdrdVod1r9NtESMP',
              { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'xpub661MyMwAqRbcFkod8bRLkBLEpxJuHD1jdsLwzn2PsPLxs3YtAjyKPHFp4m4EssQC9aQNWymqLeKyhELT8MFKQFZgv8VBdrdVod1r9NtESMP',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
            context('with seedPhrase', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(
                        BitcoinBase.prototype,
                        'derivateFromPrivate',
                    )
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    const seedPhrase = {
                        seedPhrase:
                            'gossip that property quit spy emerge electric lazy twist couch phrase capable',
                    }
                    actual = instance.derivateKeys(seedPhrase, cursor)
                    done()
                })
                after((done): void => {
                    sinon.restore()
                    done()
                })
                context('positive result', () => {
                    const expected: [
                        {
                            path: string
                            address: string
                            publicKey: string
                            privateKey: string
                        },
                    ] = [
                        {
                            path: "m/44'/0'/0'/0/2",
                            address: '1PeJJDkc9bKzbsYFREoNqesBLVhYd1QCvF',
                            publicKey:
                                '028061621e6bf5b4377203f7a8edf6ecc5e418d86ddd92fb155f37cb266971b908',
                            privateKey:
                                'Kz1bmHP5NPC4Y7oZaT2LzYqNgy8nVNzBr9As3w73FwxGQ2CtdyUj',
                        },
                    ]
                    it(`should be return correct ${expected[0]['path']} path`, () => {
                        assert.strictEqual(
                            actual[0]['path'],
                            expected[0]['path'],
                        )
                    })

                    it(`should be return correct ${expected[0]['address']} address`, () => {
                        assert.strictEqual(
                            actual[0]['address'],
                            expected[0]['address'],
                        )
                    })

                    it(`should be return correct ${expected[0]['publicKey']} publicKey`, () => {
                        assert.strictEqual(
                            actual[0]['publicKey'],
                            expected[0]['publicKey'],
                        )
                    })

                    it(`should be return correct ${expected[0]['privateKey']} privateKey`, () => {
                        assert.strictEqual(
                            actual[0]['privateKey'],
                            expected[0]['privateKey'],
                        )
                    })

                    it(`should be call {derivateFromPrivate} function 1 time`, () => {
                        assert.strictEqual(spy.callCount, 1)
                    })

                    it(`should be call {derivateFromPrivate} function with following args 
              ['xprv9z5ah3GaSD3VnXzFhpZQEnQuw8JxYaKwX1Rd7iDUUsLQQ8rwCbPFQ4M9qutwFajKtctHFZGvuo9b69X69j6UAwXuZ8VLvJtkRZGjuD8YTuQ',
              { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'xprv9z5ah3GaSD3VnXzFhpZQEnQuw8JxYaKwX1Rd7iDUUsLQQ8rwCbPFQ4M9qutwFajKtctHFZGvuo9b69X69j6UAwXuZ8VLvJtkRZGjuD8YTuQ',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
        })

        context('with testnet network', () => {
            context('with masterPrivateKey', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(
                        BitcoinBase.prototype,
                        'derivateFromPrivate',
                    )
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * source: https://github.com/bitcoinjs/bitcoinjs-lib/
                     */
                    const masterPrivateKey = {
                        masterPrivateKey:
                            'tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK',
                    }
                    actual = instanceWithTestnet.derivateKeys(
                        masterPrivateKey,
                        cursor,
                    )
                    done()
                })
                after((done): void => {
                    sinon.restore()
                    done()
                })
                context('positive result', () => {
                    const expected: [
                        {
                            path: string
                            address: string
                            publicKey: string
                            privateKey: string
                        },
                    ] = [
                        {
                            path: "m/44'/1'/0'/0/2",
                            address: 'miVbbks1Q6ai3oKXPSyTCaRUVcybHYmHQT',
                            publicKey:
                                '02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d',
                            privateKey:
                                'cUVN2CtwaNBTUdRimGn6qVVhzD7wXk4nQQ6u1BU9vaNQ3oGKhKvw',
                        },
                    ]
                    it(`should be return correct ${expected[0]['path']} path`, () => {
                        assert.strictEqual(
                            actual[0]['path'],
                            expected[0]['path'],
                        )
                    })

                    it(`should be return correct ${expected[0]['address']} address`, () => {
                        assert.strictEqual(
                            actual[0]['address'],
                            expected[0]['address'],
                        )
                    })

                    it(`should be return correct ${expected[0]['publicKey']} publicKey`, () => {
                        assert.strictEqual(
                            actual[0]['publicKey'],
                            expected[0]['publicKey'],
                        )
                    })

                    it(`should be return correct ${expected[0]['privateKey']} privateKey`, () => {
                        assert.strictEqual(
                            actual[0]['privateKey'],
                            expected[0]['privateKey'],
                        )
                    })

                    it(`should be call {derivateFromPrivate} function 1 time`, () => {
                        assert.strictEqual(spy.callCount, 1)
                    })

                    it(`should be call {derivateFromPrivate} function with following args 
              ['tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK',
              { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'tprv8ZgxMBicQKsPd7Uf69XL1XwhmjHopUGep8GuEiJDZmbQz6o58LninorQAfcKZWARbtRtfnLcJ5MQ2AtHcQJCCRUcMRvmDUjyEmNUWwx8UbK',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
            context('with masterPublicKey', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(BitcoinBase.prototype, 'derivateFromPublic')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    const masterPublicKey = {
                        masterPublicKey:
                            'tpubDCSJ3GrB3gss1K2ySF1pFezeSmdWZgjAXJC9i7mSVgh1taeg8XM6U522Tq1Yapd4yTn7BBzUzneZVDCLtyZxt42Js7YpVPqQXkTjKBTiytv',
                    }
                    actual = instanceWithTestnet.derivateKeys(
                        masterPublicKey,
                        cursor,
                    )
                    done()
                })
                after((done): void => {
                    sinon.restore()
                    done()
                })
                context('positive result', () => {
                    const expected: [
                        { path: string; address: string; publicKey: string },
                    ] = [
                        {
                            path: "m/44'/1'/0'/0/2",
                            address: 'muk2jmCAMw4W36L47jZCfJC8iePda2vtY3',
                            publicKey:
                                '02fb0142a7e11401073a01dc913f30755bfb082c6197347f146d42db6455eabd03',
                        },
                    ]
                    it(`should be return correct ${expected[0]['path']} path`, () => {
                        assert.strictEqual(
                            actual[0]['path'],
                            expected[0]['path'],
                        )
                    })

                    it(`should be return correct ${expected[0]['address']} address`, () => {
                        assert.strictEqual(
                            actual[0]['address'],
                            expected[0]['address'],
                        )
                    })

                    it(`should be return correct ${expected[0]['publicKey']} publicKey`, () => {
                        assert.strictEqual(
                            actual[0]['publicKey'],
                            expected[0]['publicKey'],
                        )
                    })

                    it(`should be call {derivateFromPublic} function 1 time`, () => {
                        assert.strictEqual(spy.callCount, 1)
                    })

                    it(`should be call {derivateFromPublic} function with following args 
              ['tpubDCSJ3GrB3gss1K2ySF1pFezeSmdWZgjAXJC9i7mSVgh1taeg8XM6U522Tq1Yapd4yTn7BBzUzneZVDCLtyZxt42Js7YpVPqQXkTjKBTiytv',
              { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'tpubDCSJ3GrB3gss1K2ySF1pFezeSmdWZgjAXJC9i7mSVgh1taeg8XM6U522Tq1Yapd4yTn7BBzUzneZVDCLtyZxt42Js7YpVPqQXkTjKBTiytv',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
            context('with seedPhrase', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(
                        BitcoinBase.prototype,
                        'derivateFromPrivate',
                    )
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated by: https://iancoleman.io/bip39/
                     */
                    const seedPhrase = {
                        seedPhrase:
                            'include gas swallow valve dignity candy dragon voice member concert planet mutual dutch reform push',
                    }
                    actual = instanceWithTestnet.derivateKeys(
                        seedPhrase,
                        cursor,
                    )
                    done()
                })
                after((done): void => {
                    sinon.restore()
                    done()
                })
                context('positive result', () => {
                    const expected: [
                        {
                            path: string
                            address: string
                            publicKey: string
                            privateKey: string
                        },
                    ] = [
                        {
                            path: "m/44'/1'/0'/0/2",
                            address: 'mzP9atortKF87N4LRzTNuYqm4WWdJevz7f',
                            publicKey:
                                '02d7d7b4ed62a982c6bcdb8146230f9b92d4bd3a8136faaec49fbf8750261d82b7',
                            privateKey:
                                'cVeb1Z7ieVoU4a7KYPcKgwJsnqppsWujaesJs4Ughkt9mwkSLETq',
                        },
                    ]
                    it(`should be return correct ${expected[0]['path']} path`, () => {
                        assert.strictEqual(
                            actual[0]['path'],
                            expected[0]['path'],
                        )
                    })

                    it(`should be return correct ${expected[0]['address']} address`, () => {
                        assert.strictEqual(
                            actual[0]['address'],
                            expected[0]['address'],
                        )
                    })

                    it(`should be return correct ${expected[0]['publicKey']} publicKey`, () => {
                        assert.strictEqual(
                            actual[0]['publicKey'],
                            expected[0]['publicKey'],
                        )
                    })

                    it(`should be return correct ${expected[0]['privateKey']} privateKey`, () => {
                        assert.strictEqual(
                            actual[0]['privateKey'],
                            expected[0]['privateKey'],
                        )
                    })

                    it(`should be call {derivateFromPrivate} function 1 time`, () => {
                        assert.strictEqual(spy.callCount, 1)
                    })

                    it(`should be call {derivateFromPrivate} function with following args 
          ['tprv8fpHND66YGHAydYhpYhW6wPWK3ujE9WukgrUUWTG2BhQoxEXz5jziPqroBCemW4ELqksHU9YHCyFGinsS2KGiNG2Rtxo19gYrtDsiYPXtTb',
          { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'tprv8fpHND66YGHAydYhpYhW6wPWK3ujE9WukgrUUWTG2BhQoxEXz5jziPqroBCemW4ELqksHU9YHCyFGinsS2KGiNG2Rtxo19gYrtDsiYPXtTb',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
        })
    })
    describe('#derivateKeys/errorHandling', () => {
        const cursor = {
            skip: 1,
            limit: 1,
        }
        const masterPrivateKey = {
            masterPrivateKey:
                'xprv9s21ZrQH143K31xYSDQpPDxsXRTUcvj2iNHm5NUtrGiGG5e2DtALGdso3pGz6ssrdK4PFmM8NSpSBHNqPqm55Qn3LqFtT2emdEXVYsCzC2U',
        }
        try {
            instance.derivateKeys({ masterPrivateKey: 'invalidKey' }, cursor) // check behavior in case of non-base58 charackter
        } catch (ex) {
            it('should be throw an error with following message `Non-base58 character`', () => {
                assert.strictEqual(ex.message, 'Non-base58 character')
            })
        }
        try {
            cursor.limit = -1
            instance.derivateKeys(masterPrivateKey, cursor) // check behavior in case of negative limit
        } catch (ex) {
            it('should be throw an error with following message `Limit must be greater than zero`', () => {
                assert.strictEqual(
                    ex.message,
                    'Limit must be greater than zero',
                )
            })
        }
    })

    describe('#sign', () => {
        context('with mainnet network', async () => {
            const privateKey =
                'L58PscmN5Ee1u2t4oCvZNq1YF9rtuwe19CospGwygyBfd3aH7zYy'
            const actual = await instance.sign('fake_data', privateKey, false)
            it(`should be return 8fb2a0f2905d1ae0676489ccebbd1f36093ae86cd65108ad76fdd8fd36b551ff36b92305d1f9b01993326fad7a0864e63cc60ede2f04c32e59de39ef40ebed4f`, () => {
                assert.strictEqual(
                    actual,
                    '8fb2a0f2905d1ae0676489ccebbd1f36093ae86cd65108ad76fdd8fd36b551ff36b92305d1f9b01993326fad7a0864e63cc60ede2f04c32e59de39ef40ebed4f',
                )
            })
            try {
                await instance.sign('fake_data', 'Invalid_Private_Key', false) // check behavior in case of invalid private Key
            } catch (ex) {
                it('should be throw an error with following message `Non-base58 character`', () => {
                    assert.strictEqual(ex.message, 'Non-base58 character')
                })
            }
        })
        context('with testnet network', async () => {
            const privateKey =
                'cUVN2CtwaNBTUdRimGn6qVVhzD7wXk4nQQ6u1BU9vaNQ3oGKhKvw'
            const actual = await instanceWithTestnet.sign(
                'fake_data',
                privateKey,
                false,
            )
            it(`should be return 1fac94bc837983a6569d42a46e6fa5156c2b23b3be9d4c90e1a68f804ed85d6e6b31b044f4b2eac5853d91d29e04bbb9f2f7b4d2a3465fe2ad2a0181abd345ca`, () => {
                assert.strictEqual(
                    actual,
                    '1fac94bc837983a6569d42a46e6fa5156c2b23b3be9d4c90e1a68f804ed85d6e6b31b044f4b2eac5853d91d29e04bbb9f2f7b4d2a3465fe2ad2a0181abd345ca',
                )
            })
            try {
                await instanceWithTestnet.sign(
                    'fake_data',
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

    describe('#getPublicFromPrivate', () => {
        context('with mainnet network', () => {
            const privateKey =
                'L58PscmN5Ee1u2t4oCvZNq1YF9rtuwe19CospGwygyBfd3aH7zYy'
            const actual = instance.getPublicFromPrivate(privateKey)
            it(`should be return 02db7398c945695b9ea17e97a3a09da0adfb46afb94b7fbc8c16561d0c1faedc38`, () => {
                assert.strictEqual(
                    actual,
                    '02db7398c945695b9ea17e97a3a09da0adfb46afb94b7fbc8c16561d0c1faedc38',
                )
            })
            try {
                instance.getPublicFromPrivate('Invalid_Private_Key') // check behavior in case of invalid private Key
            } catch (ex) {
                it('should be throw an error with following message `Non-base58 character`', () => {
                    assert.strictEqual(ex.message, 'Non-base58 character')
                })
            }
        })
        context('with testnet network', () => {
            const privateKey =
                'cUVN2CtwaNBTUdRimGn6qVVhzD7wXk4nQQ6u1BU9vaNQ3oGKhKvw'
            const actual = instanceWithTestnet.getPublicFromPrivate(privateKey)
            it(`should be return 02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d`, () => {
                assert.strictEqual(
                    actual,
                    '02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d',
                )
            })
            try {
                instanceWithTestnet.getPublicFromPrivate('Invalid_Private_Key') // check behavior in case of invalid private Key
            } catch (ex) {
                it('should be throw an error with following message `Non-base58 character`', () => {
                    assert.strictEqual(ex.message, 'Non-base58 character')
                })
            }
        })
    })

    describe('#getAddressFromPublic', () => {
        describe('with mainnet network', () => {
            const publicKey =
                '02db7398c945695b9ea17e97a3a09da0adfb46afb94b7fbc8c16561d0c1faedc38'
            context('Without specifing format', () => {
                const actual = instance.getAddressFromPublic(publicKey)
                it(`should be return 1Nb924nRs93gWVeFnaKH1EE8uLqWGfdkXE`, () => {
                    assert.strictEqual(
                        actual,
                        '1Nb924nRs93gWVeFnaKH1EE8uLqWGfdkXE',
                    )
                })
                try {
                    instance.getAddressFromPublic('Invalid_Public_Key') // check behavior in case of invalid public Key
                } catch (ex) {
                    it('should be throw an error with following message `Expected property "pubkey" of type ?isPoint, got Buffer`', () => {
                        assert.strictEqual(
                            ex.message,
                            'Expected property "pubkey" of type ?isPoint, got Buffer',
                        )
                    })
                }
            })

            context('With bech32 format', () => {
                const actual = instance.getAddressFromPublic(
                    publicKey,
                    'bech32',
                )
                it(`should be return bc1qan8h5sgtak8rh7nrd63dxafhfla7ghrnf6tgr9`, () => {
                    assert.strictEqual(
                        actual,
                        'bc1qan8h5sgtak8rh7nrd63dxafhfla7ghrnf6tgr9',
                    )
                })
            })

            context('With invalid format', () => {
                const actual = instance.getAddressFromPublic(
                    publicKey,
                    'invalid',
                )
                it(`should be return 1Nb924nRs93gWVeFnaKH1EE8uLqWGfdkXE`, () => {
                    assert.strictEqual(
                        actual,
                        '1Nb924nRs93gWVeFnaKH1EE8uLqWGfdkXE',
                    )
                })
            })
        })
        describe('with testnet network', () => {
            const publicKey =
                '02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d'
            context('Without specifing format', () => {
                const actual = instanceWithTestnet.getAddressFromPublic(
                    publicKey,
                )
                it(`should be return miVbbks1Q6ai3oKXPSyTCaRUVcybHYmHQT`, () => {
                    assert.strictEqual(
                        actual,
                        'miVbbks1Q6ai3oKXPSyTCaRUVcybHYmHQT',
                    )
                })
                try {
                    instanceWithTestnet.getAddressFromPublic(
                        'Invalid_Public_Key',
                    ) // check behavior in case of invalid public Key
                } catch (ex) {
                    it('should be throw an error with following message `Expected property "pubkey" of type ?isPoint, got Buffer`', () => {
                        assert.strictEqual(
                            ex.message,
                            'Expected property "pubkey" of type ?isPoint, got Buffer',
                        )
                    })
                }
            })

            context('With bech32 format', () => {
                const actual = instanceWithTestnet.getAddressFromPublic(
                    publicKey,
                    'bech32',
                )
                it(`should be return tb1qyzn2ltksd54s623q2f68qg6l5uv5qpvxdmqs8z`, () => {
                    assert.strictEqual(
                        actual,
                        'tb1qyzn2ltksd54s623q2f68qg6l5uv5qpvxdmqs8z',
                    )
                })
            })

            context('With invalid format', () => {
                const actual = instanceWithTestnet.getAddressFromPublic(
                    publicKey,
                    'invalid',
                )
                it(`should be return miVbbks1Q6ai3oKXPSyTCaRUVcybHYmHQT`, () => {
                    assert.strictEqual(
                        actual,
                        'miVbbks1Q6ai3oKXPSyTCaRUVcybHYmHQT',
                    )
                })
            })
        })
    })

    describe('#checkSign', () => {
        context('with mainnet network', () => {
            const actualPositive = instance.checkSign(
                '02db7398c945695b9ea17e97a3a09da0adfb46afb94b7fbc8c16561d0c1faedc38',
                'fake_data',
                '8fb2a0f2905d1ae0676489ccebbd1f36093ae86cd65108ad76fdd8fd36b551ff36b92305d1f9b01993326fad7a0864e63cc60ede2f04c32e59de39ef40ebed4f',
            )
            it('should be return `true`', () => {
                assert.strictEqual(actualPositive, true)
            })
            try {
                instance.checkSign(
                    'Invalid_Public_Key',
                    'fake_data',
                    '8fb2a0f2905d1ae0676489ccebbd1f36093ae86cd65108ad76fdd8fd36b551ff36b92305d1f9b01993326fad7a0864e63cc60ede2f04c32e59de39ef40ebed4f',
                ) // check behavior in case of invalid public Key
            } catch (ex) {
                it('should be throw an error with following message `Expected isPoint, got Buffer`', () => {
                    assert.strictEqual(
                        ex.message,
                        'Expected isPoint, got Buffer',
                    )
                })
            }
            try {
                instance.checkSign(
                    '02db7398c945695b9ea17e97a3a09da0adfb46afb94b7fbc8c16561d0c1faedc38',
                    'fake_data',
                    'invalid_sign',
                )
            } catch (ex) {
                it('should be throw an error with following message `Expected Signature`', () => {
                    assert.strictEqual(ex.message, 'Expected Signature')
                })
            }
        })
        context('with testnet network', () => {
            const actualPositive = instanceWithTestnet.checkSign(
                '02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d',
                'fake_data',
                '1fac94bc837983a6569d42a46e6fa5156c2b23b3be9d4c90e1a68f804ed85d6e6b31b044f4b2eac5853d91d29e04bbb9f2f7b4d2a3465fe2ad2a0181abd345ca',
            )
            it('should be return `true`', () => {
                assert.strictEqual(actualPositive, true)
            })
            try {
                instanceWithTestnet.checkSign(
                    'Invalid_Public_Key',
                    'fake_data',
                    '1fac94bc837983a6569d42a46e6fa5156c2b23b3be9d4c90e1a68f804ed85d6e6b31b044f4b2eac5853d91d29e04bbb9f2f7b4d2a3465fe2ad2a0181abd345ca',
                ) // check behavior in case of invalid public Key
            } catch (ex) {
                it('should be throw an error with following message `Expected isPoint, got Buffer`', () => {
                    assert.strictEqual(
                        ex.message,
                        'Expected isPoint, got Buffer',
                    )
                })
            }
            try {
                instanceWithTestnet.checkSign(
                    '02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d',
                    'fake_data',
                    'invalid_sign',
                )
            } catch (ex) {
                it('should be throw an error with following message `Expected Signature`', () => {
                    assert.strictEqual(ex.message, 'Expected Signature')
                })
            }
        })
    })

    describe('#signTx', () => {
        context('with testnet network', async () => {

            const data = '{"sum":"50000","fee":"452","inputs":[{"txId":"b188ea4c9e5631e9e5b099d9f28d47ce09d0df92bbffe2fa49f7b0d29fc3cd6b","hex":"01000000000101fef9a4243f8059c52fb8ea5f432dc5db65cb656800a64cbd81f719a9fb98de630100000000f0ffffff03400d0300000000001976a914dbf95284089cdc64d92a1f6ef3ef50a0b396e15988acc71a0c0000000000160014658fa3b17fc277493a0e792bf2e139209cc757c00000000000000000196a1768747470733a2f2f746c74632e6269746170732e636f6d02483045022100b24ae7a9b4427691a28144d94049867a1ff14fe6d4af8ab34e9143cec259e25c02204925f404f49f8e030846d655594590a3cc5ef0a0c727f691b969729a8b3732c30121022183beb67441a0cd53f94a0682cfc12fbd2d1ef44feef38e4a001ca1444dd94900000000","n":0,"value":"200000","address":"n1a4xHRCNYGQhQDA19j83xdXSsM83oFrkx","type":"pubkeyhash","scriptPubKeyHex":"76a914dbf95284089cdc64d92a1f6ef3ef50a0b396e15988ac"}],"outputs":[{"address":"mqdGFzXHixreCSmicjpcV2RBX5TamMM3zL","amount":"50000"},{"address":"n1a4xHRCNYGQhQDA19j83xdXSsM83oFrkx","amount":"149548"}]}';
            const privateKey =
                JSON.stringify({ 'n1a4xHRCNYGQhQDA19j83xdXSsM83oFrkx': 'cUnTHCW9ANikp5t1eXF6a39qUQb4ombmLXqiDHUTfk2JCHHXtot2' })

            const actual = await instanceWithTestnet.sign(
                data,
                privateKey,
                true,
            )


            it('should be return `02000000016bcdc39fd2b0f749fae2ffbb92dfd009ce478df2d999b0e5e931569e4cea88b1000000006a47304402207d3d826262421cd4b3bef987e9461586fe4f819a5c5c805619216e02f4ada2f40220373739fcbfae77d96de3a984c990c4c19e23c42763562d1af71f674ae7be1d4c012103450cc14421e64896fc7f96320083d1a50b66b1ec9a75ed2b533338dc7ea8d0ceffffffff0250c30000000000001976a9146ee2bfe4a80de0a89b0aea9d3a71e9a99f4a788388ac2c480200000000001976a914dbf95284089cdc64d92a1f6ef3ef50a0b396e15988ac00000000`', () => {
                assert.strictEqual(
                    actual,
                    '02000000016bcdc39fd2b0f749fae2ffbb92dfd009ce478df2d999b0e5e931569e4cea88b1000000006a47304402207d3d826262421cd4b3bef987e9461586fe4f819a5c5c805619216e02f4ada2f40220373739fcbfae77d96de3a984c990c4c19e23c42763562d1af71f674ae7be1d4c012103450cc14421e64896fc7f96320083d1a50b66b1ec9a75ed2b533338dc7ea8d0ceffffffff0250c30000000000001976a9146ee2bfe4a80de0a89b0aea9d3a71e9a99f4a788388ac2c480200000000001976a914dbf95284089cdc64d92a1f6ef3ef50a0b396e15988ac00000000',
                )
            })
            try {
                await instanceWithTestnet.sign(
                    data,
                    "{\"n1a4xHRCNYGQhQDA19j83xdXSsM83oFrkx\":\"ali32142\"}",
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
