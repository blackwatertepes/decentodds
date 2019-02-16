const dotenv = require('dotenv').config()
const { getAssetAmount } = require('../src/helpers/eos')
const { getRandom } = require('../src/helpers/random');
const { fetchBets, myBets, acceptedBets, unacceptedBets, roundBets, potBets, revealedBets, unrevealedBets,
  refreshBet, hashSecret, validBet, xorBets } = require('../src/helpers/bets');
const { bet:placebet, reveal } = require('../src/helpers/actions');
const { getCards } = require('../src/helpers/players')
const { getWinningCard } = require('../src/games/hi-low')

const { PLAYER_B:PLAYER_NAME } = process.env
const GAMEKEY = 0

const secrets = {} // TODO: Save sercets to disk

async function revealBets(mybets, secrets) {
  let myacceptedbets = unrevealedBets(acceptedBets(mybets));
  for (let bet of myacceptedbets) {
    // TODO: Make sure the round has advanced
    const secret = secrets[bet.round];
    console.log("Better: Revealing secret...");
    await reveal(PLAYER_NAME, bet.key, secret);
    console.log("Better: Secret revealed:", secret);
    // TODO: Delete bet
  }
}

async function placeBets(bets, secrets) {
  let openbets = unacceptedBets(bets);

  for (let bet of openbets) {
    const { accepted, better, key, wager } = bet
    const wageredAmount = getAssetAmount(wager)
    const roundbets = roundBets(bets, bet.round);
    if (wageredAmount > 0 // Not worth our time
      && wageredAmount < 10 // Too risky
      && roundbets.length == 1 // No one else has bet in this round
      && !secrets[bet.round]) { // I have not yet bet in this round
        // TODO: Make sure the round is still active, on the game object
      //console.log("Open Bet:", bet)
      const secret = getRandom();
      secrets[bet.round] = secret;
      const hash = hashSecret(secret, PLAYER_NAME);
      console.log("Better: Placing bet...");
      await placebet(PLAYER_NAME, hash, GAMEKEY, wageredAmount);
      console.log("Better: Bet placed.");
    }
  }
}

export function runBetter(interval = 2000) {
  setInterval(async () => {
    //console.log("Better thining...");
    let bets = await fetchBets();
    let mybets = myBets(bets, PLAYER_NAME);

    placeBets(bets, secrets);
    revealBets(mybets);

    // TODO: Show game outcome...
  }, interval)
}
