function getWinningCard(card_a, card_b) {
  // Hi Card
  // INFO: Highest number wins
  if (card_a.val == card_b.val) {
    return null
  } else if (card_a.val > card_b.val) {
    return card_a
  } else {
    return card_b
  }
}
