const dotenv = require('dotenv').config();
const { api, eosjs, rpc } = require('./base');

(async () => {
  const bets = await rpc.get_table_rows({
    code: 'decentoddsaz',
    scope: 'decentoddsaz',
    table: 'bets',
  });
  console.log(bets.rows);
})();
