const dotenv = require('dotenv').config();
const { api } = require('./base');

const { ACTOR } = process.env;

(async () => {
  const result = await api.transact({
    actions: [{
      account: ACTOR,
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
