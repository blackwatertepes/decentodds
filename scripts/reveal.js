const dotenv = require('dotenv').config();
const { api } = require('../src/helpers/eos');

const { CONTRACT_OWNER } = process.env;

if (process.argv.length < 4) {
  console.log("Required Args: actor, data.key, data.secret")
  process.exit()
}

(async () => {
  const result = await api.transact({
    actions: [{
      account: CONTRACT_OWNER,
      name: 'reveal',
      authorization: [{
        actor: process.argv[2],
        permission: 'active',
      }],
      data: {
        key: process.argv[3],
        secret: process.argv[4]
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
