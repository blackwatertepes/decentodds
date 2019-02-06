const dotenv = require('dotenv').config();
const { api, eosjs, rpc } = require('./base');

(async () => {
  const game = await rpc.get_table_rows({code: 'decentoddsaz', scope: 'decentoddsaz', table: 'games'});
  console.log(game.rows);
})();
