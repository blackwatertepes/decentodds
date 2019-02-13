require = require("esm")(module/*, options*/)

const { fetchBets, myBets, acceptedBets, unacceptedBets, roundBets, potBets, revealedBets, unrevealedBets,
  refreshBet, hashSecret } = require('../src/helpers/bets')
const { getAssetAmount } = require('../src/helpers/eos')
const { validBet, xorBets, getCards } = require('../src/helpers/players')
const { getWinningCard } = require('../src/games/hi-low')

const bets = [ { key: 0,
    hash:
     'edbb95d34d8268b70bf297524dbe7e9e0f61eb116a9375de4ed2619e24dc305d',
    better: 'decentoddsaa',
    gamekey: 0,
    round: 2,
    wager: '1.000 EOS',
    deposit: '0.0000 EOS',
    accepted: 1,
    requestedPayout: '0 ',
    secret: '234730090579321',
    createdAt: '1549866300500000' },
  { key: 1,
    hash:
     '61664d4979c9c5336b5c13ffd3aa9bfee566afafc55c56b26d626a6ebbc8e37b',
    better: 'decentoddsab',
    gamekey: 0,
    round: 2,
    wager: '1 EOS',
    deposit: '0.0000 EOS',
    accepted: 1,
    requestedPayout: '0 ',
    secret: '1465883754658619',
    createdAt: '1549866302500000' },
  { key: 2,
    hash:
     '61664d4979c9c5336b5c13ffd3aa9bfee566afafc55c56b26d626a6ebbc8e37b',
    better: 'decentoddsab',
    gamekey: 0,
    round: 2,
    wager: '1 EOS',
    deposit: '0.0000 EOS',
    accepted: 1,
    requestedPayout: '0 ',
    secret: '1465883754658619',
    createdAt: '1549866302500000' },
  { key: 3,
    hash:
     '61664d4979c9c5336b5c13ffd3aa9bfee566afafc55c56b26d626a6ebbc8e37b',
    better: 'decentoddsab',
    gamekey: 0,
    round: 2,
    wager: '1 EOS',
    deposit: '0.0000 EOS',
    accepted: 1,
    requestedPayout: '0 ',
    secret: '1465883754658619',
    createdAt: '1549866302500000' },
  { key: 4,
    hash:
     '61664d4979c9c5336b5c13ffd3aa9bfee566afafc55c56b26d626a6ebbc8e37b',
    better: 'decentoddsab',
    gamekey: 0,
    round: 2,
    wager: '1 EOS',
    deposit: '0.0000 EOS',
    accepted: 1,
    requestedPayout: '0 ',
    secret: '1465883754658619',
    createdAt: '1549866302500000' },
  { key: 5,
    hash:
     '61664d4979c9c5336b5c13ffd3aa9bfee566afafc55c56b26d626a6ebbc8e37b',
    better: 'decentoddsab',
    gamekey: 0,
    round: 2,
    wager: '1 EOS',
    deposit: '0.0000 EOS',
    accepted: 1,
    requestedPayout: '0 ',
    secret: '1465883754658619',
    createdAt: '1549866302500000' } ];


// Validate each secret against the hash
for (let bet of bets) {
  if (!validBet(bet)) {
    console.log("LIAR FOUND! Bet:", bet)
    // TODO: Pay 0
    // TODO Update player stats
  }
}

// Find the card for each player...
const cards = getCards(bets)
console.log(cards);
const winningCard = getWinningCard(cards)
console.log("Winner Card:", winningCard)

// TODO: Pay the winner
