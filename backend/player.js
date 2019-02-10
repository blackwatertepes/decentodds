const dotenv = require('dotenv').config()
const { getRandom } = require('../src/helpers/random');
const {
  fetchBets,
  myBets,
  acceptedBets,
  roundBets,
  potBets,
  revealedBets,
  refreshBet,
  hashSecret } = require('../src/helpers/bets');

const { CONTRACT_OWNER:PLAYER_NAME } = process.env
const GAMEKEY = 0
const WAGER = '1.000';

export function runPlayer() {
  let openbet;
  let secret;

  setInterval(async () => {
    console.log(`Player ${PLAYER_NAME} thinking...`);
    return;
    let bets = await fetchBets();
    // Place a bet...
    if (!opebet) {
      openbet = {};
      secret = getRandom();
      const hash = hashSecret(secret, PLAYER_NAME);
      console.log("Placing bet...");
      await bet(PLAYER_NAME, hash, GAMEKEY, WAGER);
      let myBets = myBets(bets);
      openbet = bets[myBets.length - 1];
      console.log("Bet placed:", openbet);
    }

    // Reveal a bet...
    // Wait for payout...
    if (openbet) {
      openbet = await refreshBet(openbet);
      if (openbet) {
        if (openbet.accepted) {
          if (!opebet.secret) {
            console.log("Revealing bet...");
            await reveal(PLAYER_NAME, openbet.key, secret);
            console.log("Bet revealed:", secret);
          }
          // Find other bets in the pot...
          let potbets = potBets(bets, openbet.round);
          if (potbets.length > 1) {
            console.log("Bets in round:", potbets.length);
            let revealed = revealedBets(potbets);
            if (revealed.length == potbets.length) {
              console.log("All bets revealed!");
              // Check all secrets...
              for (bet of potbets) {
                let hash = hashSecret(bet.secret, bet.better);
                if (hash !== bet.hash) {
                  console.log("LIAR FOUND! Bet:", bet);
                }
              }
              // Calculate cards...
            }
          }
        }
      } else {
        openbet = null;
        secret = null;
      }
    }
  }, 600)
}
