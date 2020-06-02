import * as bip39 from 'bip39'

export const validateMnemonic = (mnemonic: string): boolean =>
    bip39.validateMnemonic(mnemonic)

export const mnemonicToSeedHex = (
    mnemonic: string,
    password?: string,
): string => bip39.mnemonicToSeedSync(mnemonic, password).toString('hex')

export const generateMnemonic = (length: 12 | 24, lang = 'english'): string => {
    let strength = 128

    if (length === 24) {
        strength = 256
    } else if (length !== 12) {
        throw new Error('Wrong mnemonic length')
    }

    bip39.setDefaultWordlist(lang)
    const mnemonic = bip39.generateMnemonic(strength)

    return mnemonic
}

export const getIndexes = (skip: number, limit: number): number[] => {
    if (skip < 0) {
        throw Error('Skip must be greater or equal than zero')
    }

    if (limit < 1) {
        throw Error('Limit must be greater than zero')
    }

    return Array.from({ length: limit }, (_, k) => k + skip + 1)
}

export const preparePath = (path: string): string => {
    const parts = path.split('/')
    parts.pop()
    parts.push('{index}')

    return parts.join('/')
}

export const getHardenedPath = (path: string): string => {
    const parts = path
        .split('/')
        .filter(part => part === 'm' || part.indexOf("'") != -1)

    return parts.join('/')
}
