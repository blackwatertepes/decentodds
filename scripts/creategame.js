const { creategame } = require('../src/helpers/actions');
const ecc = require('eosjs-ecc');

if (process.argv.length < 3) {
  console.log("Required Args: data.hash")
  process.exit()
}

const hash = ecc.sha256(process.argv[2]);
console.log("Saving Data as Hash:", hash);

creategame(hash);
