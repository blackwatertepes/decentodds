require = require("esm")(module/*, options*/)

const { fetchBets, myBets, acceptedBets, unacceptedBets, roundBets, potBets, revealedBets, unrevealedBets,
  refreshBet, hashSecret, validBet, xorBets } = require('../src/helpers/bets');
const { paybet } = require('../src/helpers/actions');
const { getAssetAmount } = require('../src/helpers/eos')
const { getCards } = require('../src/helpers/players')
const { getWinningCard } = require('../src/games/hi-low');
const { getCardForPlayer } = require('../src/helpers/cards');
const { xor } = require('../src/helpers/random');

function objectsEqual(obj_a, obj_b) {
  return Object.values(obj_a).sort().join('') == Object.values(obj_b).sort().join('')
}

(async () => {
  const bets = await fetchBets();
  const revealedbets = revealedBets(acceptedBets(bets));

  // Validate each secret against the hash
  const validbets = revealedbets.filter((bet) => {
    if (!validBet(bet)) {
      console.log("LIAR FOUND! Bet:", bet)
      paybet(bet.key, 0);
      // TODO Update player stats
    }
    return validBet(bet)
  })

  // Find the card for each player...
  const cards = getCards(validbets)
  console.log(cards);
  const winningCard = getWinningCard(cards)
  console.log("Winner Card:", winningCard)

  // TODO: Account for ties
  // Pay the winner
  let rand = Math.abs(xorBets(validbets))
  console.log("rand:", rand, "validbets:", validbets);
  const potAmount = validbets.reduce((acc, bet) => { console.log("acc:", acc, "bet:", bet); return getAssetAmount(bet.wager) + getAssetAmount(acc.wager) })
  console.log("potAmount:", potAmount);
  let idx = 0;
  for (let bet of validbets) {
    const card = getCardForPlayer(rand, idx)
    if (objectsEqual(card, winningCard)) {
      const amount = `${potAmount} EOS`;
      console.log("Pot:", potAmount, amount);
      paybet(bet.key, amount);
    } else {
      paybet(bet.key, 0);
    }
    idx++;
  }
})();
