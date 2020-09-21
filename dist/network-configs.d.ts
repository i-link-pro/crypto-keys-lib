export declare type Network = {
    messagePrefix: string;
    bech32: string;
    bip32: Bip32;
    pubKeyHash: number;
    scriptHash: number;
    wif: number;
};
declare type Bip32 = {
    public: number;
    private: number;
};
declare type NetworkConfig = {
    mainnet: Network;
    testnet: Network;
    regtest?: Network;
};
declare const bitcoin: NetworkConfig;
declare const litecoin: NetworkConfig;
declare const dogecoin: NetworkConfig;
declare const emercoin: NetworkConfig;
declare const bitcoinsv: NetworkConfig;
export { bitcoin, litecoin, bitcoinsv, dogecoin, emercoin };
