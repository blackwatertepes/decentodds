export function getWinningCard(card_a, card_b) {
  // Hi Card
  // INFO: Highest number wins
  if (card_a.rank == card_b.rank) {
    return null
  } else if (card_a.rank > card_b.rank) {
    return card_a
  } else {
    return card_b
  }
}
