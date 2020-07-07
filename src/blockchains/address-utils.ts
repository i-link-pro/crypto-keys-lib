import { sha256, base58 } from '../utils'
import bech32 from 'bech32'

const addressTypes = {
    0x00: {
        type: 'p2pkh',
        network: 'mainnet',
    },

    0x30: {
        type: 'p2pkh',
        network: 'mainnet',
    },

    0x6f: {
        type: 'p2pkh',
        network: 'testnet',
    },

    0x05: {
        type: 'p2sh',
        network: 'mainnet',
    },

    0xc4: {
        type: 'p2sh',
        network: 'testnet',
    },
}

export const decodeBase58 = (address: string): Buffer => {
    try {
        return base58.decode(address)
    } catch {
        return null
    }
}

export const decodeBech32 = (
    address: string,
): { prefix: string; words: number[] } => {
    try {
        return bech32.decode(address)
    } catch {
        return null
    }
}

// Source: https://github.com/ruigomeseu/bitcoin-address-validation/blob/master/src/index.js
export const isValidBech32Address = (address: string): boolean => {
    const decoded = decodeBech32(address)
    if (!decoded) {
        return false
    }

    const prefixesNetwork = {
        bc: 'mainnet',
        tb: 'testnet',
        bcrt: 'regtest',
    }

    const network = prefixesNetwork[decoded.prefix]

    if (network === undefined) {
        return false
    }

    const witnessVersion = decoded.words[0]

    if (witnessVersion < 0 || witnessVersion > 16) {
        return false
    }

    return true
}

export const isValidBase58Address = (address: string): boolean => {
    const decoded = decodeBase58(address)
    if (!decoded) {
        return false
    }

    const { length } = decoded

    if (length !== 25) {
        return false
    }

    const version = decoded.readUInt8(0)

    const checksum = decoded.slice(length - 4, length)
    const body = decoded.slice(0, length - 4)

    const expectedChecksum = sha256(sha256(body)).slice(0, 4)

    if (!checksum.equals(expectedChecksum)) {
        return false
    }

    if (addressTypes[version]) {
        return true
    } else {
        return false
    }
}
