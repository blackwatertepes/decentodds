const dotenv = require('dotenv').config();
const { api, eosjs, rpc } = require('./base');

const { ACTOR } = process.env;

(async () => {
  const game = await rpc.get_table_rows({code: 'blackwaterte', scope: 'blackwaterte', table: 'game'});
  console.log(game.rows);
  const player = await rpc.get_table_rows({
    code: 'blackwaterte',
    scope: 'blackwaterte',
    table: 'player',
    table_key: 'accountName',
    lower_bound: 10,
    //lower_bound: 4344997758769687200,
    lower_bound: "blackwaterte",
    index_position: 3,
    key_type: "name",
    //limit: 1,
  });
  console.log(player.rows);
})();
