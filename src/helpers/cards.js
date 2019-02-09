export function getCardAtPos(position) {
  const SUITS = ['spade', 'heart', 'club', 'diamond']
  const val = Math.min(position % 13 + 1, 10) // Face cards are still worth 10
  const num = position % 13 + 1 // Help determine face card
  const suit = SUITS[Math.floor(position % 52 / 13)]
  return { num, suit, val }
}
