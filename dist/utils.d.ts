export declare const validateMnemonic: (mnemonic: string) => boolean;
export declare const mnemonicToSeedHex: (mnemonic: string, password?: string) => string;
export declare const generateMnemonic: (length: 12 | 24, lang?: string) => string;
export declare const getIndexes: (skip: number, limit: number) => number[];
export declare const preparePath: (path: string) => string;
export declare const getHardenedPath: (path: string) => string;
