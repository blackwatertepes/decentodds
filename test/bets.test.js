const ecc = require('eosjs-ecc')
const { betFactory } = require('./factories');
const {
  myBets,
  acceptedBets,
  unacceptedBets,
  roundBets,
  potBets,
  revealedBets,
  unrevealedBets,
  hashSecret,
 } = require('../src/helpers/bets');

describe('bets', function() {
  const round = 10;
  const gamekey = 2;
  const playerA = 'playera';
  const playerB = 'playerb';

  const myOpenBet = betFactory({ gamekey, round, better: playerA });
  const myAcceptedBet = betFactory({ gamekey, round, better: playerA, accepted: 1 });
  const myRevealedBet = betFactory({ gamekey, round, better: playerA, accepted: 1, secret: 1 });
  const otherOpenBet = betFactory({ gamekey, round, better: playerB });
  const myNextRoundBet = betFactory({ gamekey, round: round + 1, better: playerA });
  const bets = [myOpenBet, myAcceptedBet, myRevealedBet, otherOpenBet, myNextRoundBet];

  describe('myBets', function() {
    it('returns bets from better', () => {
      expect(myBets(bets, playerA)).toEqual([myOpenBet, myAcceptedBet, myRevealedBet, myNextRoundBet]);
    });
  });

  describe('acceptedBets', function() {
    it('returns accepted bets', () => {
      expect(acceptedBets(bets)).toEqual([myAcceptedBet, myRevealedBet]);
    });
  });

  describe('unacceptedBets', function() {
    it('returns unaccepted bets', () => {
      expect(unacceptedBets(bets)).toEqual([myOpenBet, otherOpenBet, myNextRoundBet]);
    });
  });

  describe('roundBets', function() {
    it('returns round bets', () => {
      expect(roundBets(bets, round)).toEqual([myOpenBet, myAcceptedBet, myRevealedBet, otherOpenBet]);
    });
  });

  describe('potBets', function() {
    it('returns accepted/round bets', () => {
      expect(potBets(bets, round)).toEqual([myAcceptedBet, myRevealedBet]);
    });
  });

  describe('revealedBets', function() {
    it('returns revealed bets', () => {
      expect(revealedBets(bets)).toEqual([myRevealedBet]);
    });
  });

  describe('unrevealedBets', function() {
    it('returns unrevealed bets', () => {
      expect(unrevealedBets(bets)).toEqual([myOpenBet, myAcceptedBet, otherOpenBet, myNextRoundBet]);
    });
  });

  describe('hashSecret', function() {
    it('hashes the secret with the player name', () => {
      const num = 123;
      const name = 'PLAYER';
      expect(hashSecret(num, name)).toEqual(ecc.sha256(`${num}:${name}`));
    });
  });
});
