const dotenv = require('dotenv').config()
const { getAssetAmount } = require('../src/helpers/eos')

const { CONTRACT_OWNER } = process.env
const GAMEKEY = 0

export function runBetter() {
  const secrets = {} // TODO: Save sercets to disk

  setInterval(async () => {
    console.log("Better thining...");
    return;
    const bets = await fetchBets()
    for (let bet of bets) {
      const { accepted, key, wager } = bet

      // Check for open bets...
      const wageredAmount = getAssetAmount(wager)
      if (accepted == 0
        && wageredAmount > 0 // Not worth our time
        && wageredAmount < 10 // Too risky
        && !secrets[key]) {
        console.log("Open Bet:", bet)
        await placebet(bet);
      }

      // Check for revealved bets...
      if (accepted == 1
        && secrets[key]) {
        console.log("Revealed Bet:", bet)
      }
    }
  }, 500)
}
