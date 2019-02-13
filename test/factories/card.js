module.exports = function(card) {
  return {
    suit: 'spade',
    rank: 'ace',
    ...card
  }
}
