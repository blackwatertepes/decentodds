const dotenv = require('dotenv').config();
const { api } = require('./base');

const { ACTOR } = process.env;

(async () => {
  const result = await api.transact({
    actions: [{
      account: ACTOR,
      name: 'delplayers',
      authorization: [{
        actor: ACTOR,
        permission: 'active',
      }],
      data: {
        gameId: process.argv[2],
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
