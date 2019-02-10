const dotenv = require('dotenv').config();
const { creategame, getgames, advanceround, deletegame, bet, getbets, acceptbet, reveal, paybet, unbet } = require('../src/helpers/actions');
const ecc = require('eosjs-ecc');

const { CONTRACT_OWNER } = process.env;

const gamehash = ecc.sha256('foo');
const secret = Math.floor(Math.random() * 52**9);
const secrethash = ecc.sha256(`${secret}`);

(async () => {
  console.log("Creating game...");
  await creategame(gamehash);
  const games = await getgames();
  const game = games.rows[games.rows.length - 1];
  console.log("Game:", game);

  console.log("Betting...");
  await bet(CONTRACT_OWNER, secrethash, game.key, '1.0000');
  let bets = await getbets();
  let _bet = bets.rows[bets.rows.length - 1];
  console.log("Bet:", _bet);

  console.log("Unbetting...");
  await unbet(CONTRACT_OWNER, _bet.key);

  console.log("Betting...");
  await bet(CONTRACT_OWNER, secrethash, game.key, '1.0000');
  bets = await getbets();
  _bet = bets.rows[bets.rows.length - 1];
  console.log("Bet:", _bet);

  console.log("Accepting bet...");
  await acceptbet(_bet.key);

  console.log("Advancing round...");
  await advanceround(game.key);

  console.log("Revealing secret...");
  await reveal(CONTRACT_OWNER, _bet.key, secret);

  console.log("Paying bet...");
  await paybet(_bet.key, '1.0000');

  console.log("Deleting game...");
  await deletegame(game.key);

  console.log("Done.");
  process.exit();
})();
