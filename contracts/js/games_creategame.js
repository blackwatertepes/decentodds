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
        s: 'decentoddsaz',
        ipfsHash: 'asdf',
        accountName: 'decentoddsaz'
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
