import bech32 from "bech32";
import sha from "sha.js";
import baseX from "base-x";

const validateBech32 = (address): boolean => {
    let decoded;

    try {
        decoded = bech32.decode(address);
    } catch (error) {
        return false;
    }

    const prefixesNetwork = {
        bc: 'mainnet',
        tb: 'testnet',
        bcrt: 'regtest'
    }

    const network = prefixesNetwork[decoded.prefix];

    if (network === undefined) {
        return false;
    }

    const witnessVersion = decoded.words[0];

    if (witnessVersion < 0 || witnessVersion > 16) {
        return false;
    }

    return true;
};

const base58 = baseX('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');

const sha256 = payload => Buffer.from(sha('sha256').update(payload).digest());

const addressTypes = {
    0x00: {
        type: 'p2pkh',
        network: 'mainnet'
    },

    0x6f: {
        type: 'p2pkh',
        network: 'testnet'
    },

    0x05: {
        type: 'p2sh',
        network: 'mainnet'
    },

    0xc4: {
        type: 'p2sh',
        network: 'testnet'
    }
};

export const isValidAddress = (address: string, format?: string): boolean => {
    if (!address) {
        return false;
    }

    let decoded;
    const prefix = address.substr(0, 2);

    if (prefix === 'bc' || prefix === 'tb' || format === "bech32") {
        return validateBech32(address);
    }

    try {
        decoded = base58.decode(address);
    } catch (error) {
        return false;
    }

    const { length } = decoded;

    if (length !== 25) {
        return false;
    }

    const version = decoded.readUInt8(0);

    const checksum = decoded.slice(length - 4, length);
    const body = decoded.slice(0, length - 4);

    const expectedChecksum = sha256(sha256(body)).slice(0, 4);

    if (!checksum.equals(expectedChecksum)) {
        return false;
    }

    if(addressTypes[version]) return true 
    else false;
};

export const getFormat = (address: string) : string => {
    const prefix = address.substr(0, 2);
    if (prefix === 'bc' || prefix === 'tb') {
        return "bech32";
    } else {
        return "base58";
    }
}