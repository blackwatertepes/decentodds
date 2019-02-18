function valueOfCard(card) {
  return card.rank == 1 ? 14 : card.rank;
}

export function getWinningCard(cards) {
  cards.sort((a, b) => {
    return valueOfCard(b) - valueOfCard(a);
  });
  if (cards.length > 1 && cards[0].rank == cards[1].rank) {
    return null;
  }
  return cards[0];
}
