/// <reference types="node" />
export declare const decodeBase58: (address: string) => Buffer;
export declare const decodeBech32: (address: string) => {
    prefix: string;
    words: number[];
};
export declare const isValidBech32Address: (address: string) => boolean;
export declare const isValidBase58Address: (address: string) => boolean;
