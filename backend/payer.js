require = require("esm")(module/*, options*/)

const { getAssetAmount } = require('../src/helpers/eos')
const { getWinningCard } = require('../src/games/hi-low')
const { getCardForPlayer, getCardIndex } = require('../src/helpers/cards')
const { xor } = require('../src/helpers/random')
const { hashSecret } = require('../src/helpers/bets');

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
    createdAt: '1549866302500000' } ];

let rand = 0;

for (let bet of bets) {
  const hash = hashSecret(bet.secret, bet.better);
  if (hash !== bet.hash) {
    console.log("LIAR FOUND! Bet:", bet);
  }

  rand = rand ^ bet.secret;
}

rand = Math.abs(rand);
console.log("Rand:", rand);

let idx = 0;
let cards = [];
for (let bet of bets) {
  const card = getCardForPlayer(rand, idx);
  console.log("Card:", card);
  cards.push(card);
  idx++;
}

const winningCard = getWinningCard(cards);
const winner = getCardIndex(cards, winningCard);
console.log("Winner:", winner);
