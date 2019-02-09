const { getCardAtPos } = require('../src/helpers/cards');

describe('cards', function() {
  describe('getCardAtPos', function() {
    it('returns the correct suits', () => {
      expect(getCardAtPos(0)).toEqual({ num: 1, suit: 'spade', val: 1 });
      expect(getCardAtPos(13)).toEqual({ num: 1, suit: 'heart', val: 1 });
      expect(getCardAtPos(26)).toEqual({ num: 1, suit: 'club', val: 1 });
      expect(getCardAtPos(39)).toEqual({ num: 1, suit: 'diamond', val: 1 });
    });

    it('returns the correct val', () => {
      expect(getCardAtPos(0)).toEqual({ num: 1, suit: 'spade', val: 1 });
      expect(getCardAtPos(10)).toEqual({ num: 11, suit: 'spade', val: 10 });
      expect(getCardAtPos(12)).toEqual({ num: 13, suit: 'spade', val: 10 });
    });

    it('returns correct for large values', () => {
      expect(getCardAtPos(52**8)).toEqual({ num: 1, suit: 'spade', val: 1 });
      expect(getCardAtPos(52**9)).toEqual({ num: 1, suit: 'spade', val: 1 });
    });
  });
});
