const dotenv = require('dotenv').config();
const { api } = require('./base');

const { ACTOR } = process.env;

(async () => {
  const result = await api.transact({
    actions: [{
      account: ACTOR,
      name: 'updatescore',
      authorization: [{
        actor: ACTOR,
        permission: 'active',
      }],
      data: {
        playerId: process.argv[2],
        score: process.argv[3]
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
