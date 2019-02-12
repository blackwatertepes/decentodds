export function getWinningCard(cards) {
  cards.sort((a, b) => {
    return b.rank - a.rank;
  });
  if (cards.length > 1 && cards[0].rank == cards[1].rank) {
    return null;
  }
  return cards[0];
}
