import { BitcoinBase } from './bitcoin-base';
import { Bitcoin } from './bitcoin';
import { Network, Blockchain } from '../types';
import { Keys } from '../lib';
import { BitcoinCash } from './bitcoin-cash';
import { BitcoinSV } from './bitcoinsv';
import { Ethereum } from './ethereum';
import { Litecoin } from './litecoin';
import { Ripple } from './ripple';
import { EOS } from './eos';

for (const blockchain in Blockchain) {
    for (const network in Network) {

        const keys = new Keys(Blockchain[blockchain], Network[network])
        const seed = keys.generateSeedPhrase(12)

        if (seed && !(seed instanceof Error)) {
            const dkeys = keys.derivateKeys(
                { masterPublicKey: seed.masterPublicKey },
                { skip: 0, limit: 1, path: "m/44'/0'/0'/0/3" },
            )
            
            for (const key in dkeys) {
                let address: string;

                if(dkeys[key]["address"].split(":").length === 2) {
                    address = dkeys[key]["address"].split(":")[1];
                } else {
                    address = dkeys[key]["address"];
                }

                let bitcoin;

                switch (Blockchain[blockchain]) {
                    case Blockchain.BITCOIN:
                        bitcoin = new Bitcoin(Network[network]);
                        break;

                    case Blockchain.BITCOIN_CASH:
                        bitcoin = new BitcoinCash(Network[network]);
                        break;
                  
                    case Blockchain.BITCOIN_SV:
                        bitcoin = new BitcoinSV(Network[network]);
                        break;

                    case Blockchain.EOS:

                        const generateEOS = (length = 12, prefix = 'e.') => {
                            let text = ''
                            let possible = 'abcdefghijklmnopqrstuvwxyz12345'
                        
                            for (let i = 0; i < length; i++) {
                                text += possible.charAt(Math.floor(Math.random() * possible.length))
                            }
                        
                            return prefix + text
                        }
                        address = generateEOS();
                        bitcoin = new EOS(Network[network]);
                        break;

                    case Blockchain.ETHEREUM:
                        bitcoin = new Ethereum(Network[network]);
                        break;
                    
                    case Blockchain.LITECOIN:
                        bitcoin = new Litecoin(Network[network]);                       
                        break;

                    case Blockchain.RIPPLE:
                        const generateRipple = (length = 30, prefix = 'r') => {
                            let text = ''
                            let possible = 'rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz'
                        
                            for (let i = 0; i < length; i++) {
                                text += possible.charAt(Math.floor(Math.random() * possible.length))
                            }
                        
                            return prefix + text
                        }
                        address = generateRipple();
                        bitcoin = new Ripple(Network[network]);               
                        break;
                }
                
                if(!address) {
                    console.debug("Empty address detected!");
                    continue;
                }

                const format = bitcoin.getFormat(address);

                console.log(
                    "\nType:", bitcoin.constructor.name,
                    "\nBlockchain:", blockchain,
                    "\nNetwork:", network,
                    "\nAddress:", address,
                    "\nAddress Format:", format,
                    "\nVALID:", bitcoin.isValidAddress(address, format)
                );

            }
        }

    }
}
