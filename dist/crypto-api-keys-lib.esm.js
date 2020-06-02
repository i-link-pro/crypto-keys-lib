import { mnemonicToSeedSync, validateMnemonic as validateMnemonic$1, setDefaultWordlist, generateMnemonic as generateMnemonic$1 } from 'bip39';
import HDKey from 'hdkey';
import { ECPair, payments } from 'bitcoinjs-lib';
import { fromBase58 } from 'bip32';
import createHash from 'create-hash';
import { toCashAddress, toBitpayAddress } from 'bchaddrjs';
import { addHexPrefix, bufferToHex, importPublic, publicToAddress, toChecksumAddress, hashPersonalMessage, ecsign, isValidSignature } from 'ethereumjs-util';
import { privateToPublic, PrivateKey, PublicKey, sign, verify } from 'eosjs-ecc';
import { deriveAddress, sign as sign$1, verify as verify$1 } from 'ripple-keypairs';
import { classicAddressToXAddress } from 'ripple-address-codec';

var Blockchain;

(function (Blockchain) {
  Blockchain["BITCOIN"] = "bitcoin";
  Blockchain["ETHEREUM"] = "ethereum";
  Blockchain["EOS"] = "eos";
  Blockchain["BITCOIN_CASH"] = "bitcoin_cash";
  Blockchain["BITCOIN_SV"] = "bitcoin_sv";
  Blockchain["LITECOIN"] = "litecoin";
  Blockchain["RIPPLE"] = "ripple";
})(Blockchain || (Blockchain = {}));

var Network;

(function (Network) {
  Network["MAINNET"] = "mainnet";
  Network["TESTNET"] = "testnet";
})(Network || (Network = {}));

var SeedDictionaryLang;

(function (SeedDictionaryLang) {
  SeedDictionaryLang["ENGLISH"] = "english";
  SeedDictionaryLang["JAPANESE"] = "japanese";
  SeedDictionaryLang["SPANISH"] = "spanish";
  SeedDictionaryLang["CHINESE_SIMPLE"] = "chinese_simple";
  SeedDictionaryLang["CHINESE_TRADITIONAL"] = "chinese_traditional";
  SeedDictionaryLang["FRENCH"] = "french";
  SeedDictionaryLang["ITALIAN"] = "italian";
  SeedDictionaryLang["KOREAN"] = "korean";
  SeedDictionaryLang["CZECH"] = "czech";
})(SeedDictionaryLang || (SeedDictionaryLang = {}));

var types = {
    __proto__: null,
    get Blockchain () { return Blockchain; },
    get Network () { return Network; },
    get SeedDictionaryLang () { return SeedDictionaryLang; }
};

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

var validateMnemonic = function validateMnemonic(mnemonic) {
  return validateMnemonic$1(mnemonic);
};
var mnemonicToSeedHex = function mnemonicToSeedHex(mnemonic, password) {
  return mnemonicToSeedSync(mnemonic, password).toString('hex');
};
var generateMnemonic = function generateMnemonic(length, lang) {
  if (lang === void 0) {
    lang = 'english';
  }

  var strength = 128;

  if (length === 24) {
    strength = 256;
  } else if (length !== 12) {
    throw new Error('Wrong mnemonic length');
  }

  setDefaultWordlist(lang);
  var mnemonic = generateMnemonic$1(strength);
  return mnemonic;
};
var getIndexes = function getIndexes(skip, limit) {
  if (skip < 0) {
    throw Error('Skip must be greater or equal than zero');
  }

  if (limit < 1) {
    throw Error('Limit must be greater than zero');
  }

  return Array.from({
    length: limit
  }, function (_, k) {
    return k + skip + 1;
  });
};
var preparePath = function preparePath(path) {
  var parts = path.split('/');
  parts.pop();
  parts.push('{index}');
  return parts.join('/');
};
var getHardenedPath = function getHardenedPath(path) {
  var parts = path.split('/').filter(function (part) {
    return part === 'm' || part.indexOf("'") != -1;
  });
  return parts.join('/');
};

var bitcoin = {
  mainnet: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
      "public": 0x0488b21e,
      "private": 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80
  },
  regtest: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bcrt',
    bip32: {
      "public": 0x043587cf,
      "private": 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
  },
  testnet: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'tb',
    bip32: {
      "public": 0x043587cf,
      "private": 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
  }
};
var litecoin = {
  mainnet: {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bech32: 'tltc',
    bip32: {
      "public": 0x0488b21e,
      "private": 0x0488ade4
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0
  },
  testnet: {
    messagePrefix: '\x18Litecoin Signed Message:\n',
    bech32: 'ltc',
    bip32: {
      "public": 0x043587cf,
      "private": 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
  }
};
var bitcoinsv = {
  mainnet: {
    messagePrefix: 'unused',
    bech32: 'bsv',
    bip32: {
      "public": 0x0488b21e,
      "private": 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80
  },
  testnet: {
    messagePrefix: 'unused',
    bech32: 'tbsv',
    bip32: {
      "public": 0x0488b21e,
      "private": 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80
  }
};

var BitcoinBase = /*#__PURE__*/function () {
  function BitcoinBase(network) {
    var _this$networks;

    this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.BITCOIN,
      network: Network.MAINNET,
      path: "m/44'/0'/0'/0/0",
      config: bitcoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.BITCOIN,
      network: Network.TESTNET,
      path: "m/44'/1'/0'/0/0",
      config: bitcoin.testnet
    }, _this$networks);
    this.networkConfig = this.networks[network].config;
    this.defaultPath = this.networks[network].path;
  }

  var _proto = BitcoinBase.prototype;

  _proto.getPaths = function getPaths() {
    return Object.values(this.networks).map(function (path) {
      return {
        blockchain: path.blockchain,
        network: path.network,
        path: path.path
      };
    });
  };

  _proto.deriveRecursive = function deriveRecursive(derived, parts) {
    if (parts.length) {
      var part = parts[0],
          leftParts = parts.slice(1);
      return this.deriveRecursive(derived.derive(part), leftParts);
    }

    return derived;
  };

  _proto.getPrivateKey = function getPrivateKey(privateKey) {
    return privateKey.toWIF();
  };

  _proto.getPublicKey = function getPublicKey(publicKey) {
    return publicKey;
  };

  _proto.derivateFromPrivate = function derivateFromPrivate(masterPrivateKey, cursor) {
    var _this = this;

    var wallet = fromBase58(masterPrivateKey, this.networkConfig);
    var indexes = getIndexes(cursor.skip, cursor.limit);
    var path = preparePath(cursor.path || this.defaultPath);
    return indexes.map(function (index) {
      var currentPath = path.replace('{index}', index.toString());
      var derived = wallet.derivePath(currentPath);
      return {
        path: currentPath,
        address: _this.getAddressFromPublic(_this.getPublicKey(derived.publicKey.toString('hex'))),
        publicKey: _this.getPublicKey(derived.publicKey.toString('hex')),
        privateKey: _this.getPrivateKey(derived)
      };
    });
  };

  _proto.derivateFromPublic = function derivateFromPublic(masterPublicKey, cursor) {
    var _this2 = this;

    var wallet = fromBase58(masterPublicKey, this.networkConfig);
    var indexes = getIndexes(cursor.skip, cursor.limit);
    var path = preparePath(cursor.path || this.defaultPath);
    return indexes.map(function (index) {
      var currentPath = path.replace('{index}', index.toString());
      var pathParts = currentPath.replace(getHardenedPath(path), '').split('/').filter(function (part) {
        return part;
      }).map(function (part) {
        return parseInt(part);
      });

      var derived = _this2.deriveRecursive(wallet, pathParts);

      return {
        path: currentPath,
        address: _this2.getAddressFromPublic(_this2.getPublicKey(derived.publicKey.toString('hex'))),
        publicKey: _this2.getPublicKey(derived.publicKey.toString('hex'))
      };
    });
  };

  _proto.sign = function sign(data, privateKey) {
    var key = ECPair.fromWIF(privateKey, this.networkConfig);
    var hash = createHash('sha256').update(data).digest('hex');
    return key.sign(Buffer.from(hash, 'hex')).toString('hex');
  };

  _proto.checkSign = function checkSign(publicKey, data, sign) {
    var key = ECPair.fromPublicKey(Buffer.from(publicKey, 'hex'), {
      network: this.networkConfig
    });
    var hash = createHash('sha256').update(data).digest('hex');
    return key.verify(Buffer.from(hash, 'hex'), Buffer.from(sign, 'hex'));
  };

  _proto.getMasterAddressFromSeed = function getMasterAddressFromSeed(seed, path) {
    var hdkey = HDKey.fromMasterSeed(Buffer.from(seed, 'hex'));
    var hdnode = hdkey.derive(getHardenedPath(path || this.defaultPath));
    return {
      masterPrivateKey: hdkey.toJSON().xpriv,
      masterPublicKey: hdnode.toJSON().xpub
    };
  };

  _proto.getPublicFromPrivate = function getPublicFromPrivate(privateKey, isWIF) {
    if (isWIF === void 0) {
      isWIF = true;
    }

    var key;

    if (isWIF) {
      key = ECPair.fromWIF(privateKey, this.networkConfig);
    } else {
      key = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'));
    }

    return key.publicKey.toString('hex');
  };

  _proto.getAddressFromPublic = function getAddressFromPublic(publicKey, format) {
    var _payments$p2pkh$addre;

    if (format && format === 'bech32') {
      var _payments$p2wpkh$addr;

      return (_payments$p2wpkh$addr = payments.p2wpkh({
        pubkey: Buffer.from(publicKey, 'hex'),
        network: this.networkConfig
      }).address) !== null && _payments$p2wpkh$addr !== void 0 ? _payments$p2wpkh$addr : '';
    }

    return (_payments$p2pkh$addre = payments.p2pkh({
      pubkey: Buffer.from(publicKey, 'hex'),
      network: this.networkConfig
    }).address) !== null && _payments$p2pkh$addre !== void 0 ? _payments$p2pkh$addre : '';
  };

  return BitcoinBase;
}();

var Bitcoin = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Bitcoin, _BitcoinBase);

  function Bitcoin() {
    return _BitcoinBase.apply(this, arguments) || this;
  }

  return Bitcoin;
}(BitcoinBase);

var BitcoinSV = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(BitcoinSV, _BitcoinBase);

  function BitcoinSV(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.BITCOIN_SV,
      network: Network.MAINNET,
      path: "m/44'/236'/0'/0/0",
      config: bitcoinsv.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.BITCOIN_SV,
      network: Network.TESTNET,
      path: "m/44'/1'/0'/0/0",
      config: bitcoinsv.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    return _this;
  }

  return BitcoinSV;
}(BitcoinBase);

var BitcoinCash = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(BitcoinCash, _BitcoinBase);

  function BitcoinCash(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.BITCOIN_CASH,
      network: Network.MAINNET,
      path: "m/44'/145'/0'/0/0",
      config: bitcoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.BITCOIN_CASH,
      network: Network.TESTNET,
      path: "m/44'/1'/0'/0/0",
      config: bitcoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    return _this;
  }

  var _proto = BitcoinCash.prototype;

  _proto.getAddressFromPublic = function getAddressFromPublic(publicKey, format) {
    var legacy = _BitcoinBase.prototype.getAddressFromPublic.call(this, publicKey);

    var address = toCashAddress(legacy);

    if (format === 'legacy') {
      address = legacy;
    }

    if (format === 'bitpay') {
      address = toBitpayAddress(address);
    }

    return address;
  };

  return BitcoinCash;
}(BitcoinBase);

var Litecoin = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Litecoin, _BitcoinBase);

  function Litecoin(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.LITECOIN,
      network: Network.MAINNET,
      path: "m/44'/2'/0'/0/0",
      config: litecoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.LITECOIN,
      network: Network.TESTNET,
      path: "m/44'/1'/0'/0/0",
      config: litecoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    return _this;
  }

  return Litecoin;
}(BitcoinBase);

var Ethereum = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Ethereum, _BitcoinBase);

  function Ethereum(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.ETHEREUM,
      network: Network.MAINNET,
      path: "m/44'/60'/0'/0/0",
      config: bitcoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.ETHEREUM,
      network: Network.TESTNET,
      path: "m/44'/1'/0'/0/0",
      config: bitcoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    return _this;
  }

  var _proto = Ethereum.prototype;

  _proto.getPublicFromPrivate = function getPublicFromPrivate(privateKey) {
    return addHexPrefix(_BitcoinBase.prototype.getPublicFromPrivate.call(this, privateKey.replace('0x', ''), false));
  };

  _proto.getPrivateKey = function getPrivateKey(privateKey) {
    if (privateKey.privateKey) {
      return bufferToHex(privateKey.privateKey);
    } else {
      throw new Error('Invalid private key');
    }
  };

  _proto.getPublicKey = function getPublicKey(publicKey) {
    return addHexPrefix(publicKey);
  };

  _proto.getAddressFromPublic = function getAddressFromPublic(publicKey) {
    var ethPubkey = importPublic(Buffer.from(publicKey.replace('0x', ''), 'hex'));
    var addressBuffer = publicToAddress(ethPubkey);
    var hexAddress = addHexPrefix(addressBuffer.toString('hex'));
    var checksumAddress = toChecksumAddress(hexAddress);
    var address = addHexPrefix(checksumAddress);
    return address;
  };

  _proto.sign = function sign(data, privateKey) {
    var hash = hashPersonalMessage(Buffer.from(data));
    var sign = ecsign(hash, Buffer.from(privateKey.replace('0x', ''), 'hex'));
    return JSON.stringify({
      r: sign.r.toString('hex'),
      s: sign.s.toString('hex'),
      v: sign.v
    });
  };

  _proto.checkSign = function checkSign(_, __, sign) {
    var signObject = JSON.parse(sign);
    return isValidSignature(parseInt(signObject.v), Buffer.from(signObject.r, 'hex'), Buffer.from(signObject.s, 'hex'));
  };

  return Ethereum;
}(BitcoinBase);

var EOS = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(EOS, _BitcoinBase);

  function EOS(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.EOS,
      network: Network.MAINNET,
      path: "m/44'/194'/0'/0/0",
      config: bitcoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.EOS,
      network: Network.TESTNET,
      path: "m/44'/1'/0'/0/0",
      config: bitcoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    return _this;
  }

  var _proto = EOS.prototype;

  _proto.getPublicFromPrivate = function getPublicFromPrivate(privateKey) {
    return privateToPublic(privateKey);
  };

  _proto.getPrivateKey = function getPrivateKey(privateKey) {
    return PrivateKey(privateKey.privateKey).toWif();
  };

  _proto.getPublicKey = function getPublicKey(publicKey) {
    return PublicKey(Buffer.from(publicKey, 'hex')).toString();
  };

  _proto.getAddressFromPublic = function getAddressFromPublic(publicKey) {
    return publicKey;
  };

  _proto.sign = function sign$1(data, privateKey) {
    return sign(data, privateKey);
  };

  _proto.checkSign = function checkSign(publicKey, data, sign) {
    return verify(sign, data, publicKey);
  };

  return EOS;
}(BitcoinBase);

var Ripple = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Ripple, _BitcoinBase);

  function Ripple(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.RIPPLE,
      network: Network.MAINNET,
      path: "m/44'/144'/0'/0/0",
      config: bitcoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.RIPPLE,
      network: Network.TESTNET,
      path: "m/44'/1'/0'/0/0",
      config: bitcoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    return _this;
  }

  var _proto = Ripple.prototype;

  _proto.getAddressFromPublic = function getAddressFromPublic(publicKey, format) {
    var classicAddress = deriveAddress(publicKey);

    if (format === 'classic') {
      return classicAddress;
    }

    var xAddress = classicAddressToXAddress(classicAddress, false, false);

    if (xAddress === undefined) {
      throw new Error('Unknown error deriving address');
    }

    return xAddress;
  };

  _proto.sign = function sign(data, privateKey) {
    var key = ECPair.fromWIF(privateKey, this.networkConfig);
    var hash = createHash('sha256').update(data).digest('hex');

    if (key.privateKey) {
      return sign$1(hash, key.privateKey.toString('hex'));
    } else {
      throw Error('Invalid private key');
    }
  };

  _proto.checkSign = function checkSign(publicKey, data, sign) {
    var hash = createHash('sha256').update(data).digest('hex');
    return verify$1(hash, sign, publicKey);
  };

  return Ripple;
}(BitcoinBase);

var blockchainLibs = {
  bitcoin: Bitcoin,
  litecoin: Litecoin,
  bitcoin_sv: BitcoinSV,
  bitcoin_cash: BitcoinCash,
  ethereum: Ethereum,
  eos: EOS,
  ripple: Ripple
};
var Keys = /*#__PURE__*/function () {
  function Keys(blockchain, network) {
    if (blockchainLibs[blockchain]) {
      this.lib = new blockchainLibs[blockchain](network);
    } else {
      throw new Error("Blockchain " + blockchain + " not implemented yet!");
    }
  }

  var _proto = Keys.prototype;

  _proto.getMasterFromSeed = function getMasterFromSeed(seedPhrase, path, password) {
    var seed = mnemonicToSeedHex(seedPhrase, password);
    var keys = this.lib.getMasterAddressFromSeed(seed, path);
    return _extends({
      seedPhrase: seedPhrase,
      seed: seed
    }, keys);
  };

  _proto.isSeed = function isSeed(from) {
    return from.seedPhrase !== undefined;
  };

  _proto.isMasterPrivate = function isMasterPrivate(from) {
    return from.masterPrivateKey !== undefined;
  };

  _proto.generateSeedPhrase = function generateSeedPhrase(wordCount, lang, path, password) {
    if (lang === void 0) {
      lang = SeedDictionaryLang.ENGLISH;
    }

    var seedPhrase = generateMnemonic(wordCount, lang);
    return this.getMasterFromSeed(seedPhrase, path, password);
  };

  _proto.getDataFromSeed = function getDataFromSeed(seedPhrase, path, password) {
    return this.getMasterFromSeed(seedPhrase, path, password);
  };

  _proto.derivateKeys = function derivateKeys(from, pathCursor) {
    if (this.isSeed(from)) {
      var seedData = this.getMasterFromSeed(from.seedPhrase, from.password);
      return this.lib.derivateFromPrivate(seedData.masterPrivateKey, pathCursor);
    } else if (this.isMasterPrivate(from)) {
      return this.lib.derivateFromPrivate(from.masterPrivateKey, pathCursor);
    } else {
      return this.lib.derivateFromPublic(from.masterPublicKey, pathCursor);
    }
  };

  _proto.sign = function sign(data, privateKey) {
    return this.lib.sign(data, privateKey);
  };

  _proto.getPublicFromPrivate = function getPublicFromPrivate(privateKey) {
    return this.lib.getPublicFromPrivate(privateKey);
  };

  _proto.getAddressFromPublic = function getAddressFromPublic(publicKey, format) {
    return this.lib.getAddressFromPublic(publicKey, format);
  };

  _proto.checkSign = function checkSign(publicKey, data, sign) {
    return this.lib.checkSign(publicKey, data, sign);
  };

  _proto.checkSeedPhrase = function checkSeedPhrase(seedPhrase) {
    return validateMnemonic(seedPhrase);
  };

  _proto.getDefaultPaths = function getDefaultPaths() {
    return this.lib.getPaths();
  };

  return Keys;
}();

export { Keys, types as Types };
//# sourceMappingURL=crypto-api-keys-lib.esm.js.map