const dotenv = require('dotenv').config()
const { getRandom } = require('../src/helpers/random');
const { fetchBets, myBets, acceptedBets, unacceptedBets, roundBets, potBets, revealedBets, unrevealedBets,
  refreshBet, hashSecret } = require('../src/helpers/bets');
const { bet:placebet, reveal } = require('../src/helpers/actions');
const { getCards } = require('../src/helpers/players')
const { getWinningCard } = require('../src/games/hi-low')

const { PLAYER_A:PLAYER_NAME } = process.env; // The account name of the player
const GAMEKEY = 0; // The Game to play
const WAGER = '1.000'; // The amount to wager on each bet

const secrets = []; // TODO: Store on disk

function findSecret(bet) {
  return secrets.find((secret) => {
    return hashSecret(secret, PLAYER_NAME) == bet.hash;
  })
}

export function runPlayer() {
  setInterval(async () => {
    //console.log(`Player ${PLAYER_NAME} thinking...`);
    let bets = await fetchBets();
    let mybets = myBets(bets, PLAYER_NAME);
    let myacceptedbets = unrevealedBets(acceptedBets(mybets));
    //let myrevealedbets = revealedBets(mybets);

    // Place a bet...
    if (!mybets.length > 0) {
      const secret = getRandom();
      secrets.unshift(secret); // Add to beginning
      const hash = hashSecret(secret, PLAYER_NAME);
      console.log("Player: Placing bet...");
      await placebet(PLAYER_NAME, hash, GAMEKEY, WAGER);
      console.log("Player: Bet placed.");
    }

    // Reveal a bet...
    for (let bet of myacceptedbets) {
      const secret = findSecret(bet);
      console.log("Player: Revealing secret...");
      await reveal(PLAYER_NAME, bet.key, secret);
      console.log("Player: Secret revealed:", secret);
    }

    // Show game outcome...
    const cards = getCards(bets)
    console.log(cards);
    const winningCard = getWinningCard(cards)
    console.log("Winner Card:", winningCard)
  }, 8000)
}
