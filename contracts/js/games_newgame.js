const dotenv = require('dotenv').config();
const { api } = require('./base');

const { ACTOR } = process.env;

(async () => {
  const result = await api.transact({
    actions: [{
      account: ACTOR,
      name: 'newgame',
      authorization: [{
        actor: ACTOR,
        permission: 'active',
      }],
      data: {},
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
