import * as assert from 'assert'
import * as sinon from 'sinon'
import { describe, it, after, before } from 'mocha'
import { Keys } from '../src/lib'
import { Network, Blockchain } from '../src/types'
import { EOS } from '../src/blockchains/eos'

describe('Lib/EOS', () => {
    const instance = new Keys(Blockchain.EOS, Network.MAINNET)
    const instanceWithTestnet = new Keys(Blockchain.EOS, Network.TESTNET)
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
                    blockchain: 'eos',
                    network: 'mainnet',
                    path: "m/44'/194'/0'/0/0",
                },
                {
                    blockchain: 'eos',
                    network: 'testnet',
                    path: "m/44'/1'/0'/0/0",
                },
            ]
            assert.deepEqual(actualPaths, expectedPaths)
        })
    })

    describe('#checkSeedPhrase', () => {
        const seedPhrase =
            'error usual erupt time awkward piano tomorrow web special series tumble intact'
        const actual = instance.checkSeedPhrase(seedPhrase)
        it('should return `true`', () => {
            assert.strictEqual(actual, true)
        })
    })

    describe('#derivateKeys', () => {
        context('with mainnet network', () => {
            context('with masterPrivateKey', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(EOS.prototype, 'derivateFromPrivate')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated By: https://iancoleman.io/bip39/
                     */
                    const masterPrivateKey = {
                        masterPrivateKey:
                            'xprv9s21ZrQH143K4LeEx2APdhYcizQf1yTEERrB6TtpAjhH76kiRWNWUccfpQsTe1w5ehpu62FdMfoy47ntcPK772qwEGUjZkzuXh31v5Um6ie',
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
                            path: "m/44'/194'/0'/0/2",
                            address:
                                'EOS87oAHjey1Hy5Qcod56MBgCSSaYQ52DfekSWsqdku3VckVaw2y5',
                            publicKey:
                                'EOS87oAHjey1Hy5Qcod56MBgCSSaYQ52DfekSWsqdku3VckVaw2y5',
                            privateKey:
                                '5JJLUNPjAvJ1X3toeJLXSTk7Do8h9DmC6UnpqmF2SmnSd61upcr',
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
          ['xprv9s21ZrQH143K4LeEx2APdhYcizQf1yTEERrB6TtpAjhH76kiRWNWUccfpQsTe1w5ehpu62FdMfoy47ntcPK772qwEGUjZkzuXh31v5Um6ie',
          { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'xprv9s21ZrQH143K4LeEx2APdhYcizQf1yTEERrB6TtpAjhH76kiRWNWUccfpQsTe1w5ehpu62FdMfoy47ntcPK772qwEGUjZkzuXh31v5Um6ie',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
            context('with masterPublicKey', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(EOS.prototype, 'derivateFromPublic')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated By: https://iancoleman.io/bip39/
                     */
                    const masterPublicKey = {
                        masterPublicKey:
                            'xpub6G1LhBJRwLPWGn2wGdP8SpBpKSQSL8bVwbzbuADCw1DohkBWCKzi9H4T2uaSDxG77U6DNmPCBSWX7kpaPnUMbQnaox9MjJYjSiUeDrzqudC',
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
                            path: "m/44'/194'/0'/0/2",
                            address:
                                'EOS7yx1h4wrdrkxwrMjAb75RDLJdXy1dAuCaS18xCqayRdwWrzZ1Q',
                            publicKey:
                                'EOS7yx1h4wrdrkxwrMjAb75RDLJdXy1dAuCaS18xCqayRdwWrzZ1Q',
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
          ['xpub6G1LhBJRwLPWGn2wGdP8SpBpKSQSL8bVwbzbuADCw1DohkBWCKzi9H4T2uaSDxG77U6DNmPCBSWX7kpaPnUMbQnaox9MjJYjSiUeDrzqudC',
          { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'xpub6G1LhBJRwLPWGn2wGdP8SpBpKSQSL8bVwbzbuADCw1DohkBWCKzi9H4T2uaSDxG77U6DNmPCBSWX7kpaPnUMbQnaox9MjJYjSiUeDrzqudC',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
            context('with seedPhrase', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(EOS.prototype, 'derivateFromPrivate')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated By: https://iancoleman.io/bip39/
                     */
                    const seedPhrase = {
                        seedPhrase:
                            'december carry bless goose surge object reduce tomato chef hollow box drill name answer tumble',
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
                            path: "m/44'/194'/0'/0/2",
                            address:
                                'EOS7MFWdhfMYSLN3gK48Ucx3ob4i28SZ5MfdgzfA8Xvz4KYkyjfAj',
                            publicKey:
                                'EOS7MFWdhfMYSLN3gK48Ucx3ob4i28SZ5MfdgzfA8Xvz4KYkyjfAj',
                            privateKey:
                                '5HuwRWZYCgcbwemoFn2D2KTmqCyKXzYWjr51qCDeTmSytcabmh5',
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
          ['xprv9s21ZrQH143K2jPo7ik5Wq7V5vx5J8zDALgyzgn9YDHjLwnMWbiVW6Ja7z1yHkQmpkRifgLVPouF2AaU9KgaBXAohpN7QPNPPmi4DNu6bsd',
          { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'xprv9s21ZrQH143K2jPo7ik5Wq7V5vx5J8zDALgyzgn9YDHjLwnMWbiVW6Ja7z1yHkQmpkRifgLVPouF2AaU9KgaBXAohpN7QPNPPmi4DNu6bsd',
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
                    spy = sinon.spy(EOS.prototype, 'derivateFromPrivate')
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
                                'EOS6NSj1rroK1cXLve4pXW5YRUVYrk7c7L59GFRrribSgy9FpV8Xm',
                            publicKey:
                                'EOS6NSj1rroK1cXLve4pXW5YRUVYrk7c7L59GFRrribSgy9FpV8Xm',
                            privateKey:
                                '5KP4XRfzMTcqnMcDmq2MVp8ApoQTUi12D6Cep55gHsTbctvMYA8',
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
                    spy = sinon.spy(EOS.prototype, 'derivateFromPublic')
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
                                'EOS6o2wL5XTqo58fWwHFM5YMuUxXGRqZCEtFx9yaJVJ2uQWZsniVP',
                            publicKey:
                                'EOS6o2wL5XTqo58fWwHFM5YMuUxXGRqZCEtFx9yaJVJ2uQWZsniVP',
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
                    spy = sinon.spy(EOS.prototype, 'derivateFromPrivate')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated by: https://iancoleman.io/bip39/
                     */
                    const seedPhrase = {
                        seedPhrase:
                            'cruise quick regular reward arrow rich exercise chair mad slim flame creek aerobic airport oak',
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
                            path: "m/44'/1'/0'/0/0",
                            address: 'mrXkT1bveXsHUVwFiSC1SEV7daSUQsgqFd',
                            publicKey:
                                '0220f62994c468d5a407e26c41760a9cec5d5359743c7a34ae6fbcdd5726da3c82',
                            privateKey:
                                'cW5BJw2xfZXmaMdcjwnae4SgXAQPPuPc2xjTZs2FqZTQ7r3nCv7y',
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
          ['xprv9s21ZrQH143K38um1cGFixh4D6ntV4aaRtnTbVHoFk93hkEKRdx5wAqLfehEVeMAa3xYW9yv6UsgQ5ydvinCcDyRx52KF3QrDzoUgpwvNZS',
          { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'xprv9s21ZrQH143K38um1cGFixh4D6ntV4aaRtnTbVHoFk93hkEKRdx5wAqLfehEVeMAa3xYW9yv6UsgQ5ydvinCcDyRx52KF3QrDzoUgpwvNZS',
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
                'xprv9s21ZrQH143K4GDgGdjc6v946MMpyzHtzyGfSxRPBBPQnUEpoCiSSDKAppRm3jKACyWp3gfVtSK9UcDZ1PetByXmYZ1agFerj9dtcG7KSUc',
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
        context('with mainnet network', () => {
            const privateKey =
                '5KauJcw5Xh5MazAqcwPBL5gXMP9eZQE8YLqTH2Q9xscLhvdHHSF'
            const actual = instance.sign('fake_data', privateKey)
            it('should be return `SIG_K1_KeurYw2XHnXHpi6HpyHGzCz43ucBa5x9JP56ZeYHYLN92WhmZ9nrvyGxisCCkxrNoeAhMwrJxZCkXtuGEmrp9f4tR7HdGo`', () => {
                assert.strictEqual(
                    actual,
                    'SIG_K1_KeurYw2XHnXHpi6HpyHGzCz43ucBa5x9JP56ZeYHYLN92WhmZ9nrvyGxisCCkxrNoeAhMwrJxZCkXtuGEmrp9f4tR7HdGo',
                )
            })
            try {
                instance.sign('fake_data', 'Invalid_Private_Key') // check behavior in case of invalid private Key
            } catch (ex) {
                it('should be throw an error with following message `Non-base58 character`', () => {
                    assert.strictEqual(ex.message, 'Non-base58 character')
                })
            }
        })
        context('with testnet network', () => {
            const privateKey =
                '5KP4XRfzMTcqnMcDmq2MVp8ApoQTUi12D6Cep55gHsTbctvMYA8'
            const actual = instanceWithTestnet.sign('fake_data', privateKey)
            it(`should be return SIG_K1_JyQ7zkQgv4GN6PaxvgTRUUuXQGPbfXDvwJNio4G1cTRqkBoP39vKswaX9BPffj1aZDaYw9f4pZPP8XYX8Xj5spdoL84dBJ`, () => {
                assert.strictEqual(
                    actual,
                    'SIG_K1_JyQ7zkQgv4GN6PaxvgTRUUuXQGPbfXDvwJNio4G1cTRqkBoP39vKswaX9BPffj1aZDaYw9f4pZPP8XYX8Xj5spdoL84dBJ',
                )
            })
            try {
                instanceWithTestnet.sign('fake_data', 'Invalid_Private_Key') // check behavior in case of invalid private Key
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
                '5KauJcw5Xh5MazAqcwPBL5gXMP9eZQE8YLqTH2Q9xscLhvdHHSF'
            const actual = instance.getPublicFromPrivate(privateKey)
            it(`should be return EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy`, () => {
                assert.strictEqual(
                    actual,
                    'EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy',
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
                '5KP4XRfzMTcqnMcDmq2MVp8ApoQTUi12D6Cep55gHsTbctvMYA8'
            const actual = instanceWithTestnet.getPublicFromPrivate(privateKey)
            it(`should be return EOS6NSj1rroK1cXLve4pXW5YRUVYrk7c7L59GFRrribSgy9FpV8Xm`, () => {
                assert.strictEqual(
                    actual,
                    'EOS6NSj1rroK1cXLve4pXW5YRUVYrk7c7L59GFRrribSgy9FpV8Xm',
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
                'EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy'
            context('Without specifing format', () => {
                const actual = instance.getAddressFromPublic(publicKey)
                it(`should be return EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy`, () => {
                    assert.strictEqual(
                        actual,
                        'EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy',
                    )
                })
            })
            context('With bech32 format', () => {
                const actual = instance.getAddressFromPublic(
                    publicKey,
                    'bech32',
                )
                it(`should be return EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy`, () => {
                    assert.strictEqual(
                        actual,
                        'EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy',
                    )
                })
                try {
                    instance.getAddressFromPublic('Invalid_Public_Key') // check behavior in case of invalid public Key
                } catch (ex) {
                    it('should be throw an error with following message `Expected public key to be an Uint8Array with length [33, 65]`', () => {
                        assert.strictEqual(
                            ex.message,
                            'Expected public key to be an Uint8Array with length [33, 65]',
                        )
                    })
                }
            })

            context('With invalid format', () => {
                const actual = instance.getAddressFromPublic(
                    publicKey,
                    'invalid',
                )
                it(`should be return EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy`, () => {
                    assert.strictEqual(
                        actual,
                        'EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy',
                    )
                })
            })
        })
        describe('with testnet network', () => {
            const publicKey =
                'EOS6o2wL5XTqo58fWwHFM5YMuUxXGRqZCEtFx9yaJVJ2uQWZsniVP'
            context('Without specifing format', () => {
                const actual = instanceWithTestnet.getAddressFromPublic(
                    publicKey,
                )
                it(`should be return EOS6o2wL5XTqo58fWwHFM5YMuUxXGRqZCEtFx9yaJVJ2uQWZsniVP`, () => {
                    assert.strictEqual(
                        actual,
                        'EOS6o2wL5XTqo58fWwHFM5YMuUxXGRqZCEtFx9yaJVJ2uQWZsniVP',
                    )
                })
                try {
                    instanceWithTestnet.getAddressFromPublic(
                        'Invalid_Public_Key',
                    ) // check behavior in case of invalid public Key
                } catch (ex) {
                    it('should be throw an error with following message `Expected public key to be an Uint8Array with length [33, 65]`', () => {
                        assert.strictEqual(
                            ex.message,
                            'Expected public key to be an Uint8Array with length [33, 65]',
                        )
                    })
                }
            })

            context('With bech32 format', () => {
                const actual = instanceWithTestnet.getAddressFromPublic(
                    publicKey,
                    'bech32',
                )
                it(`should be return EOS6o2wL5XTqo58fWwHFM5YMuUxXGRqZCEtFx9yaJVJ2uQWZsniVP`, () => {
                    assert.strictEqual(
                        actual,
                        'EOS6o2wL5XTqo58fWwHFM5YMuUxXGRqZCEtFx9yaJVJ2uQWZsniVP',
                    )
                })
            })

            context('With invalid format', () => {
                const actual = instanceWithTestnet.getAddressFromPublic(
                    publicKey,
                    'invalid',
                )
                it(`should be return EOS6o2wL5XTqo58fWwHFM5YMuUxXGRqZCEtFx9yaJVJ2uQWZsniVP`, () => {
                    assert.strictEqual(
                        actual,
                        'EOS6o2wL5XTqo58fWwHFM5YMuUxXGRqZCEtFx9yaJVJ2uQWZsniVP',
                    )
                })
            })
        })
    })

    describe('#checkSign', () => {
        context('with mainnet network', () => {
            const actual = instance.checkSign(
                'EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy',
                'fake_data',
                'SIG_K1_KeurYw2XHnXHpi6HpyHGzCz43ucBa5x9JP56ZeYHYLN92WhmZ9nrvyGxisCCkxrNoeAhMwrJxZCkXtuGEmrp9f4tR7HdGo',
            )
            it('should be return `true`', () => {
                assert.strictEqual(actual, true)
            })
            try {
                instance.checkSign(
                    'EOS75R1yUfXX6XmpvWtHRfRqVPWxxW4HJvgTjB37dKxDaUiuj1DFy',
                    'fake_data',
                    'invalid_sign',
                )
            } catch (ex) {
                it('should be throw an error with following message `Expecting signature like: SIG_K1_base58signature..`', () => {
                    assert.strictEqual(
                        ex.message,
                        'Expecting signature like: SIG_K1_base58signature..',
                    )
                })
            }
        })
        context('with testnet network', () => {
            const actual = instanceWithTestnet.checkSign(
                'EOS6NSj1rroK1cXLve4pXW5YRUVYrk7c7L59GFRrribSgy9FpV8Xm',
                'fake_data',
                'SIG_K1_JyQ7zkQgv4GN6PaxvgTRUUuXQGPbfXDvwJNio4G1cTRqkBoP39vKswaX9BPffj1aZDaYw9f4pZPP8XYX8Xj5spdoL84dBJ',
            )
            it('should be return `true`', () => {
                assert.strictEqual(actual, true)
            })
            try {
                instanceWithTestnet.checkSign(
                    'EOS6NSj1rroK1cXLve4pXW5YRUVYrk7c7L59GFRrribSgy9FpV8Xm',
                    'fake_data',
                    'invalid_sign',
                )
            } catch (ex) {
                it('should be throw an error with following message `Expecting signature like: SIG_K1_base58signature..`', () => {
                    assert.strictEqual(
                        ex.message,
                        'Expecting signature like: SIG_K1_base58signature..',
                    )
                })
            }
        })
    })
})
