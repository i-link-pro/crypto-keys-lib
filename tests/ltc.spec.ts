
import * as assert from 'assert';
import * as sinon from 'sinon';
import { describe, it, after, before } from 'mocha';
import { Keys } from '../src/lib';
import { Network, Blockchain } from '../src/types'
import { Litecoin } from '../src/blockchains/litecoin';

describe('Lib/Litecoin', () => {
  const instance = new Keys(Blockchain.LITECOIN, Network.MAINNET);
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
        blockchain: 'litecoin',
        network: 'mainnet',
        path: 'm/44\'/2\'/0\'/0/0'
      },
      {
        blockchain: 'litecoin',
        network: 'testnet',
        path: 'm/44\'/1\'/0\'/0/0'
      }];
      assert.deepEqual(actualPaths, expectedPaths);
    });
  });

  describe('#checkSeedPhrase', () => {
    const seedPhrase = 'program term park ticket dinner jar dumb couch drive song olive panel';
    const actualPositive: boolean | Error = instance.checkSeedPhrase(seedPhrase);
    it('should return `true`', () => {
      assert.strictEqual(actualPositive, true);
    });
    const actualNegative: boolean | Error = instance.checkSeedPhrase('invalid');
    it('should return `false`', () => {
      assert.strictEqual(actualNegative, false);
    });
  });

  describe('#derivateKeys', () => {
    let spy;
    let actual;
    before((done) => {
      spy = sinon.spy(Litecoin.prototype, 'derivateFromPrivate');
      const cursor = {
        skip: 1,
        limit: 1
      }
      const masterPrivateKey = { masterPrivateKey: 'xprv9s21ZrQH143K2A5Tci5JZxXZ3suP76VAdUoJF6K4Qa2rg8fBxxe9JWhG9a5Lbhu9w3BRkhpN6hrrgqtovHMwSjy5nWFNoWzKRVd8ftDgk7B' }
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
          path: "m/44'/2'/0'/0/2",
          address: 'LbYDGDVhLXer4YQCmjaEYBeMQUrwYdYdyM',
          publicKey: '022c26bc8fc69a773a61660cfbf463955a622c44db6fcc54fadbc08c1d5dbfe3ce',
          privateKey: 'T5KAL3bY2BYSoT88UnHiVcKqrqku7wM9WuwGLXV5DiSSWfRGXUNz'
        }
      ]
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
          ['xprv9s21ZrQH143K2A5Tci5JZxXZ3suP76VAdUoJF6K4Qa2rg8fBxxe9JWhG9a5Lbhu9w3BRkhpN6hrrgqtovHMwSjy5nWFNoWzKRVd8ftDgk7B',
          { limit: 1, skip: 1 }]`, () => {
        assert.deepEqual(spy.args[0], ['xprv9s21ZrQH143K2A5Tci5JZxXZ3suP76VAdUoJF6K4Qa2rg8fBxxe9JWhG9a5Lbhu9w3BRkhpN6hrrgqtovHMwSjy5nWFNoWzKRVd8ftDgk7B',
        { limit: 1, skip: 1 }]);
      });
    });
  })

  describe('#derivateKeys/errorHandling', () => {
    const cursor = {
      skip: 1,
      limit: 1
    };
    const masterPrivateKey = { masterPrivateKey: 'xprv9s21ZrQH143K2QbSWMWSscALjtkQ6GrUnNJh6UhKXQKtzzvKGkoyHDRiRmAouoy4H9J7G6fUm8vScVp12wodtsd83cAzQhKfvWyqoad35Zj' }
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
    const privateKey = 'T5KAL3bY2BYSoT88UnHiVcKqrqku7wM9WuwGLXV5DiSSWfRGXUNz';
    const actual = instance.sign('fake_data', privateKey);
    it('should be return `418b0dd60b32af679df67f781d3f9a3e17c1def9d7fb9408757aec0bbac77f5700de784ca57c99ab296991d831902536e6af171efe9cd83dfa539c600fed7c11`', () => {
      assert.strictEqual(actual, '418b0dd60b32af679df67f781d3f9a3e17c1def9d7fb9408757aec0bbac77f5700de784ca57c99ab296991d831902536e6af171efe9cd83dfa539c600fed7c11');
    });
    try {
      instance.sign('fake_data', 'Invalid_Private_Key'); // check behavior in case of invalid private Key
    } catch (ex) {
      it('should be throw an error with following message `Non-base58 character`', () => {
        assert.strictEqual(ex.message, 'Non-base58 character');
      });
    }
  });

  describe('#getPublicFromPrivate', () => {
    const privateKey = 'T5KAL3bY2BYSoT88UnHiVcKqrqku7wM9WuwGLXV5DiSSWfRGXUNz';
    const actual = instance.getPublicFromPrivate(privateKey);
    it(`should be return 022c26bc8fc69a773a61660cfbf463955a622c44db6fcc54fadbc08c1d5dbfe3ce`, () => {
      assert.strictEqual(actual, '022c26bc8fc69a773a61660cfbf463955a622c44db6fcc54fadbc08c1d5dbfe3ce');
    });
    try {
      instance.getPublicFromPrivate('Invalid_Private_Key'); // check behavior in case of invalid private Key
    } catch (ex) {
      it('should be throw an error with following message `Non-base58 character`', () => {
        assert.strictEqual(ex.message, 'Non-base58 character');
      });
    }
  });

  describe('#getAddressFromPublic', () => {
    const publicKey = '022c26bc8fc69a773a61660cfbf463955a622c44db6fcc54fadbc08c1d5dbfe3ce';
    const actual = instance.getAddressFromPublic(publicKey);
    it(`should be return LbYDGDVhLXer4YQCmjaEYBeMQUrwYdYdyM`, () => {
      assert.strictEqual(actual, 'LbYDGDVhLXer4YQCmjaEYBeMQUrwYdYdyM');
    });
    try {
      instance.getAddressFromPublic('Invalid_Public_Key'); // check behavior in case of invalid public Key
    } catch (ex) {
      it('should be throw an error with following message `Expected property "pubkey" of type ?isPoint, got Buffer`', () => {
        assert.strictEqual(ex.message, 'Expected property "pubkey" of type ?isPoint, got Buffer');
      });
    }
  });

  describe('#checkSign', () => {
    const actual = instance.checkSign('022c26bc8fc69a773a61660cfbf463955a622c44db6fcc54fadbc08c1d5dbfe3ce', 'fake_data', '418b0dd60b32af679df67f781d3f9a3e17c1def9d7fb9408757aec0bbac77f5700de784ca57c99ab296991d831902536e6af171efe9cd83dfa539c600fed7c11');
    it('should be return `true`', () => {
      assert.strictEqual(actual, true);
    });
    try {
      instance.checkSign('022c26bc8fc69a773a61660cfbf463955a622c44db6fcc54fadbc08c1d5dbfe3ce', 'fake_data', 'invalid_sign');
    } catch (ex) {
      it('should be throw an error with following message `Expected Signature`', () => {
        assert.strictEqual(ex.message, 'Expected Signature');
      });
    }
  });
})