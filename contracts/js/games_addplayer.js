const dotenv = require('dotenv').config();
const { api } = require('./base');

const { ACTOR } = process.env;

(async () => {
  const result = await api.transact({
    actions: [{
      account: ACTOR,
      name: 'addplayer',
      authorization: [{
        actor: ACTOR,
        permission: 'active',
      }],
      data: {
        gameId: 0,
        playerAccountName: 'blackwaterte'
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
