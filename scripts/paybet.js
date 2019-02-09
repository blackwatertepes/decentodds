const dotenv = require('dotenv').config();
const { api } = require('../src/helpers/eos');

const { CONTRACT_OWNER } = process.env;

if (process.argv.length < 5) {
  console.log("Required Args: actor, data.key, data.amount")
  process.exit()
}

(async () => {
  const result = await api.transact({
    actions: [{
      account: CONTRACT_OWNER,
      name: 'paybet',
      authorization: [{
        actor: process.argv[2],
        permission: 'active',
      }],
      data: {
        key: process.argv[3],
        amount: `${process.argv[4]} EOS`
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
