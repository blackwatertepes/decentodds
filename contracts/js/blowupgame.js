const dotenv = require('dotenv').config();
const { api } = require('./base');

const { CONTRACT_OWNER } = process.env;

if (process.argv.length < 3) {
  console.log("Required Args: actor, data.key")
  process.exit()
}

(async () => {
  const result = await api.transact({
    actions: [{
      account: CONTRACT_OWNER,
      name: 'blowupgame',
      authorization: [{
        actor: CONTRACT_OWNER,
        permission: 'active',
      }],
      data: {
        key: process.argv[2],
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
