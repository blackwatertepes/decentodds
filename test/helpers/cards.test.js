const { getCardAtPos, getCardPositionForPlayer, getCardForPlayer, getCardIndex } = require('../../src/helpers/cards');
const { cardFactory } = require('../factories');

describe('cards', function() {
  describe('getCardAtPos', function() {
    it('returns the correct card', () => {
      expect(getCardAtPos(0)).toEqual(expect.objectContaining({ rank: 1, rankName: 'ace', suit: 0, suitName: 'spade', position: 0 }));
      expect(getCardAtPos(13)).toEqual(expect.objectContaining({ rank: 1, suit: 1, suitName: 'heart' }));
      expect(getCardAtPos(26)).toEqual(expect.objectContaining({ rank: 1, suit: 2, suitName: 'club' }));
      expect(getCardAtPos(39)).toEqual(expect.objectContaining({ rank: 1, suit: 3, suitName: 'diamond' }));
    });

    it('returns the correct val', () => {
      expect(getCardAtPos(0)).toEqual(expect.objectContaining({ rank: 1, suit: 0 }));
      expect(getCardAtPos(10)).toEqual(expect.objectContaining({ rank: 11, suit: 0 }));
      expect(getCardAtPos(12)).toEqual(expect.objectContaining({ rank: 13, suit: 0 }));
    });

    it('returns correct card for large values', () => {
      expect(getCardAtPos(52**8)).toEqual(expect.objectContaining({ rank: 1, suit: 0 }));
      expect(getCardAtPos(52**9)).toEqual(expect.objectContaining({ rank: 1, suit: 0 }));
    });
  });

  describe('getCardPositionForPlayer', () => {
    it('returns', () => {
      expect(getCardPositionForPlayer(123, 0)).toEqual(19);
      expect(getCardPositionForPlayer(123, 1)).toEqual(2);
    });
  });

  describe('getCardForPlayer', () => {
    it('returns', () => {
      expect(getCardForPlayer(123, 0)).toEqual(expect.objectContaining({ rank: 7, suit: 1 }));
      expect(getCardForPlayer(123, 1)).toEqual(expect.objectContaining({ rank: 3, suit: 0 }));
    });
  });

  describe('getCardIndex', () => {
    let two = cardFactory({ rank: 2 });
    let four = cardFactory({ rank: 4 });
    let six = cardFactory({ rank: 6 });
    let cards = [two, four, six];

    it('returns', () => {
      expect(getCardIndex(cards, two)).toEqual(0);
      expect(getCardIndex(cards, four)).toEqual(1);
      expect(getCardIndex(cards, six)).toEqual(2);
    });
  });
});
