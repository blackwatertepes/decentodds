const dotenv = require('dotenv').config();
const { api } = require('./base');

const { ACTOR } = process.env;

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
        hash: process.argv[3]
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
