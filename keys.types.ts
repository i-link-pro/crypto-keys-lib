enum Blockchain {
  BITCOIN,
  ETHEREUM,
  EOS,
  BITCOIN_CASH,
  BITCOIN_SV,
  LITECOIN,
  RIPPLE,
}

enum Network {
  TESTNET,
  MAINNET,
  REGTEST,
}

enum SeedDictionaryLang {
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

type Address = string;
type PublicKey = string;
type PrivateKey = string;

type SeedWithKeys = {
  seedPhrase: string;
  seed: string;
  masterPublicKey: PublicKey;
  masterPrivateKey: PrivateKey;
};

type PathCursor = {
  path: string; // m/44'/0'/0'/0
  limit: Number;
  skip: Number;
};

type FromMasterPrivateKey = {
  masterPrivateKey: PrivateKey;
};

type FromMasterPublicKey = {
  masterPublicKey: PublicKey;
};

type FromSeedPhrase = {
  seedPhrase: string;
};

type KeysWithPath = {
  path: string;
  address: Address;
  publicKey: PublicKey;
  privateKey?: PrivateKey;
};

type Path = {
  blockchain: Blockchain;
  network: Network;
  path: string;
};

interface Keys {
  constructor(blockchain: Blockchain, network: Network): boolean | Error;
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
  getDefaultPaths(): [Path];
}
