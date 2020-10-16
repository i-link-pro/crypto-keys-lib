import * as assert from 'assert'
import * as sinon from 'sinon'
import { describe, it, after, before } from 'mocha'
import { Keys } from '../src/lib'
import { Network, Blockchain } from '../src/types'
import { Ripple } from '../src/blockchains/ripple'

describe('Lib/Ripple', () => {
    const instance = new Keys(Blockchain.RIPPLE, Network.MAINNET)
    const instanceWithTestnet = new Keys(Blockchain.RIPPLE, Network.TESTNET)
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

        it(`should be return \`${seed['masterPrivateKey']}\ masterPrivateKey`, () => {
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
                    blockchain: 'ripple',
                    network: 'mainnet',
                    path: "m/44'/144'/0'/0/0",
                },
                {
                    blockchain: 'ripple',
                    network: 'testnet',
                    path: "m/44'/1'/0'/0/0",
                },
            ]
            assert.deepEqual(actualPaths, expectedPaths)
        })
    })

    describe('#checkSeedPhrase', () => {
        const seedPhrase =
            'wolf extra expand cause vocal worth cricket era board word ability limit'
        const actualPositive: boolean | Error = instance.checkSeedPhrase(
            seedPhrase,
        )
        it('should return `true`', () => {
            assert.strictEqual(actualPositive, true)
        })
        const actualNegative: boolean | Error = instance.checkSeedPhrase(
            'invalid',
        )
        it('should return `false`', () => {
            assert.strictEqual(actualNegative, false)
        })
    })

    describe('#derivateKeys', () => {
        context('with mainnet network', () => {
            context('with masterPrivateKey', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(Ripple.prototype, 'derivateFromPrivate')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated By: https://iancoleman.io/bip39/
                     */
                    const masterPrivateKey = {
                        masterPrivateKey:
                            'xprv9s21ZrQH143K322zF5PBbG4mLk3nbh3rnqRqPac9tBMp2beRCtNb4qPTztmyarBnw61ncV8WXJZaHagB9tSTdz91gCr9MbHwJaoefXGxEhi',
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
                            path: "m/44'/144'/0'/0/2",
                            address:
                                'X75QNrsgYw2mNt1uV7vXCNNCR3DTzzgWPFb5VTc1U6ii5iJ',
                            publicKey:
                                '02d12ff6f0db434aa2f4ea4c4893a8ebcc81ca4ec36bdde8c8348e927e38f2c547',
                            privateKey:
                                '9f13ee780021fe7a8c3ebc7c78cfcbc9acdc1aa6df8bea77a6ac3039e166d04d',
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
          ['xprv9s21ZrQH143K322zF5PBbG4mLk3nbh3rnqRqPac9tBMp2beRCtNb4qPTztmyarBnw61ncV8WXJZaHagB9tSTdz91gCr9MbHwJaoefXGxEhi',
          { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'xprv9s21ZrQH143K322zF5PBbG4mLk3nbh3rnqRqPac9tBMp2beRCtNb4qPTztmyarBnw61ncV8WXJZaHagB9tSTdz91gCr9MbHwJaoefXGxEhi',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
            context('with masterPublicKey', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(Ripple.prototype, 'derivateFromPublic')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated By: https://iancoleman.io/bip39/
                     */
                    const masterPublicKey = {
                        masterPublicKey:
                            'xpub67vnTn18WV2mrUVgbYdKaiY136m5eueGc5Efq8Utzx9hUKYwGG4RwpxegfdpZSvY8katKucKDFVFsyB8hVHyUd2bZNNKZJEq6uAY8xHBjKA',
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
                            path: "m/44'/144'/0'/0/2",
                            address:
                                'XVCsL2ZCTcas2acZNxcWVt5Hb9nbnLT4UjW7dZ6G7HAiHzZ',
                            publicKey:
                                '028c65680c55077114d0c34221a2154e4659f27d0839791ee13fbd0a0711c85441',
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

                    it(`should be call {derivateFromPrivate} function 1 time`, () => {
                        assert.strictEqual(spy.callCount, 1)
                    })

                    it(`should be call {derivateFromPrivate} function with following args 
          ['xpub67vnTn18WV2mrUVgbYdKaiY136m5eueGc5Efq8Utzx9hUKYwGG4RwpxegfdpZSvY8katKucKDFVFsyB8hVHyUd2bZNNKZJEq6uAY8xHBjKA',
          { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'xpub67vnTn18WV2mrUVgbYdKaiY136m5eueGc5Efq8Utzx9hUKYwGG4RwpxegfdpZSvY8katKucKDFVFsyB8hVHyUd2bZNNKZJEq6uAY8xHBjKA',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
            context('with seedPhrase', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(Ripple.prototype, 'derivateFromPrivate')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated By: https://iancoleman.io/bip39/
                     */
                    const seedPhrase = {
                        seedPhrase:
                            'oval gather baby voyage second ritual awake sentence leader float punch wish dose concert whale',
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
                            path: "m/44'/144'/0'/0/2",
                            address:
                                'X75QNrsgYw2mNt1uV7vXCNNCR3DTzzgWPFb5VTc1U6ii5iJ',
                            publicKey:
                                '02d12ff6f0db434aa2f4ea4c4893a8ebcc81ca4ec36bdde8c8348e927e38f2c547',
                            privateKey:
                                '9f13ee780021fe7a8c3ebc7c78cfcbc9acdc1aa6df8bea77a6ac3039e166d04d',
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
          ['xprv9zEFWzJ1fjPGZsQCt9zY6zjUDvpjwFqJDzEECLBKxeRR41DR33ZFvs6hHYZKvFnKffMCiL48wEMQZjFiYLPRiTPwN7hx8ytjhp8BFuY6dLc',
          { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'xprv9zEFWzJ1fjPGZsQCt9zY6zjUDvpjwFqJDzEECLBKxeRR41DR33ZFvs6hHYZKvFnKffMCiL48wEMQZjFiYLPRiTPwN7hx8ytjhp8BFuY6dLc',
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
                    spy = sinon.spy(Ripple.prototype, 'derivateFromPrivate')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated By: https://iancoleman.io/bip39/
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
                            address:
                                'X7dEPNo7dX2gmZ1pWLiocnqvUzfvqkUMKPZaHYFc3ncmLx8',
                            publicKey:
                                '02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d',
                            privateKey:
                                'ce1d919795a87346b29aeb11bdd95f9608169ed9dc2e60c4dd81d43dd6b69949',
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
                    spy = sinon.spy(Ripple.prototype, 'derivateFromPublic')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated By: https://iancoleman.io/bip39/
                     */
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
                            address:
                                'XVEu4JT6p9YJedsuCziTFN6LZcb5VoqGhG5HrdajcYZqkLd',
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

                    it(`should be call {derivateFromPrivate} function 1 time`, () => {
                        assert.strictEqual(spy.callCount, 1)
                    })

                    it(`should be call {derivateFromPrivate} function with following args 
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
                    spy = sinon.spy(Ripple.prototype, 'derivateFromPrivate')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated By: https://iancoleman.io/bip39/
                     */
                    const seedPhrase = {
                        seedPhrase:
                            'pause hawk click gadget ivory tent feature poverty manage ivory innocent stand debate veteran penalty',
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
                            address:
                                'XVpxcpi1z6gz2QXEg5TzUQyumcYswurUvrX4LMK17iYVNjY',
                            publicKey:
                                '034a10344d4794febdd46a1afe38e421cd4d88c8c1f33081958ee31cb689287f76',
                            privateKey:
                                '67a45a6273fe2157a152f3cdcf097e3645f24a1ee89786d704f66be1eeb86309',
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
          ['tprv8gyunU4DX6XAHL54QKg1wKmAY7Wp2BeeZ7sknECj71ca5ATM2HG9dQ9RvTQoSM5NmXwx6LjfzFRCJJ8zoXFfhcdUdGgSd1XshSjSXGWqnjS',
          { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'tprv8gyunU4DX6XAHL54QKg1wKmAY7Wp2BeeZ7sknECj71ca5ATM2HG9dQ9RvTQoSM5NmXwx6LjfzFRCJJ8zoXFfhcdUdGgSd1XshSjSXGWqnjS',
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
                'xprv9s21ZrQH143K2aSeenTNZ5iYEUVzvzTriKKtTWmUN2VhHW7Az2xDW3gNZ5cSHxAfZZQNp1nfKECfJKBeA8Ne9zzS5fiUHqwDt6SfiKyq9cY',
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
                'L2fDxPGkZTRoasvqbUJDyf5XwHRqLGFGXUhXpinXKY1fPtzkVuM1'
            const actual = await instance.sign('fake_data', privateKey, false)
            it('should be return `30440220110A823EC57DE58D2BBFE34E4FE3464BFFD2997E952C00E534B5AF3B92FF51A80220112C3B818AA2BDDEA761236B4A23FBB741071407E56A6C7B1CBD6F93CF36FB08`', () => {
                assert.strictEqual(
                    actual,
                    '30440220110A823EC57DE58D2BBFE34E4FE3464BFFD2997E952C00E534B5AF3B92FF51A80220112C3B818AA2BDDEA761236B4A23FBB741071407E56A6C7B1CBD6F93CF36FB08',
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
            it('should be return `304402203E7B99740A0ABD9B2AFC9A0B686EEB0D7A00057253D88735682A4B65FF4B1653022057C400B464FF0F1A570BF0B73F0076D2DACB2ED43E4739D5FB675C6337210242`', () => {
                assert.strictEqual(
                    actual,
                    '304402203E7B99740A0ABD9B2AFC9A0B686EEB0D7A00057253D88735682A4B65FF4B1653022057C400B464FF0F1A570BF0B73F0076D2DACB2ED43E4739D5FB675C6337210242',
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
                'L2fDxPGkZTRoasvqbUJDyf5XwHRqLGFGXUhXpinXKY1fPtzkVuM1'
            const actual = instance.getPublicFromPrivate(privateKey)
            it(`should be return 02d018cbcbb62a18d231cb64342dbbbd95f1f3bc21aa7f8da0f334b69110fc4a05`, () => {
                assert.strictEqual(
                    actual,
                    '02d018cbcbb62a18d231cb64342dbbbd95f1f3bc21aa7f8da0f334b69110fc4a05',
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
                '02d018cbcbb62a18d231cb64342dbbbd95f1f3bc21aa7f8da0f334b69110fc4a05'
            context('without specifying format', () => {
                const actual = instance.getAddressFromPublic(publicKey)
                it(`should be return XVmKGwrZEEmhss7XR5YqPygAmaeWoBzKhWYovtE1tZp9Fet`, () => {
                    assert.strictEqual(
                        actual,
                        'XVmKGwrZEEmhss7XR5YqPygAmaeWoBzKhWYovtE1tZp9Fet',
                    )
                })
            })
            context('with classic format', () => {
                const actual = instance.getAddressFromPublic(
                    publicKey,
                    'classic',
                )
                it(`should be return rQEbEkWa4RVdaSZiM3RveKSusujAE8xvbX`, () => {
                    assert.strictEqual(
                        actual,
                        'rQEbEkWa4RVdaSZiM3RveKSusujAE8xvbX',
                    )
                })
                try {
                    instance.getAddressFromPublic('Invalid_Public_Key') // check behavior in case of invalid public Key
                } catch (ex) {
                    it('should be throw an error with following message `Invalid character in Invalid_Public_Key`', () => {
                        assert.strictEqual(
                            ex.message,
                            'Invalid character in Invalid_Public_Key',
                        )
                    })
                }
            })
            context('With invalid format', () => {
                const actual = instance.getAddressFromPublic(
                    publicKey,
                    'invalid',
                )
                it(`should be return XVmKGwrZEEmhss7XR5YqPygAmaeWoBzKhWYovtE1tZp9Fet`, () => {
                    assert.strictEqual(
                        actual,
                        'XVmKGwrZEEmhss7XR5YqPygAmaeWoBzKhWYovtE1tZp9Fet',
                    )
                })
            })
        })
        describe('with testnet network', () => {
            const publicKey =
                '02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d'
            context('without specifying format', () => {
                const actual = instanceWithTestnet.getAddressFromPublic(
                    publicKey,
                )
                it(`should be return X7dEPNo7dX2gmZ1pWLiocnqvUzfvqkUMKPZaHYFc3ncmLx8`, () => {
                    assert.strictEqual(
                        actual,
                        'X7dEPNo7dX2gmZ1pWLiocnqvUzfvqkUMKPZaHYFc3ncmLx8',
                    )
                })
            })
            context('with classic format', () => {
                const actual = instanceWithTestnet.getAddressFromPublic(
                    publicKey,
                    'classic',
                )
                it(`should be return rsyeJ68pbn9TGgquCtrn4CD9dd4tHn8pgx`, () => {
                    assert.strictEqual(
                        actual,
                        'rsyeJ68pbn9TGgquCtrn4CD9dd4tHn8pgx',
                    )
                })
                try {
                    instanceWithTestnet.getAddressFromPublic(
                        'Invalid_Public_Key',
                    ) // check behavior in case of invalid public Key
                } catch (ex) {
                    it('should be throw an error with following message `Invalid character in Invalid_Public_Key`', () => {
                        assert.strictEqual(
                            ex.message,
                            'Invalid character in Invalid_Public_Key',
                        )
                    })
                }
            })
            context('With invalid format', () => {
                const actual = instanceWithTestnet.getAddressFromPublic(
                    publicKey,
                    'invalid',
                )
                it(`should be return X7dEPNo7dX2gmZ1pWLiocnqvUzfvqkUMKPZaHYFc3ncmLx8`, () => {
                    assert.strictEqual(
                        actual,
                        'X7dEPNo7dX2gmZ1pWLiocnqvUzfvqkUMKPZaHYFc3ncmLx8',
                    )
                })
            })
        })
    })

    describe('#checkSign', () => {
        context('with mainnet network', () => {
            const actual = instance.checkSign(
                '02d018cbcbb62a18d231cb64342dbbbd95f1f3bc21aa7f8da0f334b69110fc4a05',
                'fake_data',
                '30440220110A823EC57DE58D2BBFE34E4FE3464BFFD2997E952C00E534B5AF3B92FF51A80220112C3B818AA2BDDEA761236B4A23FBB741071407E56A6C7B1CBD6F93CF36FB08',
            )
            it('should be return `true`', () => {
                assert.strictEqual(actual, true)
            })
        })
    })
    context('with testnet network', () => {
        const actual = instanceWithTestnet.checkSign(
            '02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d',
            'fake_data',
            '304402203E7B99740A0ABD9B2AFC9A0B686EEB0D7A00057253D88735682A4B65FF4B1653022057C400B464FF0F1A570BF0B73F0076D2DACB2ED43E4739D5FB675C6337210242',
        )
        it('should be return `true`', () => {
            assert.strictEqual(actual, true)
        })
    })

    describe('#signTx', () => {
        context('with testnet network', async () => {
            const data =
                '{"TransactionType":"Payment","Account":"rwAJdrPAgg5UET1i6ogXtNiD6SYC8C98wy","Destination":"rhwnKpzV4LrvDc56kU4JzwqkkUDbNQB4Dg","Amount":"100000","Flags":2147483648,"Fee":"12","LastLedgerSequence":11268803,"Sequence":11047194}'
            const privateKey = JSON.stringify({
                XVrvjLaYovoGnqyhJV2rsZH9H9E6ycYdfPT4PsncMKoNbfN:
                    'bd5ed94a1d3bd21784b29ea4752a092109b31ae73f5e90800f457c1b9ed59a38',
            })

            const actual = await instanceWithTestnet.sign(
                data,
                privateKey,
                true,
            )

            it('should be return `12000022800000002400A8911A201B00ABF2C36140000000000186A068400000000000000C73210284A9439F6DDF2429B12064445E07A129DAF774B70C65ABB97096B3E79A4DB8077446304402205154AD0484DB83B9E4D19858BCC2D0507A90455E01DB7E37718F215332C8C32802205E8880B582B3A3E3311D0639FDBAF4E2606842353BD9BDEDB0BFB843AB6649E181146CFE4D97F22565284F389FC222332335CD04F0FA8314229FB83774ECD1F6BF020A1A1888AB0E53910529`', () => {
                assert.strictEqual(
                    actual,
                    '12000022800000002400A8911A201B00ABF2C36140000000000186A068400000000000000C73210284A9439F6DDF2429B12064445E07A129DAF774B70C65ABB97096B3E79A4DB8077446304402205154AD0484DB83B9E4D19858BCC2D0507A90455E01DB7E37718F215332C8C32802205E8880B582B3A3E3311D0639FDBAF4E2606842353BD9BDEDB0BFB843AB6649E181146CFE4D97F22565284F389FC222332335CD04F0FA8314229FB83774ECD1F6BF020A1A1888AB0E53910529',
                )
            })
            try {
                await instanceWithTestnet.sign(
                    data,
                    '{"XVrvjLaYovoGnqyhJV2rsZH9H9E6ycYdfPT4PsncMKoNbfN":"bd5ed94a1d3bd21784b29ea4752a092109b31ae73f5e90800f457c1b9ed59a31"}',
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
