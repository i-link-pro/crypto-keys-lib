import * as assert from 'assert'
import * as sinon from 'sinon'
import { describe, it, after, before } from 'mocha'
import { Keys } from '../src/lib'
import { Network, Blockchain } from '../src/types'
import { Litecoin } from '../src/blockchains/litecoin'

describe('Lib/Litecoin', () => {
    const instance = new Keys(Blockchain.LITECOIN, Network.MAINNET)
    const instanceWithTestnet = new Keys(Blockchain.LITECOIN, Network.TESTNET)
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
                    blockchain: 'litecoin',
                    network: 'mainnet',
                    path: "m/44'/2'/0'/0/0",
                },
                {
                    blockchain: 'litecoin',
                    network: 'testnet',
                    path: "m/44'/1'/0'/0/0",
                },
            ]
            assert.deepEqual(actualPaths, expectedPaths)
        })
    })

    describe('#checkSeedPhrase', () => {
        const seedPhrase =
            'program term park ticket dinner jar dumb couch drive song olive panel'
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
                    spy = sinon.spy(Litecoin.prototype, 'derivateFromPrivate')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated by: https://iancoleman.io/bip39/
                     */
                    const masterPrivateKey = {
                        masterPrivateKey:
                            'xprv9s21ZrQH143K2ipfB4dMesTX5mCbYqUSQuznQffV3x28noGDwU9La12RcJa8HYFaKVw96By7THGttKo9N7YyKDTGfcYUJKXBkJHy58Xpgpi',
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
                            path: "m/44'/2'/0'/0/2",
                            address: 'LbQ5jeWTLaDm89jeku7JsDjECAwY7Bbo5b',
                            publicKey:
                                '0230ff744a623c4edf734ed732cf595962f4d293b0bd69493da6a0c4f19595797f',
                            privateKey:
                                'TB29KmPEkUk68pBtYBPBXtQuZQL1izukct4tiUWqq1y7FdDK3xge',
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
          ['xprv9s21ZrQH143K2ipfB4dMesTX5mCbYqUSQuznQffV3x28noGDwU9La12RcJa8HYFaKVw96By7THGttKo9N7YyKDTGfcYUJKXBkJHy58Xpgpi',
          { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'xprv9s21ZrQH143K2ipfB4dMesTX5mCbYqUSQuznQffV3x28noGDwU9La12RcJa8HYFaKVw96By7THGttKo9N7YyKDTGfcYUJKXBkJHy58Xpgpi',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
            context('with masterPublicKey', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(Litecoin.prototype, 'derivateFromPublic')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated by: https://iancoleman.io/bip39/
                     */
                    const masterPublicKey = {
                        masterPublicKey:
                            'xpub6ADEEufzPwGvd9iMW3QPB9p9WdpoD1nZx4YZmJbSbTpAjKj39vsbW2THocpT17LtQCvHp4QGR2HfNJrY9H7s3xSdc39WBQEoJDnGsj8UVni',
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
                            path: "m/44'/2'/0'/0/2",
                            address: 'LUfYLPqVySdWme2wQrypdkMxE2zAb9fP1j',
                            publicKey:
                                '02d57ecb8a2017321151b79156ed24aa1762d47e76c542e7a91873d99ce8164922',
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
          ['xpub6ADEEufzPwGvd9iMW3QPB9p9WdpoD1nZx4YZmJbSbTpAjKj39vsbW2THocpT17LtQCvHp4QGR2HfNJrY9H7s3xSdc39WBQEoJDnGsj8UVni',
          { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'xpub6ADEEufzPwGvd9iMW3QPB9p9WdpoD1nZx4YZmJbSbTpAjKj39vsbW2THocpT17LtQCvHp4QGR2HfNJrY9H7s3xSdc39WBQEoJDnGsj8UVni',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
            context('with seedPhrase', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(Litecoin.prototype, 'derivateFromPrivate')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated by: https://iancoleman.io/bip39/
                     */
                    const seedPhrase = {
                        seedPhrase:
                            'bench ozone atom antenna odor fatal ride intact arch valve drop mule isolate toss steel',
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
                            path: "m/44'/2'/0'/0/2",
                            address: 'LRb3nNsYGuWW2r5VpCypWcZazgbZarNy8P',
                            publicKey:
                                '03a60b3187c2df3af16e47005d0cb927fc51cb45ff08594e1398920779c305fe2c',
                            privateKey:
                                'T957EsWcg5kjgWiHHgjMgA9SQymXo5Jk8rKyKw7Yko9RMb245Cgo',
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
        context('with testnet network', () => {
            context('with masterPrivateKey', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(Litecoin.prototype, 'derivateFromPrivate')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated by: https://iancoleman.io/bip39/
                     */
                    const masterPrivateKey = {
                        masterPrivateKey:
                            'tprv8ZgxMBicQKsPdx9HgB7ktcK3XED6iacamShaTuiFjidXVLyQR1HqSvCnaprtW1jUwVVKWFbgFqTUrwXP3w89RHF2UiEcuQ8u96Yu8U2qzaX',
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
                            address: 'mrtHJyjAv8Jc7zqg35FqjyYenUnWdUERyX',
                            publicKey:
                                '02b1fd5ed7cdb46009043adff31c92e9d0cd814df78f4774d098d11b067d88957f',
                            privateKey:
                                'cTaLMV6VEVnt2igKhCzYDPPmA3Rbax8ttFxqBtuBzKS8fPngUmb2',
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
          ['tprv8ZgxMBicQKsPdx9HgB7ktcK3XED6iacamShaTuiFjidXVLyQR1HqSvCnaprtW1jUwVVKWFbgFqTUrwXP3w89RHF2UiEcuQ8u96Yu8U2qzaX',
          { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'tprv8ZgxMBicQKsPdx9HgB7ktcK3XED6iacamShaTuiFjidXVLyQR1HqSvCnaprtW1jUwVVKWFbgFqTUrwXP3w89RHF2UiEcuQ8u96Yu8U2qzaX',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
            context('with masterPublicKey', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(Litecoin.prototype, 'derivateFromPublic')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated by: https://iancoleman.io/bip39/
                     */
                    const masterPublicKey = {
                        masterPublicKey:
                            'tpubDHUsrHqi3VfStvjecN1UpjKjfZNYaTkr2C8oabhchCxtA5YWNj3VjL8ffk5LNz3CZTxzrTHfWWr1z2Dnf7kM4RexwrFcfFcTpMXAQACzM9x',
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
                            address: 'mtJQ478hQALjddWvVnXnVAxsqVbp9rQauP',
                            publicKey:
                                '03110a653ad0c380f2f070fc77ba76cf52e480d154feffcb6c7c825fbfca5740a0',
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
          ['tpubDHUsrHqi3VfStvjecN1UpjKjfZNYaTkr2C8oabhchCxtA5YWNj3VjL8ffk5LNz3CZTxzrTHfWWr1z2Dnf7kM4RexwrFcfFcTpMXAQACzM9x',
          { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'tpubDHUsrHqi3VfStvjecN1UpjKjfZNYaTkr2C8oabhchCxtA5YWNj3VjL8ffk5LNz3CZTxzrTHfWWr1z2Dnf7kM4RexwrFcfFcTpMXAQACzM9x',
                            { limit: 1, skip: 1 },
                        ])
                    })
                })
            })
            context('with seedPhrase', () => {
                let spy
                let actual
                before(done => {
                    spy = sinon.spy(Litecoin.prototype, 'derivateFromPrivate')
                    const cursor = {
                        skip: 1,
                        limit: 1,
                    }
                    /**
                     * Generated by: https://iancoleman.io/bip39/
                     */
                    const seedPhrase = {
                        seedPhrase:
                            'lake trade arrest shiver used lucky collect caution monitor polar dress earn coast myself unique',
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
                            address: 'mypH2bHWDLx9QBT2364XQj613LLRZWmrD3',
                            publicKey:
                                '02b1d95ccd81161262637db2d4aca73562475f7e99153aee17264d1342c6d97955',
                            privateKey:
                                'cVBMHP1VRZDyBhWr1wDC9BT6zz2gWANEXUJpQq1gNsWWqmukDoz1',
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
          ['tprv8ZgxMBicQKsPeb86yg7R6Nboa6n4jF8oeJqxgz3pqYBdDmwdeSWJqwjvxDmwYQZHgXntK4N7W8nYYsUCcbaCdgakkc8rLDxahESxaboNgyC',
          { limit: 1, skip: 1 }]`, () => {
                        assert.deepEqual(spy.args[0], [
                            'tprv8ZgxMBicQKsPeb86yg7R6Nboa6n4jF8oeJqxgz3pqYBdDmwdeSWJqwjvxDmwYQZHgXntK4N7W8nYYsUCcbaCdgakkc8rLDxahESxaboNgyC',
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
                'xprv9s21ZrQH143K2QbSWMWSscALjtkQ6GrUnNJh6UhKXQKtzzvKGkoyHDRiRmAouoy4H9J7G6fUm8vScVp12wodtsd83cAzQhKfvWyqoad35Zj',
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
        try {
            cursor.limit = 1
            // Use Extended private key for ensuring properly error handling
            masterPrivateKey.masterPrivateKey =
                'xprv9u1dytnk36qHsh7hbmdo8m74zPL7UYeqUvnQfDDRJWH2myRzqmiGGmhnvVEyVomnTzTATLyfJviRhTH8YJuqUBmvC9UTzYdWd15ut3w4dYJ'
            instance.derivateKeys(masterPrivateKey, cursor) // check behavior in case of negative limit
        } catch (ex) {
            it('should be throw an error with following message `Expected master, got child`', () => {
                assert.strictEqual(ex.message, 'Expected master, got child')
            })
        }
    })

    describe('#sign', () => {
        context('with mainnet network', () => {
            const privateKey =
                'T5KAL3bY2BYSoT88UnHiVcKqrqku7wM9WuwGLXV5DiSSWfRGXUNz'
            const actual = instance.sign('fake_data', privateKey)
            it('should be return `418b0dd60b32af679df67f781d3f9a3e17c1def9d7fb9408757aec0bbac77f5700de784ca57c99ab296991d831902536e6af171efe9cd83dfa539c600fed7c11`', () => {
                assert.strictEqual(
                    actual,
                    '418b0dd60b32af679df67f781d3f9a3e17c1def9d7fb9408757aec0bbac77f5700de784ca57c99ab296991d831902536e6af171efe9cd83dfa539c600fed7c11',
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
                'cTaLMV6VEVnt2igKhCzYDPPmA3Rbax8ttFxqBtuBzKS8fPngUmb2'
            const actual = instanceWithTestnet.sign('fake_data', privateKey)
            it('should be return `400915601b1ddda07b745bf582c55519d1b6a33ce1549ab91e56e9f59513e4167e47779d4bcfa4c62e9408b87ac0dc341cf52b9b0af60949f4d8ce7e03b17d52`', () => {
                assert.strictEqual(
                    actual,
                    '400915601b1ddda07b745bf582c55519d1b6a33ce1549ab91e56e9f59513e4167e47779d4bcfa4c62e9408b87ac0dc341cf52b9b0af60949f4d8ce7e03b17d52',
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
    })

    describe('#getPublicFromPrivate', () => {
        context('with mainnet network', () => {
            const privateKey =
                'T5KAL3bY2BYSoT88UnHiVcKqrqku7wM9WuwGLXV5DiSSWfRGXUNz'
            const actual = instance.getPublicFromPrivate(privateKey)
            it(`should be return 022c26bc8fc69a773a61660cfbf463955a622c44db6fcc54fadbc08c1d5dbfe3ce`, () => {
                assert.strictEqual(
                    actual,
                    '022c26bc8fc69a773a61660cfbf463955a622c44db6fcc54fadbc08c1d5dbfe3ce',
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
                'cTaLMV6VEVnt2igKhCzYDPPmA3Rbax8ttFxqBtuBzKS8fPngUmb2'
            const actual = instanceWithTestnet.getPublicFromPrivate(privateKey)
            it(`should be return 02b1fd5ed7cdb46009043adff31c92e9d0cd814df78f4774d098d11b067d88957f`, () => {
                assert.strictEqual(
                    actual,
                    '02b1fd5ed7cdb46009043adff31c92e9d0cd814df78f4774d098d11b067d88957f',
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
                '022c26bc8fc69a773a61660cfbf463955a622c44db6fcc54fadbc08c1d5dbfe3ce'
            context('Without specifing format', () => {
                const actual = instance.getAddressFromPublic(publicKey)
                it(`should be return LbYDGDVhLXer4YQCmjaEYBeMQUrwYdYdyM`, () => {
                    assert.strictEqual(
                        actual,
                        'LbYDGDVhLXer4YQCmjaEYBeMQUrwYdYdyM',
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
            context('Without bech32 format', () => {
                const actual = instance.getAddressFromPublic(
                    publicKey,
                    'bech32',
                )
                it(`should be return tltc1qktmq2uwmt2shqlrz334jva35fhtvcpff5fuk02`, () => {
                    assert.strictEqual(
                        actual,
                        'tltc1qktmq2uwmt2shqlrz334jva35fhtvcpff5fuk02',
                    )
                })
            })
            context('Without invalid format', () => {
                const actual = instance.getAddressFromPublic(
                    publicKey,
                    'invalid',
                )
                it(`should be return LbYDGDVhLXer4YQCmjaEYBeMQUrwYdYdyM`, () => {
                    assert.strictEqual(
                        actual,
                        'LbYDGDVhLXer4YQCmjaEYBeMQUrwYdYdyM',
                    )
                })
            })
        })
        describe('with testnet network', () => {
            const publicKey =
                '02b1fd5ed7cdb46009043adff31c92e9d0cd814df78f4774d098d11b067d88957f'
            context('Without specifing format', () => {
                const actual = instanceWithTestnet.getAddressFromPublic(
                    publicKey,
                )
                it(`should be return mrtHJyjAv8Jc7zqg35FqjyYenUnWdUERyX`, () => {
                    assert.strictEqual(
                        actual,
                        'mrtHJyjAv8Jc7zqg35FqjyYenUnWdUERyX',
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
            context('Without bech32 format', () => {
                const actual = instanceWithTestnet.getAddressFromPublic(
                    publicKey,
                    'bech32',
                )
                it(`should be return ltc1q0jclu959l9wephzy04yzx7ejsdpv9fd58yw58z`, () => {
                    assert.strictEqual(
                        actual,
                        'ltc1q0jclu959l9wephzy04yzx7ejsdpv9fd58yw58z',
                    )
                })
            })
            context('Without invalid format', () => {
                const actual = instanceWithTestnet.getAddressFromPublic(
                    publicKey,
                    'invalid',
                )
                it(`should be return mrtHJyjAv8Jc7zqg35FqjyYenUnWdUERyX`, () => {
                    assert.strictEqual(
                        actual,
                        'mrtHJyjAv8Jc7zqg35FqjyYenUnWdUERyX',
                    )
                })
            })
        })
    })

    describe('#checkSign', () => {
        context('with mainnet network', () => {
            const actual = instance.checkSign(
                '022c26bc8fc69a773a61660cfbf463955a622c44db6fcc54fadbc08c1d5dbfe3ce',
                'fake_data',
                '418b0dd60b32af679df67f781d3f9a3e17c1def9d7fb9408757aec0bbac77f5700de784ca57c99ab296991d831902536e6af171efe9cd83dfa539c600fed7c11',
            )
            it('should be return `true`', () => {
                assert.strictEqual(actual, true)
            })
            try {
                instance.checkSign(
                    '022c26bc8fc69a773a61660cfbf463955a622c44db6fcc54fadbc08c1d5dbfe3ce',
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
            const actual = instanceWithTestnet.checkSign(
                '02b1fd5ed7cdb46009043adff31c92e9d0cd814df78f4774d098d11b067d88957f',
                'fake_data',
                '400915601b1ddda07b745bf582c55519d1b6a33ce1549ab91e56e9f59513e4167e47779d4bcfa4c62e9408b87ac0dc341cf52b9b0af60949f4d8ce7e03b17d52',
            )
            it('should be return `true`', () => {
                assert.strictEqual(actual, true)
            })
            try {
                instanceWithTestnet.checkSign(
                    '02b1fd5ed7cdb46009043adff31c92e9d0cd814df78f4774d098d11b067d88957f',
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
})
