const { getCardForPlayer } = require('./cards')
const { getAssetAmount } = require('./eos')
const { xorBets } = require('./bets')

// INFO: Sharable methods for the outcome of games

// NOTE: Calculates the cards for each player...
// TODO: Test
function getCards(bets) {
  let rand = Math.abs(xorBets(bets))
  console.log("Rand:", rand)
  return bets.map((bet, idx) => { return getCardForPlayer(rand, idx) })
}

// TODO: Test
function getPotAmount(bets) {
  if (validbets.length == 1) {
    return getAssetAmount(validbets[0].wager);
  } else {
    return validbets.reduce((acc, bet) => { return getAssetAmount(bet.wager) + getAssetAmount(acc.wager) })
  }
}

module.exports = {
  getCards,
  getPotAmount
}
