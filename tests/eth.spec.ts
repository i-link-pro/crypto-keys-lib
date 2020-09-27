import * as assert from 'assert'
import * as sinon from 'sinon'
import { describe, it, after, before } from 'mocha'
import { Keys } from '../src/lib'
import { Network, Blockchain } from '../src/types'
import { Ethereum } from '../src/blockchains/ethereum'

describe('Lib/Ethereum', () => {
    const instance = new Keys(Blockchain.ETHEREUM, Network.MAINNET)
    const instanceWithTestnet = new Keys(Blockchain.ETHEREUM, Network.TESTNET)
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
                    blockchain: 'ethereum',
                    network: 'mainnet',
                    path: "m/44'/60'/0'/0/0",
                },
                {
                    blockchain: 'ethereum',
                    network: 'testnet',
                    path: "m/44'/1'/0'/0/0",
                },
            ]
            assert.deepEqual(actualPaths, expectedPaths)
        })
    })

    describe('#checkSeedPhrase', () => {
        const seedPhrase =
            'danger eagle reopen sadness citizen health soccer toilet live erupt fortune crunch'
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
                    spy = sinon.spy(Ethereum.prototype, 'derivateFromPrivate')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * source: https://github.com/ethereumjs/ethereumjs-wallet
                     */
                    const masterPrivateKey = {
                        masterPrivateKey:
                            'xprv9s21ZrQH143K3QqLo4e4GC1Wzrb3VQBxEyxiRJhkg2NFVDHtTbCSwB57FKPEYR5XPU6GGwdzX8tYZfRPDREShvkbRfDEgXGiaZSq2iSgQMj',
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
                            path: "m/44'/60'/0'/0/2",
                            address:
                                '0xc26B7Db4514a0975E44F3b71FD4bD9db17E82070',
                            publicKey:
                                '0x03a55a817958c37eaa3f932ea7ca8f81bcec880c451a80c22300a5fb6fcb1acacc',
                            privateKey:
                                '0x2d42815e05ca241d7ec5666252d836359625993857b43e5e163c2b8f0d8626f7',
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
              ['xprv9s21ZrQH143K3QqLo4e4GC1Wzrb3VQBxEyxiRJhkg2NFVDHtTbCSwB57FKPEYR5XPU6GGwdzX8tYZfRPDREShvkbRfDEgXGiaZSq2iSgQMj',
              { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'xprv9s21ZrQH143K3QqLo4e4GC1Wzrb3VQBxEyxiRJhkg2NFVDHtTbCSwB57FKPEYR5XPU6GGwdzX8tYZfRPDREShvkbRfDEgXGiaZSq2iSgQMj',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
            context('with masterPublicKey', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(Ethereum.prototype, 'derivateFromPublic')
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
                            path: "m/44'/60'/0'/0/2",
                            address:
                                '0x9D7f17998eA70CFCF8a31e421d04EBa1ee5A881d',
                            publicKey:
                                '0x03589ba6d047be9acf960f3a204be09f288245768db2de3dd62704fe24730b5ebf',
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
                    spy = sinon.spy(Ethereum.prototype, 'derivateFromPrivate')
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
                            path: "m/44'/60'/0'/0/2",
                            address:
                                '0x5ad3934232A07557C6Dfc103C05C2922A31c2745',
                            publicKey:
                                '0x03c4f1ab021b9293d5151ad9fb725f0c3768792af6e552707cf9fbf35f7bcadd5c',
                            privateKey:
                                '0xe0962b8fcfaca22674fb870fc3b96d425a64f756dc130b6f68a10ab57847841e',
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
              ['xprv9s21ZrQH143K3GjA2ZtLP3PWGvUQskHtGeRMCPcnK3oyzFDjdCf4qUwLDVwnRkPnik2ssTpXAidRfZvgqzrcr1vEvvbknHtyjkeFZ5GZ6fo',
              { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'xprv9s21ZrQH143K3GjA2ZtLP3PWGvUQskHtGeRMCPcnK3oyzFDjdCf4qUwLDVwnRkPnik2ssTpXAidRfZvgqzrcr1vEvvbknHtyjkeFZ5GZ6fo',
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
                    spy = sinon.spy(Ethereum.prototype, 'derivateFromPrivate')
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
                                '0xe747482b2ddfF3830141c3d409327C7276871366',
                            publicKey:
                                '0x02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d',
                            privateKey:
                                '0xce1d919795a87346b29aeb11bdd95f9608169ed9dc2e60c4dd81d43dd6b69949',
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
                    spy = sinon.spy(Ethereum.prototype, 'derivateFromPublic')
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
                                '0x937d3d8034f13b9B67DfcCE7f93b0f23aA83DB8A',
                            publicKey:
                                '0x02fb0142a7e11401073a01dc913f30755bfb082c6197347f146d42db6455eabd03',
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
                    spy = sinon.spy(Ethereum.prototype, 'derivateFromPrivate')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated by: https://iancoleman.io/bip39/
                     */
                    const seedPhrase = {
                        seedPhrase:
                            'height utility own gossip draft anxiety gesture leader online vacuum other tuna pitch cry anger',
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
                                '0x468a06Dffe57281fA418A0b6440673634D0AfEB6',
                            publicKey:
                                '0x022079bcb42a11e364b43195dd3d4bc7a3daf5e1a22bee2586bd31c03e939ad1f2',
                            privateKey:
                                '0x98f53dafe645d12aa063d8b0f63071bfd27340575e49288996f79da71ecc8f44',
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
          ['tprv8ZgxMBicQKsPeCxL6vrbctP8GhrGvffokP1bfksTVoGWkCNUnq87dHNfhyZmT4scyN9DKfMXhwzBxtufhPGHMMyxEGd3jKdnqKKmHCzm4F7',
          { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'tprv8ZgxMBicQKsPeCxL6vrbctP8GhrGvffokP1bfksTVoGWkCNUnq87dHNfhyZmT4scyN9DKfMXhwzBxtufhPGHMMyxEGd3jKdnqKKmHCzm4F7',
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
                'xprv9s21ZrQH143K3QqLo4e4GC1Wzrb3VQBxEyxiRJhkg2NFVDHtTbCSwB57FKPEYR5XPU6GGwdzX8tYZfRPDREShvkbRfDEgXGiaZSq2iSgQMj',
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
                'efca4cdd31923b50f4214af5d2ae10e7ac45a5019e9431cc195482d707485378'
            const actual = await instance.sign('fake_data', privateKey, false)
            it('should be return `{"r":"58f4a1752fd3b747ba5e4a531bdff163ae20b741f23f1ae2a52e1d83a5133b01","s":"5d6c1dec0f7287495c59bad2b1bea07311d610fbf9b098076ba4103adf5248bc","v":27}`', () => {
                assert.strictEqual(
                    actual,
                    '{"r":"58f4a1752fd3b747ba5e4a531bdff163ae20b741f23f1ae2a52e1d83a5133b01","s":"5d6c1dec0f7287495c59bad2b1bea07311d610fbf9b098076ba4103adf5248bc","v":27}',
                )
            })
            try {
                await instance.sign('fake_data', 'Invalid_Private_Key', false) // check behavior in case of invalid private Key
            } catch (ex) {
                it('should be throw an error with following message `Expected private key to be an Uint8Array with length 32`', () => {
                    assert.strictEqual(
                        ex.message,
                        'Expected private key to be an Uint8Array with length 32',
                    )
                })
            }
        })
        context('with testnet network', async () => {
            const privateKey =
                '0xce1d919795a87346b29aeb11bdd95f9608169ed9dc2e60c4dd81d43dd6b69949'
            const actual = await instanceWithTestnet.sign(
                'fake_data',
                privateKey,
                false,
            )
            it(`should be return {"r":"0a1da94b81da9e5a735a398f7158a67ac0eaeab785c90d6fed10875cff053d1d","s":"78b642fdc963087102675884d694650543b8cd081ee49380e823c86cb2332c25","v":27}`, () => {
                assert.strictEqual(
                    actual,
                    '{"r":"0a1da94b81da9e5a735a398f7158a67ac0eaeab785c90d6fed10875cff053d1d","s":"78b642fdc963087102675884d694650543b8cd081ee49380e823c86cb2332c25","v":27}',
                )
            })
            try {
                await instanceWithTestnet.sign(
                    'fake_data',
                    'Invalid_Private_Key',
                    false,
                ) // check behavior in case of invalid private Key
            } catch (ex) {
                it('should be throw an error with following message `Expected private key to be an Uint8Array with length 32`', () => {
                    assert.strictEqual(
                        ex.message,
                        'Expected private key to be an Uint8Array with length 32',
                    )
                })
            }
        })
    })

    describe('#getPublicFromPrivate', () => {
        context('with mainnet network', () => {
            const privateKey =
                '0x2d42815e05ca241d7ec5666252d836359625993857b43e5e163c2b8f0d8626f7'
            const actual = instance.getPublicFromPrivate(privateKey)
            it(`should be return 0x03a55a817958c37eaa3f932ea7ca8f81bcec880c451a80c22300a5fb6fcb1acacc`, () => {
                assert.strictEqual(
                    actual,
                    '0x03a55a817958c37eaa3f932ea7ca8f81bcec880c451a80c22300a5fb6fcb1acacc',
                )
            })
            try {
                instance.getPublicFromPrivate('Invalid_Private_Key') // check behavior in case of invalid private Key
            } catch (ex) {
                it('should be throw an error with following message `Expected Buffer(Length: 32), got Buffer(Length: 0)`', () => {
                    assert.strictEqual(
                        ex.message,
                        'Expected Buffer(Length: 32), got Buffer(Length: 0)',
                    )
                })
            }
        })
        context('with testnet network', () => {
            const privateKey =
                '0xce1d919795a87346b29aeb11bdd95f9608169ed9dc2e60c4dd81d43dd6b69949'
            const actual = instanceWithTestnet.getPublicFromPrivate(privateKey)
            it(`should be return 0x02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d`, () => {
                assert.strictEqual(
                    actual,
                    '0x02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d',
                )
            })
            try {
                instanceWithTestnet.getPublicFromPrivate('Invalid_Private_Key') // check behavior in case of invalid private Key
            } catch (ex) {
                it('should be throw an error with following message `Expected Buffer(Length: 32), got Buffer(Length: 0)`', () => {
                    assert.strictEqual(
                        ex.message,
                        'Expected Buffer(Length: 32), got Buffer(Length: 0)',
                    )
                })
            }
        })
    })

    describe('#getAddressFromPublic', () => {
        context('Without mainnet network', () => {
            const publicKey =
                '0x03a55a817958c37eaa3f932ea7ca8f81bcec880c451a80c22300a5fb6fcb1acacc'
            const actual = instance.getAddressFromPublic(publicKey)
            it(`should be return 0xc26B7Db4514a0975E44F3b71FD4bD9db17E82070`, () => {
                assert.strictEqual(
                    actual,
                    '0xc26B7Db4514a0975E44F3b71FD4bD9db17E82070',
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
        context('Without testnet network', () => {
            const publicKey =
                '0x03c4f1ab021b9293d5151ad9fb725f0c3768792af6e552707cf9fbf35f7bcadd5c'
            const actual = instanceWithTestnet.getAddressFromPublic(publicKey)
            it(`should be return 0x5ad3934232A07557C6Dfc103C05C2922A31c2745`, () => {
                assert.strictEqual(
                    actual,
                    '0x5ad3934232A07557C6Dfc103C05C2922A31c2745',
                )
            })
            try {
                instanceWithTestnet.getAddressFromPublic('Invalid_Public_Key') // check behavior in case of invalid public Key
            } catch (ex) {
                it('should be throw an error with following message `Expected public key to be an Uint8Array with length [33, 65]`', () => {
                    assert.strictEqual(
                        ex.message,
                        'Expected public key to be an Uint8Array with length [33, 65]',
                    )
                })
            }
        })
    })

    describe('#checkSign', () => {
        context('with mainnet network', () => {
            const actual = instance.checkSign(
                '0x03a55a817958c37eaa3f932ea7ca8f81bcec880c451a80c22300a5fb6fcb1acacc',
                'fake_data',
                '{"r":"58f4a1752fd3b747ba5e4a531bdff163ae20b741f23f1ae2a52e1d83a5133b01","s":"5d6c1dec0f7287495c59bad2b1bea07311d610fbf9b098076ba4103adf5248bc","v":27}',
            )
            it('should be return `true`', () => {
                assert.strictEqual(actual, true)
            })
            try {
                instance.checkSign(
                    '0x03a55a817958c37eaa3f932ea7ca8f81bcec880c451a80c22300a5fb6fcb1acacc',
                    'fake_data',
                    'invalid_sign',
                )
            } catch (ex) {
                it('should be throw an error with following message `Unexpected token i in JSON at position 0`', () => {
                    assert.strictEqual(
                        ex.message,
                        'Unexpected token i in JSON at position 0',
                    )
                })
            }
        })
        context('with testnet network', () => {
            const actualPositive = instanceWithTestnet.checkSign(
                '0x02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d',
                'fake_data',
                '{"r":"0a1da94b81da9e5a735a398f7158a67ac0eaeab785c90d6fed10875cff053d1d","s":"78b642fdc963087102675884d694650543b8cd081ee49380e823c86cb2332c25","v":27}',
            )
            it('should be return `true`', () => {
                assert.strictEqual(actualPositive, true)
            })
            try {
                instanceWithTestnet.checkSign(
                    'Invalid_Public_Key',
                    'fake_data',
                    '{"r":"0a1da94b81da9e5a735a398f7158a67ac0eaeab785c90d6fed10875cff053d1d","s":"78b642fdc963087102675884d694650543b8cd081ee49380e823c86cb2332c25","v":27}',
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
                    '0x02c32badd397806e72c44279e673bb592394124ea28198fb0e514261a1a275229d',
                    'fake_data',
                    'invalid_sign',
                )
            } catch (ex) {
                it('should be throw an error with following message `Unexpected token i in JSON at position 0`', () => {
                    assert.strictEqual(
                        ex.message,
                        'Unexpected token i in JSON at position 0',
                    )
                })
            }
        })
    })
})
