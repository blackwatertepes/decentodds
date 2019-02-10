const dotenv = require('dotenv').config();
const { api } = require('../src/helpers/eos');
const ecc = require('eosjs-ecc');

const { CONTRACT_OWNER } = process.env;

if (process.argv.length < 5) {
  console.log("Required Args: actor/data.better, data.hash, data.gamekey")
  process.exit()
}

const hash = ecc.sha256(process.argv[3]);
console.log("Saving Data as Hash:", hash);

(async () => {
  const result = await api.transact({
    actions: [{
      account: CONTRACT_OWNER,
      name: 'bet',
      authorization: [{
        actor: process.argv[2],
        permission: 'active',
      }],
      data: {
        hash: ecc.sha256(process.argv[3]),
        gamekey: process.argv[4],
        better: process.argv[2],
        wager: '0.0000 EOS',
        deposit: '0.0000 EOS'
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
