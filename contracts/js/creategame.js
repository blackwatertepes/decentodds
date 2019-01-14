const dotenv = require('dotenv').config();
const { api } = require('./base');
const ecc = require('eosjs-ecc');

const { ACTOR } = process.env;

const hash = ecc.sha256(process.argv[3]);
console.log("Saving Data as Hash:", hash);

(async () => {
  const result = await api.transact({
    actions: [{
      account: ACTOR,
      name: 'creategame',
      authorization: [{
        actor: process.argv[2],
        permission: 'active',
      }],
      data: {
        creator: process.argv[2],
        hash: ecc.sha256(process.argv[3])
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
