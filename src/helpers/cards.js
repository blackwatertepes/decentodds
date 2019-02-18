const SUITS = ['spade', 'heart', 'club', 'diamond']

// Retrieves the cards at index from a ordere deck of 52 cards (Ace of Spades - King of Spades, Ace of Heart...)
// NOTE: Cards only hold the suit, and rank (2's are 2, Jacks are 11, & Aces are 14)
// Games should determine how to value cards
export function getCardAtPos(position) {
  const suit = Math.floor(position % 52 / 13);
  const suitName = SUITS[suit];
  const rank = position % 13 + 1 // 1 - 13
  let rankName = rank;
  switch(rank) {
    case 1:
      rankName = 'ace'
      break;
    case 11:
      rankName = 'jack'
      break;
    case 12:
      rankName = 'queen'
      break;
    case 13:
      rankName = 'king'
      break;
  }
  return { rank, rankName, suit, suitName, position }
}

/* TODO: Use in other games (like hold'em)...
const value = Math.min(position % 13 + 1, 10) // [1,2..9,10,10,10,10]
const values = [value];
if (value == 1) { values.push(11) } // Aces can be 1 || 11
*/

// Returns the card index for a player, determined by the player index
// NOTE: A uint64 can contain a MAX of 8 random cards (52**8 < uint64)
export function getCardPositionForPlayer(rand, player = 0) {
  return Math.floor(rand / (52**player)) % 52
}

// Returns the card for a player
export function getCardForPlayer(rand, player = 0) {
  const position = getCardPositionForPlayer(rand, player);
  return getCardAtPos(position)
}

// Returns the index of a card, from an array of cards
// NOTE: Will work for cards that have additional properties
export function getCardIndex(cards, card) {
  return cards.findIndex((_card) => {
    return card.rank == _card.rank && card.suit == _card.suit
  })
}
