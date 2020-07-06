import { BitcoinBase } from '../src/blockchains/bitcoin-base'
import { Bitcoin } from '../src/blockchains/bitcoin'
import { Network, Blockchain } from '../src/types'
import { Keys } from '../src/lib'
import { BitcoinCash } from '../src/blockchains/bitcoin-cash'
import { BitcoinSV } from '../src/blockchains/bitcoinsv'
import { Ethereum } from '../src/blockchains/ethereum'
import { Litecoin } from '../src/blockchains/litecoin'
import { Ripple } from '../src/blockchains/ripple'
import { EOS } from '../src/blockchains/eos'
import { describe, it, after, before } from 'mocha'
import * as assert from 'assert'

const generateAddress = (
    network: Network,
    blockchain: Blockchain,
    callback: (address: string) => void,
) => {
    const keys = new Keys(blockchain, network)
    const seed = keys.generateSeedPhrase(12)

    if (seed && !(seed instanceof Error)) {
        const dkeys = keys.derivateKeys(
            { masterPublicKey: seed.masterPublicKey },
            { skip: 0, limit: 1, path: "m/44'/0'/0'/0/3" },
        )

        for (const key in dkeys) {
            let address: string

            if (dkeys[key]['address'].split(':').length === 2) {
                address = dkeys[key]['address'].split(':')[1]
            } else {
                address = dkeys[key]['address']
            }

            callback(address)
        }
    }
}

describe('Bitcoin Address Validator', () => {
    describe('Bitcoin MAINNET', () => {
        const instance = new Bitcoin(Network.MAINNET)

        generateAddress(Network.MAINNET, Blockchain.BITCOIN, address => {
            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })

    describe('Bitcoin TESTNET', () => {
        const instance = new Bitcoin(Network.TESTNET)

        generateAddress(Network.TESTNET, Blockchain.BITCOIN, address => {
            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })
})

describe('BCH Address Validator', () => {
    describe('BitcoinCash MAINNET', () => {
        const instance = new BitcoinCash(Network.MAINNET)

        generateAddress(Network.MAINNET, Blockchain.BITCOIN_CASH, address => {
            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })

    describe('BitcoinCash TESTNET', () => {
        const instance = new BitcoinCash(Network.TESTNET)

        generateAddress(Network.TESTNET, Blockchain.BITCOIN_CASH, address => {
            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })
})

describe('BSV Address Validator', () => {
    describe('BitcoinSV MAINNET', () => {
        const instance = new BitcoinSV(Network.MAINNET)

        generateAddress(Network.MAINNET, Blockchain.BITCOIN_SV, address => {
            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })

    describe('BitcoinSV TESTNET', () => {
        const instance = new BitcoinSV(Network.TESTNET)

        generateAddress(Network.TESTNET, Blockchain.BITCOIN_SV, address => {
            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })
})

describe('ETHEREUM Address Validator', () => {
    describe('ETHEREUM MAINNET', () => {
        const instance = new Ethereum(Network.MAINNET)

        generateAddress(Network.MAINNET, Blockchain.ETHEREUM, address => {
            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })

    describe('ETHEREUM TESTNET', () => {
        const instance = new Ethereum(Network.TESTNET)

        generateAddress(Network.TESTNET, Blockchain.ETHEREUM, address => {
            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })
})

describe('EOS Address Validator', () => {
    const generateEOS = (length = 12, prefix = 'e.') => {
        let text = ''
        const possible = 'abcdefghijklmnopqrstuvwxyz12345'

        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length))
        }

        return prefix + text
    }

    describe('EOS MAINNET', () => {
        const instance = new EOS(Network.MAINNET)
        const address = generateEOS()

        generateAddress(Network.MAINNET, Blockchain.EOS, () => {
            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })

    describe('EOS TESTNET', () => {
        const instance = new EOS(Network.TESTNET)
        const address = generateEOS()

        generateAddress(Network.TESTNET, Blockchain.EOS, () => {
            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })
})

describe('LITECOIN Address Validator', () => {
    describe('LITECOIN MAINNET', () => {
        const instance = new Litecoin(Network.MAINNET)

        generateAddress(Network.MAINNET, Blockchain.LITECOIN, address => {
            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })

    describe('LITECOIN TESTNET', () => {
        const instance = new Litecoin(Network.TESTNET)

        generateAddress(Network.TESTNET, Blockchain.LITECOIN, address => {
            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })
})

describe('RIPPLE Address Validator', () => {
    describe('RIPPLE MAINNET', () => {
        const instance = new Ripple(Network.MAINNET)

        generateAddress(Network.MAINNET, Blockchain.RIPPLE, address => {
            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })

    describe('RIPPLE TESTNET', () => {
        const instance = new Ripple(Network.TESTNET)

        generateAddress(Network.TESTNET, Blockchain.RIPPLE, address => {
            it('Should generate valid address', () => {
                assert.equal(instance.isValidAddress(address), true)
            })
        })
    })
})
