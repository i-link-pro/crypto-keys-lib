import { SodiumPlus, CryptographyKey } from 'sodium-plus';
import createHash from 'create-hash';
import { mnemonicToSeedSync, validateMnemonic as validateMnemonic$1, setDefaultWordlist, generateMnemonic as generateMnemonic$1 } from 'bip39';
import baseX from 'base-x';
import { Psbt, ECPair, payments } from 'bitcoinjs-lib';
import { fromBase58, fromSeed } from 'bip32';
import bech32 from 'bech32';
import { toCashAddress, toBitpayAddress, isValidAddress } from 'bchaddrjs';
import { addHexPrefix, bufferToHex, importPublic, publicToAddress, toChecksumAddress, hashPersonalMessage, ecsign, isValidSignature, isValidAddress as isValidAddress$1 } from 'ethereumjs-util';
import { privateToPublic, PrivateKey, PublicKey, sign, verify } from 'eosjs-ecc';
import { JsonRpc, Api } from 'eosjs';
import { deriveAddress, sign as sign$1, verify as verify$1 } from 'ripple-keypairs';
import { classicAddressToXAddress, isValidXAddress, isValidClassicAddress } from 'ripple-address-codec';

var Blockchain;

(function (Blockchain) {
  Blockchain["BITCOIN"] = "bitcoin";
  Blockchain["ETHEREUM"] = "ethereum";
  Blockchain["EOS"] = "eos";
  Blockchain["BITCOIN_CASH"] = "bitcoin_cash";
  Blockchain["BITCOIN_SV"] = "bitcoin_sv";
  Blockchain["LITECOIN"] = "litecoin";
  Blockchain["RIPPLE"] = "ripple";
  Blockchain["DOGECOIN"] = "dogecoin";
  Blockchain["EMERCOIN"] = "emercoin";
  Blockchain["DASHCOIN"] = "dashcoin";
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

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
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
var dogecoin = {
  mainnet: {
    messagePrefix: '\x19Dogecoin Signed Message:\n',
    bech32: 'xdg',
    bip32: {
      "public": 0x02facafd,
      "private": 0x02fac398
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x16,
    wif: 0x9e
  },
  testnet: {
    messagePrefix: '\x18Dogecoin Signed Message:\n',
    bech32: 'xdg',
    bip32: {
      "public": 0x043587cf,
      "private": 0x04358394
    },
    pubKeyHash: 0x71,
    scriptHash: 0xc4,
    wif: 0xf1
  }
};
var emercoin = {
  mainnet: {
    messagePrefix: '\x18Emercoin Signed Message:\n',
    bech32: 'emc',
    bip32: {
      "public": 0x0488b21e,
      "private": 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80
  },
  testnet: {
    messagePrefix: '\x18Emercoin Signed Message:\n',
    bech32: 'emc',
    bip32: {
      "public": 0x043587cf,
      "private": 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
  },
  regtest: {
    messagePrefix: '\x18Emercoin Signed Message:\n',
    bech32: 'emc',
    bip32: {
      "public": 0x043587cf,
      "private": 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
  }
};
var dashcoin = {
  mainnet: {
    messagePrefix: '\x18Dashcoin Signed Message:\n',
    bech32: 'dash',
    bip32: {
      "public": 0x0488b21e,
      "private": 0x0488ade4
    },
    pubKeyHash: 0x4c,
    scriptHash: 0x10,
    wif: 0xcc
  },
  testnet: {
    messagePrefix: '\x18Dashcoin Signed Message:\n',
    bech32: 'dash',
    bip32: {
      "public": 0x043587cf,
      "private": 0x04358394
    },
    pubKeyHash: 0x8c,
    scriptHash: 0x13,
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

    this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.BITCOIN,
      network: Network.MAINNET,
      path: "m/44'/0'/0'",
      config: bitcoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.BITCOIN,
      network: Network.TESTNET,
      path: "m/44'/1'/0'",
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
        path: path.path + '/0/0'
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

  _proto.getPath = function getPath(path, isAccount) {
    if (path.indexOf('m') !== -1) {
      if (isAccount) {
        throw new Error("invalid path or key\n use full path(m/44'/194'/0'/0/2) with master key\n use short path(0/2) with master account key");
      }

      return path;
    } else {
      if (isAccount) {
        return path;
      } else {
        return this.defaultPath + '/' + path;
      }
    }
  };

  _proto.derivateFromPrivate = function derivateFromPrivate(masterPrivateKey, cursor) {
    var _this = this;

    var wallet = fromBase58(masterPrivateKey, this.networkConfig);
    var isAccount = false;

    if (wallet.parentFingerprint) {
      isAccount = true;
    }

    var indexes = getIndexes(cursor.skip, cursor.limit);
    var path = preparePath(this.getPath(cursor.path || '0/0', isAccount));
    return indexes.map(function (index) {
      var currentPath = path.replace('{index}', index.toString());
      var derived = wallet.derivePath(currentPath);
      return {
        path: _this.getPath(currentPath, false),
        address: _this.getAddressFromPublic(_this.getPublicKey(derived.publicKey.toString('hex'))),
        publicKey: _this.getPublicKey(derived.publicKey.toString('hex')),
        privateKey: _this.getPrivateKey(derived)
      };
    });
  };

  _proto.derivateFromPublic = function derivateFromPublic(masterPublicKey, cursor) {
    var _this2 = this;

    var wallet = fromBase58(masterPublicKey, this.networkConfig);
    var isAccount = false;

    if (wallet.parentFingerprint) {
      isAccount = true;
    }

    var indexes = getIndexes(cursor.skip, cursor.limit);
    var path = preparePath(this.getPath(cursor.path || '0/0', isAccount));
    return indexes.map(function (index) {
      var currentPath = path.replace('{index}', index.toString());
      var pathParts = currentPath.replace(getHardenedPath(path), '').split('/').filter(function (part) {
        return part;
      }).map(function (part) {
        return parseInt(part);
      });

      var derived = _this2.deriveRecursive(wallet, pathParts);

      return {
        path: _this2.getPath(currentPath, false),
        address: _this2.getAddressFromPublic(_this2.getPublicKey(derived.publicKey.toString('hex'))),
        publicKey: _this2.getPublicKey(derived.publicKey.toString('hex'))
      };
    });
  };

  _proto.sign = function sign(data, privateKey, isTx) {
    if (isTx === void 0) {
      isTx = true;
    }

    try {
      var _this4 = this;

      if (isTx) {
        var dataObj;
        var mapPrivateKeys;

        try {
          dataObj = JSON.parse(data);
          mapPrivateKeys = JSON.parse(privateKey);
        } catch (err) {
          throw new Error('Invalid data or key, must be json string');
        }

        var signedHex = '';
        var tx = new Psbt({
          network: _this4.networkConfig
        });

        for (var _iterator = _createForOfIteratorHelperLoose(dataObj.inputs), _step; !(_step = _iterator()).done;) {
          var input = _step.value;

          if (input.type.includes('witness')) {
            tx.addInput({
              hash: input.txId,
              index: input.n,
              witnessUtxo: {
                script: Buffer.from(input.scriptPubKeyHex, 'hex'),
                value: +input.value
              }
            });
          } else {
            tx.addInput({
              hash: input.txId,
              index: input.n,
              nonWitnessUtxo: Buffer.from(input.hex, 'hex')
            });
          }
        }

        for (var _iterator2 = _createForOfIteratorHelperLoose(dataObj.outputs), _step2; !(_step2 = _iterator2()).done;) {
          var output = _step2.value;
          tx.addOutput({
            address: output.address,
            value: +output.amount
          });
        }

        for (var _iterator3 = _createForOfIteratorHelperLoose(dataObj.inputs.entries()), _step3; !(_step3 = _iterator3()).done;) {
          var _step3$value = _step3.value,
              index = _step3$value[0],
              _input = _step3$value[1];
          var keyPair = ECPair.fromWIF(mapPrivateKeys[_input.address], _this4.networkConfig);
          tx.signInput(index, keyPair);
          tx.validateSignaturesOfInput(index);
        }

        tx.finalizeAllInputs();
        signedHex = tx.extractTransaction().toHex();
        return Promise.resolve(signedHex);
      }

      var key = ECPair.fromWIF(privateKey, _this4.networkConfig);
      var hash = createHash('sha256').update(data).digest('hex');
      return Promise.resolve(key.sign(Buffer.from(hash, 'hex')).toString('hex'));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.checkSign = function checkSign(publicKey, data, sign) {
    var key = ECPair.fromPublicKey(Buffer.from(publicKey, 'hex'), {
      network: this.networkConfig
    });
    var hash = createHash('sha256').update(data).digest('hex');
    return key.verify(Buffer.from(hash, 'hex'), Buffer.from(sign, 'hex'));
  };

  _proto.getMasterAddressFromSeed = function getMasterAddressFromSeed(seed, path) {
    var hdkey = fromSeed(Buffer.from(seed, 'hex'), this.networkConfig);
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
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.BITCOIN_SV,
      network: Network.MAINNET,
      path: "m/44'/236'/0'",
      config: bitcoinsv.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.BITCOIN_SV,
      network: Network.TESTNET,
      path: "m/44'/1'/0'",
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
      path: "m/44'/145'/0'",
      config: bitcoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.BITCOIN_CASH,
      network: Network.TESTNET,
      path: "m/44'/1'/0'",
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

  _proto.isValidAddress = function isValidAddress$1(address) {
    return isValidAddress(address);
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
      path: "m/44'/2'/0'",
      config: litecoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.LITECOIN,
      network: Network.TESTNET,
      path: "m/44'/1'/0'",
      config: litecoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    return _this;
  }

  return Litecoin;
}(BitcoinBase);

var Dogecoin = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Dogecoin, _BitcoinBase);

  function Dogecoin(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.DOGECOIN,
      network: Network.MAINNET,
      path: "m/44'/3'/0'",
      config: dogecoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.DOGECOIN,
      network: Network.TESTNET,
      path: "m/44'/1'/0'",
      config: dogecoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    return _this;
  }

  return Dogecoin;
}(BitcoinBase);

var ethTx = /*#__PURE__*/require('ethereumjs-tx').Transaction;

var Ethereum = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Ethereum, _BitcoinBase);

  function Ethereum(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.ETHEREUM,
      network: Network.MAINNET,
      path: "m/44'/60'/0'",
      config: bitcoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.ETHEREUM,
      network: Network.TESTNET,
      path: "m/44'/1'/0'",
      config: bitcoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    _this.net = network;
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

  _proto.sign = function sign(data, privateKey, isTx) {
    if (isTx === void 0) {
      isTx = true;
    }

    try {
      var _this3 = this;

      if (isTx) {
        var chain = _this3.net === Network.MAINNET ? 'mainnet' : 'ropsten';
        var transactionObject = JSON.parse(data);
        var txRaw = new ethTx(transactionObject, {
          chain: chain
        });
        var pk = Buffer.from(privateKey.replace('0x', ''), 'hex');
        txRaw.sign(pk);
        return Promise.resolve("0x" + txRaw.serialize().toString('hex'));
      }

      var hash = hashPersonalMessage(Buffer.from(data));
      var sign = ecsign(hash, Buffer.from(privateKey.replace('0x', ''), 'hex'));
      return Promise.resolve(JSON.stringify({
        r: sign.r.toString('hex'),
        s: sign.s.toString('hex'),
        v: sign.v
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.checkSign = function checkSign(_, __, sign) {
    var signObject = JSON.parse(sign);
    return isValidSignature(parseInt(signObject.v), Buffer.from(signObject.r, 'hex'), Buffer.from(signObject.s, 'hex'));
  };

  _proto.isValidAddress = function isValidAddress(address) {
    return isValidAddress$1(address);
  };

  return Ethereum;
}(BitcoinBase);

var _require = /*#__PURE__*/require('eosjs/dist/eosjs-jssig'),
    JsSignatureProvider = _require.JsSignatureProvider;

var fetch = /*#__PURE__*/require('node-fetch');

var _require2 = /*#__PURE__*/require('util'),
    TextEncoder = _require2.TextEncoder,
    TextDecoder = _require2.TextDecoder;

var EOS = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(EOS, _BitcoinBase);

  function EOS(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.EOS,
      network: Network.MAINNET,
      path: "m/44'/194'/0'",
      config: bitcoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.EOS,
      network: Network.TESTNET,
      path: "m/44'/1'/0'",
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

  _proto.sign = function sign$1(data, privateKey, isTx) {
    try {
      var _temp3 = function _temp3(_result) {
        return _exit2 ? _result : sign(data, privateKey);
      };

      var _exit2 = false;

      var _temp4 = function () {
        if (isTx) {
          var accountPrvKey = Object.values(JSON.parse(privateKey))[0];
          var signatureProvider = new JsSignatureProvider([accountPrvKey]);
          var rpc = new JsonRpc(JSON.parse(data).endpoint, {
            fetch: fetch
          });
          var api = new Api({
            rpc: rpc,
            signatureProvider: signatureProvider,
            textDecoder: new TextDecoder(),
            textEncoder: new TextEncoder()
          });
          return Promise.resolve(api.transact({
            actions: JSON.parse(data).actions
          }, {
            broadcast: false,
            sign: true,
            blocksBehind: 3,
            expireSeconds: 3600
          })).then(function (result) {
            result.serializedTransaction = Buffer.from(result.serializedTransaction).toString('hex');
            _exit2 = true;
            return JSON.stringify(result);
          });
        }
      }();

      return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.checkSign = function checkSign(publicKey, data, sign) {
    return verify(sign, data, publicKey);
  };

  _proto.isValidAddress = function isValidAddress(address) {
    var regex = new RegExp(/^[a-z1-5\.]{12}$/g);
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
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.RIPPLE,
      network: Network.MAINNET,
      path: "m/44'/144'/0'",
      config: bitcoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.RIPPLE,
      network: Network.TESTNET,
      path: "m/44'/1'/0'",
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
    try {
      var _this3 = this;

      var key = ECPair.fromWIF(privateKey, _this3.networkConfig);
      var hash = createHash('sha256').update(data).digest('hex');

      if (key.privateKey) {
        return Promise.resolve(sign$1(hash, key.privateKey.toString('hex')));
      } else {
        throw Error('Invalid private key');
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.checkSign = function checkSign(publicKey, data, sign) {
    var hash = createHash('sha256').update(data).digest('hex');
    return verify$1(hash, sign, publicKey);
  };

  _proto.isValidAddress = function isValidAddress(address) {
    return isValidXAddress(address) || isValidClassicAddress(address);
  };

  return Ripple;
}(BitcoinBase);

var Emercoin = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Emercoin, _BitcoinBase);

  function Emercoin(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.EMERCOIN,
      network: Network.MAINNET,
      path: "m/44'/6'/0'",
      config: emercoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.EMERCOIN,
      network: Network.TESTNET,
      path: "m/44'/6'/0'",
      config: emercoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    return _this;
  }

  return Emercoin;
}(BitcoinBase);

var Dashcoin = /*#__PURE__*/function (_BitcoinBase) {
  _inheritsLoose(Dashcoin, _BitcoinBase);

  function Dashcoin(network) {
    var _this$networks;

    var _this;

    _this = _BitcoinBase.call(this, network) || this;
    _this.networks = (_this$networks = {}, _this$networks[Network.MAINNET] = {
      blockchain: Blockchain.DASHCOIN,
      network: Network.MAINNET,
      path: "m/44'/5'/0'",
      config: dashcoin.mainnet
    }, _this$networks[Network.TESTNET] = {
      blockchain: Blockchain.DASHCOIN,
      network: Network.TESTNET,
      path: "m/44'/1'/0'",
      config: dashcoin.testnet
    }, _this$networks);
    _this.networkConfig = _this.networks[network].config;
    _this.defaultPath = _this.networks[network].path;
    return _this;
  }

  return Dashcoin;
}(BitcoinBase);

var blockchainLibs = {
  bitcoin: Bitcoin,
  litecoin: Litecoin,
  bitcoin_sv: BitcoinSV,
  bitcoin_cash: BitcoinCash,
  ethereum: Ethereum,
  eos: EOS,
  ripple: Ripple,
  dogecoin: Dogecoin,
  emercoin: Emercoin,
  dashcoin: Dashcoin
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

      if (pathCursor.path && pathCursor.path.indexOf('m') !== -1) {
        return this.lib.derivateFromPrivate(seedData.masterPrivateKey, pathCursor);
      } else {
        return this.lib.derivateFromPrivate(seedData.masterAccountPrivateKey, pathCursor);
      }
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

    try {
      var _this2 = this;

      return Promise.resolve(_this2.lib.sign(data, privateKey, isTx));
    } catch (e) {
      return Promise.reject(e);
    }
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
      return Promise.resolve(SodiumPlus.auto()).then(function (sodium) {
        var hashedPassword = createHash('sha256').update(password).digest('hex');
        var key = CryptographyKey.from(hashedPassword, 'hex');
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
      return Promise.resolve(SodiumPlus.auto()).then(function (sodium) {
        var hashedPassword = createHash('sha256').update(password).digest('hex');
        var key = CryptographyKey.from(hashedPassword, 'hex');
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

export { Blockchain, Keys, Network, SeedDictionaryLang };
//# sourceMappingURL=crypto-api-keys-lib.esm.js.map
