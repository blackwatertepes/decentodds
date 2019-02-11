const dotenv = require('dotenv').config()
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

const { PLAYER_A:PLAYER_NAME } = process.env; // The account name of the player
const GAMEKEY = 0; // The Game to play
const WAGER = '1.000'; // The amount to wager on each bet

export function runPlayer() {
  let secrets = []; // TODO: Store on disk

  setInterval(async () => {
    //console.log(`Player ${PLAYER_NAME} thinking...`);
    let bets = await fetchBets();
    let mybets = myBets(bets, PLAYER_NAME);
    let myacceptedbets = acceptedBets(mybets);
    let myrevealedbets = revealedBets(myacceptedbets);

    // Place a bet...
    if (!mybets.length > 0) {
      const secret = getRandom();
      secrets.unshift(secret);
      const hash = hashSecret(secret, PLAYER_NAME);
      console.log("Player: Placing bet...");
      await placebet(PLAYER_NAME, hash, GAMEKEY, WAGER);
      console.log("Player: Bet placed.");
    }

    // Reveal a bet...
    if (myacceptedbets.length > 0) {
      for (let bet of myacceptedbets) {
        if (!bet.secret) {
          const secret = secrets.find((num) => {
            return hashSecret(num, PLAYER_NAME) == bet.hash;
          })
          console.log("Player: Revealing bet...");
          await reveal(PLAYER_NAME, bet.key, secret);
          console.log("Player: Bet revealed:", secret);
        }
      }
    }

    // Show outcome...
    if (myrevealedbets.length > 0) {
      for (let bet of myrevealedbets) {
        const potbets = potBets(bets, bet.round);
        const revealedpotbets = revealedBets(potbets);
        if (potbets.length == revealedpotbets.length) {
          console.log("Player: All bets revealed!");
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
          console.log("Player: Revealed bets in round:", revealedpotbets.length, "of", potbets.length);
        }
      }
    }
  }, 8000)
}
