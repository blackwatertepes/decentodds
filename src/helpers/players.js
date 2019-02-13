const { getWinningCard } = require('../games/hi-low')
const { getCardForPlayer } = require('./cards')
const { xor } = require('./random')
const { hashSecret } = require('./bets')

// INFO: Sharable methods for the outcome of games

// TODO: Test

// NOTE: Make sure the revealed secret matches the bet hash...
function validBet(bet) {
  return bet.hash == hashSecret(bet.secret, bet.better)
}

// NOTE: xor's the secets together...
function xorBets(bets) {
  return xor(bets.map((bet) => { return bet.secret }))
}

// NOTE: Calculates the cards for each player...
function getCards(bets) {
  let rand = Math.abs(xorBets(bets))
  console.log("Rand:", rand)
  return bets.map((bet, idx) => { return getCardForPlayer(rand, idx) })
}

module.exports = {
  validBet,
  xorBets,
  getCards
}
