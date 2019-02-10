const { getCardAtPos, getCardPositionForPlayer, getCardForPlayer } = require('../src/helpers/cards');

describe('cards', function() {
  describe('getCardAtPos', function() {
    it('returns the correct card', () => {
      expect(getCardAtPos(0)).toEqual({ num: 1, rank: 14, suit: 'spade', values: [1,11] });
      expect(getCardAtPos(13)).toEqual({ num: 1, rank: 14, suit: 'heart', values: [1,11] });
      expect(getCardAtPos(26)).toEqual({ num: 1, rank: 14, suit: 'club', values: [1,11] });
      expect(getCardAtPos(39)).toEqual({ num: 1, rank: 14, suit: 'diamond', values: [1,11] });
    });

    it('returns the correct val', () => {
      expect(getCardAtPos(0)).toEqual({ num: 1, rank: 14, suit: 'spade', values: [1,11] });
      expect(getCardAtPos(10)).toEqual({ num: 11, rank: 11, suit: 'spade', values: [10] });
      expect(getCardAtPos(12)).toEqual({ num: 13, rank: 13, suit: 'spade', values: [10] });
    });

    it('returns correct card for large values', () => {
      expect(getCardAtPos(52**8)).toEqual({ num: 1, rank: 14, suit: 'spade', values: [1,11] });
      expect(getCardAtPos(52**9)).toEqual({ num: 1, rank: 14, suit: 'spade', values: [1,11] });
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
      expect(getCardForPlayer(123, 0)).toEqual({ num: 7, rank: 7, suit: 'heart', values: [7] });
      expect(getCardForPlayer(123, 1)).toEqual({ num: 3, rank: 3, suit: 'spade', values: [3] });
    });
  });
});
