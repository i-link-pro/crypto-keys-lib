'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var sodiumPlus = require('sodium-plus');
var createHash = _interopDefault(require('create-hash'));
var bip39 = require('bip39');
var baseX = _interopDefault(require('base-x'));
var bitcoinjsLib = require('bitcoinjs-lib');
var bip32 = require('bip32');
var bech32 = _interopDefault(require('bech32'));
var bchaddrjs = require('bchaddrjs');
var ethUtil = require('ethereumjs-util');
var eosUtil = require('eosjs-ecc');
var rippleKeyPair = require('ripple-keypairs');
var rippleUtil = require('ripple-address-codec');

(function (Blockchain) {
  Blockchain["BITCOIN"] = "bitcoin";
  Blockchain["ETHEREUM"] = "ethereum";
  Blockchain["EOS"] = "eos";
  Blockchain["BITCOIN_CASH"] = "bitcoin_cash";
  Blockchain["BITCOIN_SV"] = "bitcoin_sv";
  Blockchain["LITECOIN"] = "litecoin";
  Blockchain["RIPPLE"] = "ripple";
})(exports.Blockchain || (exports.Blockchain = {}));

(function (Network) {
  Network["MAINNET"] = "mainnet";
  Network["TESTNET"] = "testnet";
})(exports.Network || (exports.Network = {}));

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
})(exports.SeedDictionaryLang || (exports.SeedDictionaryLang = {}));

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
  return bip39.validateMnemonic(mnemonic);
};
var mnemonicToSeedHex = function mnemonicToSeedHex(mnemonic, password) {
  return bip39.mnemonicToSeedSync(mnemonic, password).toString('hex');
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

  bip39.setDefaultWordlist(lang);
  var mnemonic = bip39.generateMnemonic(strength);
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
var base58 = /*#__PURE__*/baseX('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
var sha256 = function sha256(payload) {
  return Buffer.from(createHash('sha256').update(payload).digest());
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
    bech32: 'ltc',
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
    bech32: 'tltc',
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
    bech32: 'bsvtest',
    bip32: {
      "public": 0x043587cf,
      "private": 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0x80
  }
};

var addressTypes = {
  0x00: {
    type: 'p2pkh',
    network: 'mainnet'
  },
  0x30: {
    type: 'p2pkh',
    network: 'mainnet'
  },
  0x6f: {
    type: 'p2pkh',
    network: 'testnet'
  },
  0x05: {
    type: 'p2sh',
    network: 'mainnet'
  },
  0xc4: {
    type: 'p2sh',
    network: 'testnet'
  }
};
var decodeBase58 = function decodeBase58(address) {
  try {
    return base58.decode(address);
  } catch (_unused) {
    return null;
  }
};
var decodeBech32 = function decodeBech32(address) {
  try {
    return bech32.decode(address);
  } catch (_unused2) {
    return null;
  }
};
var isValidBech32Address = function isValidBech32Address(address) {
  var decoded = decodeBech32(address);

  if (!decoded) {
    return false;
  }

  var prefixesNetwork = {
    bc: 'mainnet',
    tb: 'testnet',
    bcrt: 'regtest'
  };
  var network = prefixesNetwork[decoded.prefix];

  if (network === undefined) {
    return false;
  }

  var witnessVersion = decoded.words[0];

  if (witnessVersion < 0 || witnessVersion > 16) {
    return false;
  }

  return true;
};
var isValidBase58Address = function isValidBase58Address(address) {
  var decoded = decodeBase58(address);

  if (!decoded) {
    return false;
  }

  var length = decoded.length;

  if (length !== 25) {
    return false;
  }

  var version = decoded.readUInt8(0);
  var checksum = decoded.slice(length - 4, length);
  var body = decoded.slice(0, length - 4);
  var expectedChecksum = sha256(sha256(body)).slice(0, 4);

  if (!checksum.equals(expectedChecksum)) {
    return false;
  }

  if (addressTypes[version]) {
    return true;
  } else {
    return false;
  }
};

var BitcoinBase = /*#__PURE__*/function () {
  function BitcoinBase(network) {
    var _this$networks;

    this.networks = (_this$networks = {}, _this$networks[exports.Network.MAINNET] = {
      blockchain: exports.Blockchain.BITCOIN,
      network: exports.Network.MAINNET,
      path: "m/44'/0'/0'/0/0",
      config: bitcoin.mainnet
    }, _this$networks[exports.Network.TESTNET] = {
      blockchain: exports.Blockchain.BITCOIN,
      network: exports.Network.TESTNET,
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

    var wallet = bip32.fromBase58(masterPrivateKey, this.networkConfig);
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

    var wallet = bip32.fromBase58(masterPublicKey, this.networkConfig);
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

  _proto.sign = function sign(data, privateKey, isTx) {

    var key = bitcoinjsLib.ECPair.fromWIF(privateKey, this.networkConfig);
    var hash = createHash('sha256').update(data).digest('hex');
    return key.sign(Buffer.from(hash, 'hex')).toString('hex');
  };

  _proto.checkSign = function checkSign(publicKey, data, sign) {
    var key = bitcoinjsLib.ECPair.fromPublicKey(Buffer.from(publicKey, 'hex'), {
      network: this.networkConfig
    });
    var hash = createHash('sha256').update(data).digest('hex');
    return key.verify(Buffer.from(hash, 'hex'), Buffer.from(sign, 'hex'));
  };

  _proto.getMasterAddressFromSeed = function getMasterAddressFromSeed(seed, path) {
    var hdkey = bip32.fromSeed(Buffer.from(seed, 'hex'), this.networkConfig);
    var hdnode = hdkey.derivePath(getHardenedPath(path || this.defaultPath));
    return {
      masterPrivateKey: hdkey.toBase58(),
      masterPublicKey: hdkey.neutered().toBase58(),
      masterAccountPrivateKey: hdnode.toBase58(),
      masterAccountPublicKey: hdnode.neutered().toBase58()
    };
  };

  _proto.getPublicFromPrivate = function getPublicFromPrivate(privateKey, isWIF) {
    if (isWIF === void 0) {
      isWIF = true;
    }

    var key;

    if (isWIF) {
      key = bitcoinjsLib.ECPair.fromWIF(privateKey, this.networkConfig);
    } else {
      key = bitcoinjsLib.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'));
    }

    return key.publicKey.toString('hex');
  };

  _proto.getAddressFromPublic = function getAddressFromPublic(publicKey, format) {
    var _payments$p2pkh$addre;

    if (format && format === 'bech32') {
      var _payments$p2wpkh$addr;

      return (_payments$p2wpkh$addr = bitcoinjsLib.payments.p2wpkh({
        pubkey: Buffer.from(publicKey, 'hex'),
        network: this.networkConfig
      }).address) !== null && _payments$p2wpkh$addr !== void 0 ? _payments$p2wpkh$addr : '';
    }

    return (_payments$p2pkh$addre = bitcoinjsLib.payments.p2pkh({
      pubkey: Buffer.from(publicKey, 'hex'),
      network: this.networkConfig
    }).address) !== null && _payments$p2pkh$addre !== void 0 ? _payments$p2pkh$addre : '';
  };

  _proto.isValidAddress = function isValidAddress(address, format) {
    if (!address) {
      return false;
    }

    if (!format) {
      return this.isValidAddress(address, this.getFormat(address));
    } else {
      if (format.toLowerCase() === 'bech32') {
        return isValidBech32Address(address);
      } else if (format.toLowerCase() === 'base58') {
        return isValidBase58Address(address);
      } else {
        return false;
      }
    }
  };

  _proto.getFormat = function getFormat(address) {
    if (decodeBase58(address)) {
      return 'base58';
    }

    if (decodeBech32(address)) {
      return 'bech32';
    }

    throw new Error('Invalid address');
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
    _this.networks = (_this$networks = {}, _this$networks[exports.Network.MAINNET] = {
      blockchain: exports.Blockchain.BITCOIN_SV,
      network: exports.Network.MAINNET,
      path: "m/44'/236'/0'/0/0",
      config: bitcoinsv.mainnet
    }, _this$networks[exports.Network.TESTNET] = {
      blockchain: exports.Blockchain.BITCOIN_SV,
      network: exports.Network.TESTNET,
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
    _this.networks = (_this$networks = {}, _this$networks[exports.Network.MAINNET] = {
      blockchain: exports.Blockchain.BITCOIN_CASH,
      network: exports.Network.MAINNET,
      path: "m/44'/145'/0'/0/0",
      config: bitcoin.mainnet
    }, _this$networks[exports.Network.TESTNET] = {
      blockchain: exports.Blockchain.BITCOIN_CASH,
      network: exports.Network.TESTNET,
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

    var address = bchaddrjs.toCashAddress(legacy);

    if (format === 'legacy') {
      address = legacy;
    }

    if (format === 'bitpay') {
      address = bchaddrjs.toBitpayAddress(address);
    }

    return address;
  };

  _proto.isValidAddress = function isValidAddress(address) {
    return bchaddrjs.isValidAddress(address);
  };

  return BitcoinCash;
}(BitcoinBase);

var Litecoin = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Litecoin, _BitcoinBase);

  function Litecoin(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[exports.Network.MAINNET] = {
      blockchain: exports.Blockchain.LITECOIN,
      network: exports.Network.MAINNET,
      path: "m/44'/2'/0'/0/0",
      config: litecoin.mainnet
    }, _this$networks[exports.Network.TESTNET] = {
      blockchain: exports.Blockchain.LITECOIN,
      network: exports.Network.TESTNET,
      path: "m/44'/1'/0'/0/0",
      config: litecoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    return _this;
  }

  return Litecoin;
}(BitcoinBase);

var ethTx = /*#__PURE__*/require('ethereumjs-tx').Transaction;

var Ethereum = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Ethereum, _BitcoinBase);

  function Ethereum(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[exports.Network.MAINNET] = {
      blockchain: exports.Blockchain.ETHEREUM,
      network: exports.Network.MAINNET,
      path: "m/44'/60'/0'/0/0",
      config: bitcoin.mainnet
    }, _this$networks[exports.Network.TESTNET] = {
      blockchain: exports.Blockchain.ETHEREUM,
      network: exports.Network.TESTNET,
      path: "m/44'/1'/0'/0/0",
      config: bitcoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    _this.net = network;
    return _this;
  }

  var _proto = Ethereum.prototype;

  _proto.getPublicFromPrivate = function getPublicFromPrivate(privateKey) {
    return ethUtil.addHexPrefix(_BitcoinBase.prototype.getPublicFromPrivate.call(this, privateKey.replace('0x', ''), false));
  };

  _proto.getPrivateKey = function getPrivateKey(privateKey) {
    if (privateKey.privateKey) {
      return ethUtil.bufferToHex(privateKey.privateKey);
    } else {
      throw new Error('Invalid private key');
    }
  };

  _proto.getPublicKey = function getPublicKey(publicKey) {
    return ethUtil.addHexPrefix(publicKey);
  };

  _proto.getAddressFromPublic = function getAddressFromPublic(publicKey) {
    var ethPubkey = ethUtil.importPublic(Buffer.from(publicKey.replace('0x', ''), 'hex'));
    var addressBuffer = ethUtil.publicToAddress(ethPubkey);
    var hexAddress = ethUtil.addHexPrefix(addressBuffer.toString('hex'));
    var checksumAddress = ethUtil.toChecksumAddress(hexAddress);
    var address = ethUtil.addHexPrefix(checksumAddress);
    return address;
  };

  _proto.sign = function sign(data, privateKey, isTx) {
    if (isTx === void 0) {
      isTx = true;
    }

    if (isTx) {
      var chain = this.net === exports.Network.MAINNET ? 'mainnet' : 'ropsten';
      var transactionObject = JSON.parse(data);
      var txRaw = new ethTx(transactionObject, {
        chain: chain
      });
      var pk = Buffer.from(privateKey.replace('0x', ''), 'hex');
      txRaw.sign(pk);
      return "0x" + txRaw.serialize().toString('hex');
    }

    var hash = ethUtil.hashPersonalMessage(Buffer.from(data));
    var sign = ethUtil.ecsign(hash, Buffer.from(privateKey.replace('0x', ''), 'hex'));
    return JSON.stringify({
      r: sign.r.toString('hex'),
      s: sign.s.toString('hex'),
      v: sign.v
    });
  };

  _proto.checkSign = function checkSign(_, __, sign) {
    var signObject = JSON.parse(sign);
    return ethUtil.isValidSignature(parseInt(signObject.v), Buffer.from(signObject.r, 'hex'), Buffer.from(signObject.s, 'hex'));
  };

  _proto.isValidAddress = function isValidAddress(address) {
    return ethUtil.isValidAddress(address);
  };

  return Ethereum;
}(BitcoinBase);

var EOS = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(EOS, _BitcoinBase);

  function EOS(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[exports.Network.MAINNET] = {
      blockchain: exports.Blockchain.EOS,
      network: exports.Network.MAINNET,
      path: "m/44'/194'/0'/0/0",
      config: bitcoin.mainnet
    }, _this$networks[exports.Network.TESTNET] = {
      blockchain: exports.Blockchain.EOS,
      network: exports.Network.TESTNET,
      path: "m/44'/1'/0'/0/0",
      config: bitcoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    return _this;
  }

  var _proto = EOS.prototype;

  _proto.getPublicFromPrivate = function getPublicFromPrivate(privateKey) {
    return eosUtil.privateToPublic(privateKey);
  };

  _proto.getPrivateKey = function getPrivateKey(privateKey) {
    return eosUtil.PrivateKey(privateKey.privateKey).toWif();
  };

  _proto.getPublicKey = function getPublicKey(publicKey) {
    return eosUtil.PublicKey(Buffer.from(publicKey, 'hex')).toString();
  };

  _proto.getAddressFromPublic = function getAddressFromPublic(publicKey) {
    return publicKey;
  };

  _proto.sign = function sign(data, privateKey) {
    return eosUtil.sign(data, privateKey);
  };

  _proto.checkSign = function checkSign(publicKey, data, sign) {
    return eosUtil.verify(sign, data, publicKey);
  };

  _proto.isValidAddress = function isValidAddress(address) {
    var regex = new RegExp(/^\e.[a-z1-5]{12}$/g);
    return regex.test(address);
  };

  return EOS;
}(BitcoinBase);

var Ripple = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Ripple, _BitcoinBase);

  function Ripple(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[exports.Network.MAINNET] = {
      blockchain: exports.Blockchain.RIPPLE,
      network: exports.Network.MAINNET,
      path: "m/44'/144'/0'/0/0",
      config: bitcoin.mainnet
    }, _this$networks[exports.Network.TESTNET] = {
      blockchain: exports.Blockchain.RIPPLE,
      network: exports.Network.TESTNET,
      path: "m/44'/1'/0'/0/0",
      config: bitcoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    return _this;
  }

  var _proto = Ripple.prototype;

  _proto.getAddressFromPublic = function getAddressFromPublic(publicKey, format) {
    var classicAddress = rippleKeyPair.deriveAddress(publicKey);

    if (format === 'classic') {
      return classicAddress;
    }

    var xAddress = rippleUtil.classicAddressToXAddress(classicAddress, false, false);

    if (xAddress === undefined) {
      throw new Error('Unknown error deriving address');
    }

    return xAddress;
  };

  _proto.sign = function sign(data, privateKey) {
    var key = bitcoinjsLib.ECPair.fromWIF(privateKey, this.networkConfig);
    var hash = createHash('sha256').update(data).digest('hex');

    if (key.privateKey) {
      return rippleKeyPair.sign(hash, key.privateKey.toString('hex'));
    } else {
      throw Error('Invalid private key');
    }
  };

  _proto.checkSign = function checkSign(publicKey, data, sign) {
    var hash = createHash('sha256').update(data).digest('hex');
    return rippleKeyPair.verify(hash, sign, publicKey);
  };

  _proto.isValidAddress = function isValidAddress(address) {
    return rippleUtil.isValidXAddress(address) || rippleUtil.isValidClassicAddress(address);
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
      lang = exports.SeedDictionaryLang.ENGLISH;
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

  _proto.sign = function sign(data, privateKey, isTx) {
    if (isTx === void 0) {
      isTx = true;
    }

    return this.lib.sign(data, privateKey, isTx);
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

  _proto.isValidAddress = function isValidAddress(address, format) {
    return this.lib.isValidAddress(address, format);
  };

  _proto.getFormat = function getFormat(address) {
    return this.lib.getFormat(address);
  };

  Keys.decrypt = function decrypt(encryptedData, password) {
    try {
      return Promise.resolve(sodiumPlus.SodiumPlus.auto()).then(function (sodium) {
        var hashedPassword = createHash('sha256').update(password).digest('hex');
        var key = sodiumPlus.CryptographyKey.from(hashedPassword, 'hex');
        var nonce = Buffer.from(encryptedData.substring(0, 48), 'hex');
        var ciphertext = Buffer.from(encryptedData.substring(48), 'hex');
        return Promise.resolve(sodium.crypto_secretbox_open(ciphertext, nonce, key)).then(function (decrypted) {
          return decrypted.toString('utf-8');
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  Keys.encrypt = function encrypt(data, password) {
    try {
      return Promise.resolve(sodiumPlus.SodiumPlus.auto()).then(function (sodium) {
        var hashedPassword = createHash('sha256').update(password).digest('hex');
        var key = sodiumPlus.CryptographyKey.from(hashedPassword, 'hex');
        return Promise.resolve(sodium.randombytes_buf(24)).then(function (nonce) {
          return Promise.resolve(sodium.crypto_secretbox(data, nonce, key)).then(function (ciphertext) {
            var encryptedData = nonce.toString('hex') + ciphertext.toString('hex');
            return encryptedData;
          });
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return Keys;
}();

exports.Keys = Keys;
//# sourceMappingURL=crypto-api-keys-lib.cjs.development.js.map
