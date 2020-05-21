import HDKey from 'hdkey'
import { payments } from 'bitcoinjs-lib'
import bip32 from 'bip32'

export function getAddressFromSeed(seed: string) {
    const hdkey = HDKey.fromMasterSeed(Buffer.from(seed, 'hex')).toJSON()
    
    return {
        masterPrivateKey: hdkey.xpriv,
        masterPublicKey: hdkey.xpub,
    }
}

export function deriveOutputChild(seed: string, index: number) {
    const wallet = bip32.fromSeed(Buffer.from(seed, 'hex'))
    const derived = wallet.derivePath(`m/44'/0'/0'/0/${index}`)
    return {
        path: `m/44'/0'/0'/0/${index}`,
        address: payments.p2pkh({ pubkey: derived.publicKey }).address,
        public: derived.publicKey.toString('hex'),
        private: derived.toWIF(),
    }
}

export function deriveInputChild(seed: string, index: number) {
    const wallet = bip32.fromSeed(Buffer.from(seed, 'hex'))
    const derived = wallet.derivePath(`m/44'/0'/0'/1/${index}`)
    return {
        path: `m/44'/0'/0'/1/${index}`,
        address: payments.p2pkh({ pubkey: derived.publicKey }).address,
        public: derived.publicKey.toString('hex'),
        private: derived.toWIF(),
    }
}

export const Bitcoin = {
    getAddressFromSeed,
    deriveOutputChild,
}
