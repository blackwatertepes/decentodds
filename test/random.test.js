const { getRandom } = require('../src/helpers/random');

describe('random', function() {
  describe('getRandom', function() {
    it('has a minimum', () => {
      Math.random = jest.fn().mockReturnValue(0);
      expect(getRandom()).toEqual(52**8);
    });

    it('has a maximum', () => {
      Math.random = jest.fn().mockReturnValue(1);
      expect(getRandom()).toEqual(52**9);
    });
  });
});
