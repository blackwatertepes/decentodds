module.exports = function(card) {
  return {
    suit: 'spade',
    num: 1,
    values: [1,11],
    rank: 14,
    ...card
  }
}
