const dotenv = require('dotenv').config();
const { creategame, getgames, deletegame, bet, getbets, paybet, unbet } = require('../src/helpers/actions');
const ecc = require('eosjs-ecc');

const { CONTRACT_OWNER } = process.env;

const hash = ecc.sha256('foo');

(async () => {
  console.log("Creating game...");
  await creategame(hash);
  const games = await getgames();
  const game = games.rows[games.rows.length - 1];
  console.log("Game:", game);

  console.log("Betting...");
  await bet(CONTRACT_OWNER, hash, game.key, '1.0000');
  const bets = await getbets();
  const _bet = bets.rows[bets.rows.length - 1];
  console.log("Bet:", _bet);

  console.log("Unbetting...");
  await unbet(CONTRACT_OWNER, _bet.key);

  console.log("Deleting game...");
  await deletegame(game.key);

  console.log("Done.");
  process.exit();
})();
