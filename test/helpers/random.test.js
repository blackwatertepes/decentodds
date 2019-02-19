const { getRandom, xor } = require('../../src/helpers/random');

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

  describe('xor', () => {
    it('returns', () => {
      const nums = [111, 222, 333];
      expect(xor(nums)).toEqual(333 ^ 222 ^ 111);
    });
  });
});
