const { cardFactory } = require('./factories');
const { getCardAtPos } = require('../src/helpers/cards');
const { getWinningCard } = require('../src/games/hi-low');

describe('hi-low', function() {
  describe('getWinningCard', function() {
    it('returns the winner', () => {
      const two = cardFactory(getCardAtPos(1));
      const ten = cardFactory(getCardAtPos(9));
      const nine = cardFactory(getCardAtPos(8));
      const winner = getWinningCard([two, ten, nine]);
      expect(winner).toEqual(ten);
    });

    it('returns the winner (with an ace)', () => {
      const jack = cardFactory(getCardAtPos(10));
      const ace = cardFactory(getCardAtPos(0));
      const king = cardFactory(getCardAtPos(12));
      const winner = getWinningCard([ace, jack, king]);
      expect(winner).toEqual(ace);
    });

    it('returns the winner (with face cards)', () => {
      const jack = cardFactory(getCardAtPos(10));
      const queen = cardFactory(getCardAtPos(11));
      const king = cardFactory(getCardAtPos(12));
      const winner = getWinningCard([jack, queen, king]);
      expect(winner).toEqual(king);
    });

    it('returns null (when tied)', () => {
      const ten = cardFactory(getCardAtPos(9));
      const jack_a = cardFactory(getCardAtPos(10));
      const jack_b = cardFactory(getCardAtPos(10));
      const winner = getWinningCard([ten, jack_a, jack_b]);
      expect(winner).toEqual(null);
    });

    it('returns winner (when losers tied)', () => {
      const jack_a = cardFactory(getCardAtPos(10));
      const jack_b = cardFactory(getCardAtPos(10));
      const queen = cardFactory(getCardAtPos(11));
      const winner = getWinningCard([jack_a, jack_b, queen]);
      expect(winner).toEqual(queen);
    });
  });
});
