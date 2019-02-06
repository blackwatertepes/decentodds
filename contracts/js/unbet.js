const dotenv = require('dotenv').config();
const { api } = require('./base');

const { CONTRACT_OWNER } = process.env;

if (process.argv.length < 4) {
  console.log("Required Args: actor, data.key")
  process.exit()
}

(async () => {
  const result = await api.transact({
    actions: [{
      account: CONTRACT_OWNER,
      name: 'unbet',
      authorization: [{
        actor: process.argv[2],
        permission: 'active',
      }],
      data: {
        key: process.argv[3],
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
