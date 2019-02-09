const { rpc } = require('../src/helpers/eos');

(async () => {
  const bets = await rpc.get_table_rows({
    code: 'decentoddsaz',
    scope: 'decentoddsaz',
    table: 'bets',
  });
  console.log(bets.rows);
})();
