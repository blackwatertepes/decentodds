const dotenv = require('dotenv').config();
const { api, eosjs, rpc } = require('../base');
const ecc = require('eosjs-ecc');

const { CONTRACT_OWNER } = process.env;

(async () => {
  // Check for revealed bets...
  const bets = await rpc.get_table_rows({
    code: 'decentoddsaz',
    scope: 'decentoddsaz',
    table: 'bets',
  });
  //console.log(bets.rows);

  for (let bet of bets.rows) {
    const { accepted, key:betKey, secret, wager } = bet;
    const wageredAmount = parseFloat(wager.split(' ')[0]);
    if (accepted == 1) {
      console.log("Revealed Bet:", bet);
      // Reveal our own bet...
      const random = Math.random() * Number.MAX_SAFE_INTEGER
      const action_reveal = {
        account: CONTRACT_OWNER,
        name: 'reveal',
        authorization: [{
          actor: CONTRACT_OWNER,
          permission: 'active',
        }],
        data: {
          key: betKey,
          secret: ecc.sha256('COMING SOON')
        }
      };
      // Pay to the winner...
      const action_pay = {
        account: CONTRACT_OWNER,
        name: 'paybet',
        authorization: [{
          actor: CONTRACT_OWNER,
          permission: 'active',
        }],
        data: {
          key: betKey,
          amount: `1 EOS`
        }
      };
      const result = await api.transact({
        actions: [action_pay]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
    }
  }
})();
