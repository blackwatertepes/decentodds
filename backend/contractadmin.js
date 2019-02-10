const dotenv = require('dotenv').config()
const { api, rpc, getAssetAmount } = require('../src/helpers/eos')
const ecc = require('eosjs-ecc')
const { getWinningCard } = require('../src/games/hi-low')
const { getCardAtPos } = require('../src/helpers/cards')
const { xor } = require('../src/helpers/random')

const { CONTRACT_OWNER } = process.env
const GAMEKEY = 0

async function pay(their_bet) {
  // TODO: Fetch our bet
  // TODO: Build another level of storage (games/tables/pots/etc)?
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

setInterval(async () => {
  const bets = await fetchBets()
  for (let bet of bets) {
    const { accepted, key, wager } = bet
    // Check for revealved bets...
    if (accepted == 1
      && secrets[key]) {
      console.log("Revealed Bet:", bet)
      //await pay(bet)
    }
  }
}, 1000)
