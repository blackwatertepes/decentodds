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

export function runPayer(interval = 1000) {
  setInterval(async () => {
    const bets = await fetchBets();

    // INFO: Map all bets by round...
    const pots = {};
    for (let bet of bets) {
      if (pots[bet.round]) {
        pots[bet.round].push(bet);
      } else {
        pots[bet.round] = [bet];
      }
    }

    for (let round in pots) {
      const potbets = pots[round]
      const revealedbets = revealedBets(potbets);
      if (revealedbets.length == potbets.length) {
        console.log("All bets revealed in pot:", round);

        // Validate each secret against the hash
        const validbets = potbets.filter((bet) => {
          if (!validBet(bet)) {
            console.log("LIAR FOUND! Bet:", bet)
            paybet(bet.key, 0);
            // TODO Update player stats
          }
          return validBet(bet)
        })

        if (validbets.length > 0) {
          // Find the card for each player...
          const cards = getCards(validbets)
          console.log(cards);
          const winningCard = getWinningCard(cards)
          console.log("Winner Card:", winningCard)

          // TODO: Account for ties
          // Pay the winner
          let rand = Math.abs(xorBets(validbets))
          let potAmount;
          if (validbets.length == 1) {
            potAmount = getAssetAmount(validbets[0].wager);
          } else {
            potAmount = validbets.reduce((acc, bet) => { console.log("acc:", acc, "bet:", bet); return getAssetAmount(bet.wager) + getAssetAmount(acc.wager) })
          }
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
    }
  }, interval);
}
