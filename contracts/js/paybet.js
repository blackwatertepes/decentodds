const dotenv = require('dotenv').config();
const { api } = require('./base');

const { ACTOR } = process.env;

(async () => {
  const result = await api.transact({
    actions: [{
      account: ACTOR,
      name: 'paybet',
      authorization: [{
        actor: process.argv[2],
        permission: 'active',
      }],
      data: {
        key: process.argv[3],
        amount: `${process.argv[4]} EOS`
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
