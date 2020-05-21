export enum Blockchain {
  BITCOIN,
  ETHEREUM,
  EOS,
  BITCOIN_CASH,
  BITCOIN_SV,
  LITECOIN,
  RIPPLE,
}

export enum Network {
  TESTNET,
  MAINNET,
  REGTEST,
}

export enum SeedDictionaryLang {
  ENGLISH, // default value
  JAPANESE,
  SPANISH,
  CHINESE_SIMPLE,
  CHINESE_TRADITIONAL,
  FRENCH,
  ITALIAN,
  KOREAN,
  CZECH,
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
  path: string; // m/44'/0'/0'/0
  limit: Number;
  skip: Number;
};

export type FromMasterPrivateKey = {
  masterPrivateKey: PrivateKey;
};

export type FromMasterPublicKey = {
  masterPublicKey: PublicKey;
};

export type FromSeedPhrase = {
  seedPhrase: string;
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
    password?: string
  ): SeedWithKeys | Error;
  getDataFromSeed(seedPhrase: string): SeedWithKeys | Error;
  derivateKeys(
    from: FromSeedPhrase | FromMasterPublicKey | FromMasterPrivateKey,
    pathCursor: PathCursor
  ): [KeysWithPath] | Error;
  sign(data: string, privateKey: PrivateKey): string | Error;
  getPublicFromPrivate(privateKey: PrivateKey): PublicKey | Error;
  getAddressFromPublic(publicKey: PublicKey, format?: string): Address | Error;
  checkSign(publicKey: PublicKey, data: string, sign: string): boolean | Error;
  checkSeedPhrase(seedPhrase: string): boolean | Error;
  getDefaultPaths(): [Path];
}
