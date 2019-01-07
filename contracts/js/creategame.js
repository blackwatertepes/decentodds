const dotenv = require('dotenv').config();
const { api } = require('./base');

const { ACTOR } = process.env;

(async () => {
  const result = await api.transact({
    actions: [{
      account: ACTOR,
      name: 'creategame',
      authorization: [{
        actor: ACTOR,
        permission: 'active',
      }],
      data: {
        creator: 'decentoddsaz',
        hash: process.argv[2]
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
