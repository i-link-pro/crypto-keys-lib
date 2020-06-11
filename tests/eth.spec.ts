
import * as assert from 'assert';
import * as sinon from 'sinon';
import { describe, it, after, before } from 'mocha';
import { Keys } from '../src/lib';
import { Network, Blockchain } from '../src/types'
import { Ethereum } from '../src/blockchains/ethereum';

describe('Lib/Ethereum', () => {
  const instance = new Keys(Blockchain.ETHEREUM, Network.MAINNET);
  describe('#getDataFromSeed/generateSeedPhrase', () => {
    const seed = instance.generateSeedPhrase(12);
    const actual = instance.getDataFromSeed(seed['seedPhrase']);
    it(`should be return \`${seed['seedPhrase']}\` seedPhrase`, () => {
      assert.strictEqual(actual['seedPhrase'], seed['seedPhrase']);
    });

    it(`should be return \`${seed['masterPublicKey']}\` masterPublicKey`, () => {
      assert.strictEqual(actual['masterPublicKey'], seed['masterPublicKey']);
    });

    it(`should be return \`${seed['masterPrivateKey']}\ masterPrivateKey`, () => {
      assert.strictEqual(actual['masterPrivateKey'], seed['masterPrivateKey']);
    });
  });

  describe('#getDefaultPaths', () => {
    const actualPaths = instance.getDefaultPaths();
    it('should return exact paths', () => {
      const expectedPaths = [{
        blockchain: 'ethereum',
        network: 'mainnet',
        path: 'm/44\'/60\'/0\'/0/0'
      },
      {
        blockchain: 'ethereum',
        network: 'testnet',
        path: 'm/44\'/1\'/0\'/0/0'
      }];
      assert.deepEqual(actualPaths, expectedPaths);
    });
  });

  describe('#checkSeedPhrase', () => {
    const seedPhrase = 'danger eagle reopen sadness citizen health soccer toilet live erupt fortune crunch';
    const actual = instance.checkSeedPhrase(seedPhrase);
    it('should return `true`', () => {
      assert.strictEqual(actual, true);
    });
  });

  describe('#derivateKeys', () => {
    let spy;
    let actual;
    before((done) => {
      spy = sinon.spy(Ethereum.prototype, 'derivateFromPrivate');
      const cursor = {
        skip: 1,
        limit: 1
      }
      /**
       * source: https://github.com/ethereumjs/ethereumjs-wallet
       */
      const masterPrivateKey = { masterPrivateKey: 'xprv9s21ZrQH143K3QqLo4e4GC1Wzrb3VQBxEyxiRJhkg2NFVDHtTbCSwB57FKPEYR5XPU6GGwdzX8tYZfRPDREShvkbRfDEgXGiaZSq2iSgQMj' }
      actual = instance.derivateKeys(masterPrivateKey, cursor);
      done();
    })
    after((done): void => {
      sinon.restore();
      done();
    })
      context('positive result', () => {
      const expected: [{ path: string, address: string, publicKey: string, privateKey: string }] = [
        {
          path: "m/44'/60'/0'/0/2",
          address: '0xc26B7Db4514a0975E44F3b71FD4bD9db17E82070',
          publicKey: '0x03a55a817958c37eaa3f932ea7ca8f81bcec880c451a80c22300a5fb6fcb1acacc',
          privateKey: '0x2d42815e05ca241d7ec5666252d836359625993857b43e5e163c2b8f0d8626f7'
        }
      ];
      it(`should be return correct ${expected[0]['path']} path`, () => {
        assert.strictEqual(actual[0]['path'], expected[0]['path']);
      });

      it(`should be return correct ${expected[0]['address']} address`, () => {
        assert.strictEqual(actual[0]['address'], expected[0]['address']);
      });

      it(`should be return correct ${expected[0]['publicKey']} publicKey`, () => {
        assert.strictEqual(actual[0]['publicKey'], expected[0]['publicKey']);
      });

      it(`should be return correct ${expected[0]['privateKey']} privateKey`, () => {
        assert.strictEqual(actual[0]['privateKey'], expected[0]['privateKey']);
      });

      it(`should be call {derivateFromPrivate} function 1 time`, () => {
        assert.strictEqual(spy.callCount, 1);
      });

      it(`should be call {derivateFromPrivate} function with following args 
          ['xprv9s21ZrQH143K3QqLo4e4GC1Wzrb3VQBxEyxiRJhkg2NFVDHtTbCSwB57FKPEYR5XPU6GGwdzX8tYZfRPDREShvkbRfDEgXGiaZSq2iSgQMj',
          { limit: 1, skip: 1 }]`, () => {
        assert.deepEqual(spy.args[0], ['xprv9s21ZrQH143K3QqLo4e4GC1Wzrb3VQBxEyxiRJhkg2NFVDHtTbCSwB57FKPEYR5XPU6GGwdzX8tYZfRPDREShvkbRfDEgXGiaZSq2iSgQMj',
        { limit: 1, skip: 1 }]);
      });
    });
  })

  describe('#derivateKeys/errorHandling', () => {
    const cursor = {
      skip: 1,
      limit: 1
    };
    const masterPrivateKey = { masterPrivateKey: 'xprv9s21ZrQH143K3QqLo4e4GC1Wzrb3VQBxEyxiRJhkg2NFVDHtTbCSwB57FKPEYR5XPU6GGwdzX8tYZfRPDREShvkbRfDEgXGiaZSq2iSgQMj' }
    try {
      instance.derivateKeys({ masterPrivateKey: 'invalidKey' }, cursor); // check behavior in case of non-base58 charackter
    } catch (ex) {
      it('should be throw an error with following message `Non-base58 character`', () => {
        assert.strictEqual(ex.message, 'Non-base58 character');
      });
    }
    try {
      cursor.limit = -1;
      instance.derivateKeys(masterPrivateKey, cursor); // check behavior in case of negative limit
    } catch (ex) {
      it('should be throw an error with following message `Limit must be greater than zero`', () => {
        assert.strictEqual(ex.message, 'Limit must be greater than zero');
      });
    }
  });

  describe('#sign', () => {
    const privateKey = 'efca4cdd31923b50f4214af5d2ae10e7ac45a5019e9431cc195482d707485378';
    const actual = instance.sign('fake_data', privateKey);
    it('should be return `{"r":"58f4a1752fd3b747ba5e4a531bdff163ae20b741f23f1ae2a52e1d83a5133b01","s":"5d6c1dec0f7287495c59bad2b1bea07311d610fbf9b098076ba4103adf5248bc","v":27}`', () => {
      assert.strictEqual(actual, '{"r":"58f4a1752fd3b747ba5e4a531bdff163ae20b741f23f1ae2a52e1d83a5133b01","s":"5d6c1dec0f7287495c59bad2b1bea07311d610fbf9b098076ba4103adf5248bc","v":27}');
    });
    try {
      instance.sign('fake_data', 'Invalid_Private_Key'); // check behavior in case of invalid private Key
    } catch (ex) {
      it('should be throw an error with following message `Expected private key to be an Uint8Array with length 32`', () => {
        assert.strictEqual(ex.message, 'Expected private key to be an Uint8Array with length 32');
      });
    }
  });

  describe('#getPublicFromPrivate', () => {
    const privateKey = '0x2d42815e05ca241d7ec5666252d836359625993857b43e5e163c2b8f0d8626f7';
    const actual = instance.getPublicFromPrivate(privateKey);
    it(`should be return 0x03a55a817958c37eaa3f932ea7ca8f81bcec880c451a80c22300a5fb6fcb1acacc`, () => {
      assert.strictEqual(actual, '0x03a55a817958c37eaa3f932ea7ca8f81bcec880c451a80c22300a5fb6fcb1acacc');
    });
    try {
      instance.getPublicFromPrivate('Invalid_Private_Key'); // check behavior in case of invalid private Key
    } catch (ex) {
      it('should be throw an error with following message `Expected Buffer(Length: 32), got Buffer(Length: 0)`', () => {
        assert.strictEqual(ex.message, 'Expected Buffer(Length: 32), got Buffer(Length: 0)');
      });
    }
  });

  describe('#getAddressFromPublic', () => {
    const publicKey = '0x03a55a817958c37eaa3f932ea7ca8f81bcec880c451a80c22300a5fb6fcb1acacc';
    const actual = instance.getAddressFromPublic(publicKey);
    it(`should be return 0xc26B7Db4514a0975E44F3b71FD4bD9db17E82070`, () => {
      assert.strictEqual(actual, '0xc26B7Db4514a0975E44F3b71FD4bD9db17E82070');
    });
    try {
      instance.getAddressFromPublic('Invalid_Public_Key'); // check behavior in case of invalid public Key
    } catch (ex) {
      it('should be throw an error with following message `Expected public key to be an Uint8Array with length [33, 65]`', () => {
        assert.strictEqual(ex.message, 'Expected public key to be an Uint8Array with length [33, 65]');
      });
    }
  });

  describe('#checkSign', () => {
    const actual = instance.checkSign('0x03a55a817958c37eaa3f932ea7ca8f81bcec880c451a80c22300a5fb6fcb1acacc', 'fake_data', '{"r":"58f4a1752fd3b747ba5e4a531bdff163ae20b741f23f1ae2a52e1d83a5133b01","s":"5d6c1dec0f7287495c59bad2b1bea07311d610fbf9b098076ba4103adf5248bc","v":27}');
    it('should be return `true`', () => {
      assert.strictEqual(actual, true);
    });
    try {
      instance.checkSign('0x03a55a817958c37eaa3f932ea7ca8f81bcec880c451a80c22300a5fb6fcb1acacc', 'fake_data', 'invalid_sign');
    } catch (ex) {
      it('should be throw an error with following message `Unexpected token i in JSON at position 0`', () => {
        assert.strictEqual(ex.message, 'Unexpected token i in JSON at position 0');
      });
    }
  });
})