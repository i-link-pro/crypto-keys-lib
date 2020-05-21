import { Keys } from "./lib";
import { Blockchain, Network } from "./keys.types";

const keys = new Keys(Blockchain.BITCOIN, Network.MAINNET);
console.log(keys.generateSeedPhrase(12));
