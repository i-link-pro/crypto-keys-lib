export enum Blockchain {
  BITCOIN = 'bitcoin',
  ETHEREUM = 'ethereum',
  EOS = 'eos',
  BITCOIN_CASH = 'bitcoin_cash',
  BITCOIN_SV = 'bitcoin_sv',
  LITECOIN = 'litecoin',
  RIPPLE = 'ripple',
}

export enum Network {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export enum SeedDictionaryLang {
  ENGLISH = 'english', // default value
  JAPANESE = 'japanese',
  SPANISH = 'spanish',
  CHINESE_SIMPLE = 'chinese_simple',
  CHINESE_TRADITIONAL = 'chinese_traditional',
  FRENCH = 'french',
  ITALIAN = 'italian',
  KOREAN = 'korean',
  CZECH = 'czech',
}

export type Address = string;
export type PublicKey = string;
export type PrivateKey = string;

export type SeedWithKeys = {
  seedPhrase: string;
  seed: string;
  masterPublicKey: PublicKey;
  masterPrivateKey: PrivateKey;
};

export type PathCursor = {
  skip: number;
  limit: number;
  path?: string; // m/44'/0'/0'/0/0
};

export type FromMasterPrivateKey = {
  masterPrivateKey: PrivateKey;
};

export type FromMasterPublicKey = {
  masterPublicKey: PublicKey;
};

export type FromSeedPhrase = {
  seedPhrase: string;
  password?: string;
};

export type KeysWithPath = {
  path: string;
  address: Address;
  publicKey: PublicKey;
  privateKey?: PrivateKey;
};

export type Path = {
  blockchain: Blockchain;
  network: Network;
  path: string;
};

export interface IKeys {
  generateSeedPhrase(
    wordCount: number,
    lang?: SeedDictionaryLang,
    path?: string,
    password?: string,
  ): SeedWithKeys | Error;
  getDataFromSeed(
    seedPhrase: string,
    path?: string,
    password?: string,
  ): SeedWithKeys | Error;
  derivateKeys(
    from: FromSeedPhrase | FromMasterPublicKey | FromMasterPrivateKey,
    pathCursor: PathCursor,
  ): KeysWithPath[] | Error;
  sign(data: string, privateKey: PrivateKey): string | Error;
  getPublicFromPrivate(privateKey: PrivateKey): PublicKey | Error;
  getAddressFromPublic(publicKey: PublicKey, format?: string): Address | Error;
  checkSign(publicKey: PublicKey, data: string, sign: string): boolean | Error;
  checkSeedPhrase(seedPhrase: string): boolean | Error;
  getDefaultPaths(): Path[];
}
