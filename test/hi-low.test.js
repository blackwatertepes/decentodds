const { cardFactory } = require('./factories');
const { getCardAtPos } = require('../src/helpers/cards');
const { getWinningCard } = require('../src/games/hi-low');

describe('hi-low', function() {
  describe('getWinningCard', function() {
    it('returns the winner', () => {
      const two = cardFactory(getCardAtPos(1));
      const ten = cardFactory(getCardAtPos(9));
      const winner = getWinningCard(two, ten);
      expect(winner).toEqual(ten);
    });

    it('returns the winner (with an ace)', () => {
      const jack = cardFactory(getCardAtPos(10));
      const ace = cardFactory(getCardAtPos(0));
      const winner = getWinningCard(ace, jack);
      expect(winner).toEqual(ace);
    });

    it('returns the winner (with face cards)', () => {
      const jack = cardFactory(getCardAtPos(10));
      const queen = cardFactory(getCardAtPos(11));
      const winner = getWinningCard(jack, queen);
      expect(winner).toEqual(queen);
    });

    it('returns null (when tied)', () => {
      const jack_a = cardFactory(getCardAtPos(10));
      const jack_b = cardFactory(getCardAtPos(10));
      const winner = getWinningCard(jack_a, jack_b);
      expect(winner).toEqual(null);
    });
  });
});
