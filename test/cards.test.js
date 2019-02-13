const { getCardAtPos, getCardPositionForPlayer, getCardForPlayer, getCardIndex } = require('../src/helpers/cards');
const { cardFactory } = require('./factories');

describe('cards', function() {
  describe('getCardAtPos', function() {
    it('returns the correct card', () => {
      expect(getCardAtPos(0)).toEqual({ rank: 14, suit: 'spade' });
      expect(getCardAtPos(13)).toEqual({ rank: 14, suit: 'heart' });
      expect(getCardAtPos(26)).toEqual({ rank: 14, suit: 'club' });
      expect(getCardAtPos(39)).toEqual({ rank: 14, suit: 'diamond' });
    });

    it('returns the correct val', () => {
      expect(getCardAtPos(0)).toEqual({ rank: 14, suit: 'spade' });
      expect(getCardAtPos(10)).toEqual({ rank: 11, suit: 'spade' });
      expect(getCardAtPos(12)).toEqual({ rank: 13, suit: 'spade' });
    });

    it('returns correct card for large values', () => {
      expect(getCardAtPos(52**8)).toEqual({ rank: 14, suit: 'spade' });
      expect(getCardAtPos(52**9)).toEqual({ rank: 14, suit: 'spade' });
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
      expect(getCardForPlayer(123, 0)).toEqual({ rank: 7, suit: 'heart' });
      expect(getCardForPlayer(123, 1)).toEqual({ rank: 3, suit: 'spade' });
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
