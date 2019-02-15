const { getAssetAmount } = require('../src/helpers/eos')
const { fetchBets, myBets, acceptedBets, unacceptedBets, roundBets, potBets, revealedBets, unrevealedBets,
  refreshBet } = require('../src/helpers/bets');
const { acceptbet, advanceround } = require('../src/helpers/actions');
const { fetchGames } = require('../src/helpers/games');

const GAMEKEY = 0

function findGame(games) {
  return games.find((game) => {
    return game.key == GAMEKEY;
  })
}

export function runApprover(interval = 1000) {
  setInterval(async () => {
    //console.log("Admin thinking...");
    const games = await fetchGames();
    const game = findGame(games);

    const bets = await fetchBets();
    const unacceptedbets = unacceptedBets(bets);
    const roundbets = roundBets(unacceptedbets, game.round);

    // Accept valid open bets...
    if (roundbets.length > 1) {
      // TODO: Validate bets (Make sure wall wagers are equal, etc)
      console.log(`Accepting ${roundbets.length} open bets in round: ${game.round}...`);
      for (let bet of roundbets) {
        const { accepted, key, wager } = bet;
        acceptbet(bet.key);
      }
      console.log("Advancing round...");
      await advanceround(game.key);
      console.log("Round advanced");
    }
  }, interval)
}
