export function getCardAtPos(position) {
  const SUITS = ['spade', 'heart', 'club', 'diamond']
  const suit = SUITS[Math.floor(position % 52 / 13)]
  const num = position % 13 + 1 // 1 - 13
  const value = Math.min(position % 13 + 1, 10) // [1,2..9,10,10,10,10]
  const values = [value];
  if (value == 1) { values.push(11) } // Aces can be 1 || 11
  const rank = (num == 1) ? 14 : num;
  return { num, rank, suit, values }
}

export function getCardPositionForPlayer(rand, player = 0) {
  return Math.floor(rand / (52**player)) % 52;
}

export function getCardForPlayer(rand, player = 0) {
  const position = getCardPositionForPlayer(rand, player);
  return getCardAtPos(position);
}

// TODO: Test
export function getCardIndex(cards, card) {
  return cards.indexOf(card);
}
