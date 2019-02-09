const dotenv = require('dotenv').config()
const { api, rpc } = require('./src/helpers/eos')
const ecc = require('eosjs-ecc')
const { getWinningCard } = require('./src/games/hi-low')
const { getCardAtPos } = require('./src/helpers/cards')
const { getRandom } = require('./src/helpers/random')

const { CONTRACT_OWNER } = process.env
const GAMEKEY = 0
const secrets = {} // TODO: Save sercets to disk

async function fetchBets() {
  const bets = await rpc.get_table_rows({
    code: CONTRACT_OWNER,
    scope: CONTRACT_OWNER,
    table: 'bets',
  })
  return bets.rows
}

async function bet(bet) {
  const { wager, key } = bet
  const random = getRandom()
  secrets[key] = random
  // NOTE: Accept the open bet...
  const action_accept = {
    account: CONTRACT_OWNER,
    name: 'acceptbet',
    authorization: [{
      actor: CONTRACT_OWNER,
      permission: 'active',
    }],
    data: {
      key,
    }
  }
  // NOTE: Place our bet...
  const action_bet = {
    account: CONTRACT_OWNER,
    name: 'bet',
    authorization: [{
      actor: CONTRACT_OWNER,
      permission: 'active',
    }],
    data: {
      hash: ecc.sha256(`${random}:${CONTRACT_OWNER}`),
      gamekey: GAMEKEY,
      better: CONTRACT_OWNER,
      wager: wager,
      deposit: '0 EOS'
    }
  }
  // NOTE: Advance the round...
  const action_advance = {
    account: CONTRACT_OWNER,
    name: 'advanceround',
    authorization: [{
      actor: CONTRACT_OWNER,
      permission: 'active',
    }],
    data: {
      GAMEKEY,
    }
  }
  const result = await api.transact({
    actions: [action_accept, action_bet, action_advance]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  })
}

async function pay(their_bet) {
  // TODO: Fetch our bet
  // TODO: Build another level of storage (games/tables/pots/etc)?
  const { key, secret:their_secret, wager } = their_bet
  const our_secret = secrets[key]
  const shared_secret = their_secret ^ our_secret
  const their_card_pos = shared_secret % 52
  const our_card_pos = Math.floor(shared_secret / (52**1) % 52)
  const their_card = getCardAtPos(their_card_pos)
  const our_card = getCardAtPos(our_card_pos)
  const winning_card = getWinningCard(their_card, our_card)
  if (!winning_card) {
    // TODO: Pay both players their wager
  }
  const winning_bet = winning_card == their_card ? their_bet : our_bet
  /* TODO: Pay the winning bet 2X the wager
  const action_pay = {
    account: CONTRACT_OWNER,
    name: 'paybet',
    authorization: [{
      actor: CONTRACT_OWNER,
      permission: 'active',
    }],
    data: {
      key: ,
      amount
    }
  }
  */
  // NOTE: Reveal our secret...
  /* TODO: Fetch our bet key
  const action_reveal = {
    account: CONTRACT_OWNER,
    name: 'reveal',
    authorization: [{
      actor: CONTRACT_OWNER,
      permission: 'active',
    }],
    data: {
      key: ,
      secret: secret
    }
  }
  const result = await api.transact({
    actions: [action_reveal, action_pay]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  })
  */
}

setInterval(async () => {
  const bets = await fetchBets()
  for (let bet of bets) {
    const { accepted, key, wager } = bet

    // Check for open bets...
    const wageredAmount = getAssetAmount(wager)
    if (accepted == 0
      && wageredAmount > 0 // Not worth our time
      && wageredAmount < 10 // Too risky
      && !secrets[key]) {
      console.log("Open Bet:", bet)
      //await bet(bet);
    }

    // Check for revealved bets...
    if (accepted == 1
      && secrets[key]) {
      console.log("Revealed Bet:", bet)
      //await pay(bet)
    }
  }
}, 1000)
