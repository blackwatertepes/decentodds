module.exports = function(card) {
  return {
    suit: 0,
    suitName: 'spade',
    rank: 1,
    rankName: 'ace',
    position: 0,
    ...card
  }
}
