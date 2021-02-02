export declare enum Blockchain {
    BTC = "bitcoin",
    ETH = "ethereum",
    EOS = "eos",
    BCH = "bitcoin_cash",
    BSV = "bitcoin_sv",
    LTC = "litecoin",
    XRP = "ripple",
    DOGE = "dogecoin",
    EMC = "emercoin",
    DASH = "dashcoin"
}
export declare enum Network {
    MAINNET = "mainnet",
    TESTNET = "testnet",
    REGTEST = "regtest"
}
export declare enum SeedDictionaryLang {
    ENGLISH = "english",
    JAPANESE = "japanese",
    SPANISH = "spanish",
    CHINESE_SIMPLE = "chinese_simple",
    CHINESE_TRADITIONAL = "chinese_traditional",
    FRENCH = "french",
    ITALIAN = "italian",
    KOREAN = "korean",
    CZECH = "czech"
}
export declare type Address = string;
export declare type PublicKey = string;
export declare type PrivateKey = string;
export declare type MasterKeys = {
    masterPrivateKey: string;
    masterPublicKey: string;
    masterAccountPrivateKey: string;
    masterAccountPublicKey: string;
};
export declare type SeedWithKeys = {
    seedPhrase: string;
    seed: string;
    masterPrivateKey: string;
    masterPublicKey: string;
    masterAccountPrivateKey: string;
    masterAccountPublicKey: string;
};
export declare type PathCursor = {
    skip: number;
    limit: number;
    path?: string;
};
export declare type FromMasterPrivateKey = {
    masterPrivateKey: PrivateKey;
};
export declare type FromMasterPublicKey = {
    masterPublicKey: PublicKey;
};
export declare type FromSeedPhrase = {
    seedPhrase: string;
    password?: string;
};
export declare type KeysWithPath = {
    path: string;
    address: Address;
    publicKey: PublicKey;
    privateKey?: PrivateKey;
};
export declare type Path = {
    blockchain: Blockchain;
    network: Network;
    path: string;
};
export interface IKeys {
    generateSeedPhrase(wordCount: number, lang?: SeedDictionaryLang, path?: string, password?: string): SeedWithKeys | Error;
    getDataFromSeed(seedPhrase: string, path?: string, password?: string): SeedWithKeys | Error;
    derivateKeys(from: FromSeedPhrase | FromMasterPublicKey | FromMasterPrivateKey, pathCursor: PathCursor): KeysWithPath[] | Error;
    sign(data: string, privateKey: PrivateKey, isTx?: boolean): Promise<string | Error>;
    getPublicFromPrivate(privateKey: PrivateKey): PublicKey | Error;
    getAddressFromPublic(publicKey: PublicKey, format?: string): Address | Error;
    checkSign(publicKey: PublicKey, data: string, sign: string): boolean | Error;
    checkSeedPhrase(seedPhrase: string): boolean | Error;
    getDefaultPaths(): Path[];
}
