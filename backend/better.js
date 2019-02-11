const dotenv = require('dotenv').config()
const { getAssetAmount } = require('../src/helpers/eos')
const { getRandom } = require('../src/helpers/random');
const {
  fetchBets,
  myBets,
  acceptedBets,
  unacceptedBets,
  roundBets,
  potBets,
  revealedBets,
  unrevealedBets,
  refreshBet,
  hashSecret } = require('../src/helpers/bets');
const { bet:placebet, reveal } = require('../src/helpers/actions');

const { PLAYER_B:PLAYER_NAME } = process.env
const GAMEKEY = 0

export function runBetter() {
  const secrets = {} // TODO: Save sercets to disk

  setInterval(async () => {
    //console.log("Better thining...");
    let bets = await fetchBets();
    let mybets = myBets(bets, PLAYER_NAME);
    let myacceptedbets = acceptedBets(mybets);
    let myrevealedbets = revealedBets(myacceptedbets);

    // Check for open bets...
    for (let bet of bets) {
      const { accepted, better, key, wager } = bet
      const wageredAmount = getAssetAmount(wager)
      const roundbets = roundBets(bets, bet.round);
      if (accepted == 0
        && wageredAmount > 0 // Not worth our time
        && wageredAmount < 10 // Too risky
        && roundbets.length >= 1 // No one else has bet in this round
        && !secrets[bet.round]) { // I have not yet bet in this round
        //console.log("Open Bet:", bet)
        const secret = getRandom();
        secrets[bet.round] = secret;
        const hash = hashSecret(secret, PLAYER_NAME);
        console.log("Better: Placing bet...");
        await placebet(PLAYER_NAME, hash, GAMEKEY, wageredAmount);
        console.log("Better: Bet placed.");
      }
    }

    // Reveal a bet...
    if (myacceptedbets.length > 0) {
      for (let bet of myacceptedbets) {
        if (!bet.secret) {
          const secret = secrets[bet.round];
          console.log("Better: Revealing bet...");
          await reveal(PLAYER_NAME, bet.key, secret);
          console.log("Better: Bet revealed:", secret);
        }
      }
    }

    // Show outcome...
    if (myrevealedbets.length > 0) {
      for (let bet of myrevealedbets) {
        const potbets = potBets(bets, bet.round);
        const revealedpotbets = revealedBets(potbets);
        if (potbets.length == revealedpotbets.length) {
          console.log("Better: All bets revealed!");
          // Check all secrets...
          /*
          for (bet of potbets) {
            let hash = hashSecret(bet.secret, bet.better);
            if (hash !== bet.hash) {
              console.log("LIAR FOUND! Bet:", bet);
            }
          }
          */
          // Calculate cards...
        } else {
          console.log("Better: Revealed bets in round:", revealedpotbets.length, "of", potbets.length);
        }
      }
    }
  }, 2000)
}
