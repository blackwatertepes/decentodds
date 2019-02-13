const { getCardForPlayer } = require('./cards')
const { xorBets } = require('./bets')

// INFO: Sharable methods for the outcome of games

// NOTE: Calculates the cards for each player...
// TODO: Test
function getCards(bets) {
  let rand = Math.abs(xorBets(bets))
  console.log("Rand:", rand)
  return bets.map((bet, idx) => { return getCardForPlayer(rand, idx) })
}

module.exports = {
  getCards
}
