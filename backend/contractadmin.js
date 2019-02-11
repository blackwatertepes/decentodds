const dotenv = require('dotenv').config()
const { getAssetAmount } = require('../src/helpers/eos')
const { getWinningCard } = require('../src/games/hi-low')
const { getCardAtPos } = require('../src/helpers/cards')
const { xor } = require('../src/helpers/random')
const {
  fetchBets,
  myBets,
  acceptedBets,
  unacceptedBets,
  roundBets,
  potBets,
  revealedBets,
  unrevealedBets,
  refreshBet,
  hashSecret } = require('../src/helpers/bets');
const { acceptbet, advanceround } = require('../src/helpers/actions');
const { fetchGames } = require('../src/helpers/games');

const { CONTRACT_OWNER } = process.env
const GAMEKEY = 0

async function pay() {
  // TODO...
  const { key, secret:their_secret, wager } = their_bet
  const our_secret = secrets[key]
  const shared_secret = xor([our_secret, their_secret])
  const their_card_pos = getCardForPlayer(shared_secret, 0)
  const our_card_pos = getCardForPlayer(shared_secret, 1)
  const their_card = getCardAtPos(their_card_pos)
  const our_card = getCardAtPos(our_card_pos)
  const winning_card = getWinningCard(their_card, our_card)
  if (!winning_card) {
    // TODO: Pay both players their wager
  }
  const winning_bet = winning_card == their_card ? their_bet : our_bet
  // TODO: Pay the winning bet 2X the wager
}

export function runAdmin() {
  setInterval(async () => {
    //console.log("Admin thinking...");
    const games = await fetchGames();
    const game = games.find((game) => {
      return game.key == GAMEKEY;
    })

    const bets = await fetchBets();
    const unacceptedbets = unacceptedBets(bets);
    const roundbets = unacceptedBets(unacceptedbets, game.round);

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

    // Show outcome...
    /*
    if (myrevealedbets.length > 0) {
      for (let bet of myrevealedbets) {
        const potbets = potBets(bets, bet.round);
        const revealedpotbets = revealedBets(potbets);
        if (potbets.length == revealedpotbets.length) {
          console.log("Player: All bets revealed!");
          // Check all secrets...
          for (bet of potbets) {
            let hash = hashSecret(bet.secret, bet.better);
            if (hash !== bet.hash) {
              console.log("LIAR FOUND! Bet:", bet);
            }
          }
          // Calculate cards...
        } else {
          console.log("Player: Revealed bets in round:", revealedpotbets.length, "of", potbets.length);
        }
      }
    }
    */
  }, 500)
}
