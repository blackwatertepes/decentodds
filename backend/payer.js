const { fetchBets, myBets, acceptedBets, unacceptedBets, roundBets, potBets, revealedBets, unrevealedBets,
  refreshBet, hashSecret, validBet, xorBets } = require('../src/helpers/bets');
const { paybet } = require('../src/helpers/actions');
const { getCards, getPotAmount } = require('../src/helpers/players')
const { getWinningCard } = require('../src/games/hi-low');
const { getCardForPlayer } = require('../src/helpers/cards');
const { xor } = require('../src/helpers/random');

function objectsEqual(obj_a, obj_b) {
  return Object.values(obj_a).sort().join('') == Object.values(obj_b).sort().join('')
}

function mapBets(bets) {
  const pots = {};
  for (let bet of bets) {
    if (pots[bet.round]) {
      pots[bet.round].push(bet);
    } else {
      pots[bet.round] = [bet];
    }
  }
  return pots;
}

function validateBets(potbets) {
  return potbets.filter((bet) => {
    if (!validBet(bet)) {
      console.log("LIAR FOUND! Bet:", bet)
      paybet(bet.key, 0);
      // TODO Update player stats
    }
    return validBet(bet)
  })
}

function payBets(validbets) {
  if (validbets.length > 0) {
    // Find the card for each player...
    const cards = getCards(validbets)
    console.log(cards);
    const winningCard = getWinningCard(cards)
    console.log("Winner Card:", winningCard)

    const rand = Math.abs(xorBets(validbets))
    const potAmount = getPotAmount(validBets);

    // TODO: Account for ties
    // Pay the winner
    console.log("potAmount:", potAmount);
    let idx = 0;
    for (let bet of validbets) {
      const card = getCardForPlayer(rand, idx)
      if (objectsEqual(card, winningCard)) {
        const amount = `${potAmount} EOS`;
        console.log("Paying Pot:", amount, "to:", bet.key);
        await paybet(bet.key, amount);
      } else {
        //console.log("Paying 0: to:", bet.key);
        await paybet(bet.key, 0);
      }
      console.log("Paid!");
      idx++;
    }
  }
}

export function runPayer(interval = 1000) {
  setInterval(async () => {
    const bets = await fetchBets();
    const pots = mapBets(bets);

    for (let round in pots) {
      const potbets = pots[round]
      const revealedbets = revealedBets(potbets);
      if (revealedbets.length == potbets.length) {
        console.log("All bets revealed in pot:", round);

        const validbets = validateBets(potbets);
        await payBets(validbets);
      }
    }
  }, interval);
}
