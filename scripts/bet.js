const ecc = require('eosjs-ecc');
const { bet } = require('../src/helpers/actions');

if (process.argv.length < 6) {
  console.log("Required Args: actor/data.better, data.hash, data.gamekey, data.wager")
  process.exit()
}

const hash = ecc.sha256(process.argv[3]);
console.log("Saving Data as Hash:", hash);

bet(process.argv[2], hash, process.argv[4], process.argv[5]);
