const dotenv = require('dotenv').config();
const { api } = require('./base');

const { ACTOR } = process.env;

(async () => {
  const result = await api.transact({
    actions: [{
      account: ACTOR,
      name: 'blowupgame',
      authorization: [{
        actor: ACTOR,
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
