const dotenv = require('dotenv').config();
const { api, eosjs, rpc } = require('./base');

const { ACTOR } = process.env;

(async () => {
  const bets = await rpc.get_table_rows({
    code: 'decentoddsaz',
    scope: 'decentoddsaz',
    table: 'bets',
    table_key: 'hash',
    index_position: 2,
    key_type: 'uint64_t'
  });
  console.log(bets.rows);
})();
