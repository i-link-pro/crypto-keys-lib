export type Network = {
    messagePrefix: string
    bech32: string
    bip32: Bip32
    pubKeyHash: number
    scriptHash: number
    wif: number,
    dustThreshold: number;
    timeInTransaction: boolean;
}

type Bip32 = {
    public: number
    private: number
}

type NetworkConfig = {
    mainnet: Network
    testnet: Network
    regtest?: Network
}

const bitcoin: NetworkConfig = {
    mainnet: {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'bc',
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4,
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80,
        dustThreshold: 546,
        timeInTransaction: false,
    },
    testnet: {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'tb',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394,
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0xef,
        dustThreshold: 546,
        timeInTransaction: false,
    },
}

const litecoin: NetworkConfig = {
    mainnet: {
        messagePrefix: '\x19Litecoin Signed Message:\n',
        bech32: 'ltc',
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4,
        },
        pubKeyHash: 0x30,
        scriptHash: 0x32,
        wif: 0xb0,
        dustThreshold: 0,
        timeInTransaction: true,
    },
    testnet: {
        messagePrefix: '\x18Litecoin Signed Message:\n',
        bech32: 'tltc',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394,
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0xef,
        dustThreshold: 0,
        timeInTransaction: true,
    },
}

const dogecoin: NetworkConfig = {
    mainnet: {
        messagePrefix: '\x19Dogecoin Signed Message:\n',
        bech32: 'xdg',
        bip32: {
            public: 0x02facafd,
            private: 0x02fac398,
        },
        pubKeyHash: 0x1e,
        scriptHash: 0x16,
        wif: 0x9e,
        dustThreshold: 0,
        timeInTransaction: false,
    },
    testnet: {
        messagePrefix: '\x18Dogecoin Signed Message:\n',
        bech32: 'xdg',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394,
        },
        pubKeyHash: 0x71,
        scriptHash: 0xc4,
        wif: 0xf1,
        dustThreshold: 0,
        timeInTransaction: false,
    },
}

const emercoin: NetworkConfig = {
    mainnet: {
        messagePrefix: '\x17Emercoin Signed Message:\n',
        bech32: 'emc',
        bip32: {
            public: 0x01da950b,
            private: 0x01da90d0,
        },
        pubKeyHash: 0x37,
        scriptHash: 0x75,
        wif: 0xb7,
        dustThreshold: 0,
        timeInTransaction: true,
    },
    testnet: {
        messagePrefix: '\x17Emercoin Signed Message:\n',
        bech32: 'emc',
        bip32: {
            public: 0x01da950b,
            private: 0x01da90d0,
        },
        pubKeyHash: 0x37,
        scriptHash: 0x75,
        wif: 0xb7,
        dustThreshold: 0,
        timeInTransaction: true,
    },
}

const dashcoin: NetworkConfig = {
    mainnet: {
        messagePrefix: '\x18Dashcoin Signed Message:\n',
        bech32: 'dash',
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4,
        },
        pubKeyHash: 0x4c,
        scriptHash: 0x10,
        wif: 0xcc,  dustThreshold: 0,
        timeInTransaction: true,
    },
    testnet: {
        messagePrefix: '\x18Dashcoin Signed Message:\n',
        bech32: 'dash',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394,
        },
        pubKeyHash: 0x8c,
        scriptHash: 0x13,
        wif: 0xef,
        dustThreshold: 0,
        timeInTransaction: true,
    },
}

const bitcoinsv: NetworkConfig = {
    mainnet: {
        messagePrefix: 'unused',
        bech32: 'bsv',
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4,
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80,
        dustThreshold: 0,
        timeInTransaction: true,
    },
    testnet: {
        messagePrefix: 'unused',
        bech32: 'bsvtest',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394,
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0x80,
        dustThreshold: 0,
        timeInTransaction: true,
    },
}

export { bitcoin, litecoin, bitcoinsv, dogecoin, emercoin, dashcoin }
