const dotenv = require('dotenv').config()
const { api, eosjs, rpc } = require('../base')
const ecc = require('eosjs-ecc')

const { CONTRACT_OWNER } = process.env
const GAMEKEY = 0
const secrets = {}

async function fetchBets() {
  const bets = await rpc.get_table_rows({
    code: CONTRACT_OWNER,
    scope: CONTRACT_OWNER,
    table: 'bets',
  })
  return bets.rows
}

function getRandom() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
}

setInterval(async () => {
  // Check for open bets...
  // TODO: Make sure no other bets have been placed by one of ours
  const bets = await fetchBets()
  for (let bet of bets) {
    const { accepted, key:betKey, wager } = bet
    const wageredAmount = parseFloat(wager.split(' ')[0])
    if (accepted == 0
      && wageredAmount > 0
      && wageredAmount < 10) {
      console.log("Open Bet:", bet)
      const random = getRandom()
      // NOTE: Place a bet of our own...
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
          wager: `${wageredAmount} EOS`,
          deposit: '0 EOS'
        }
      }
      // NOTE: Accept the open bet...
      const action_accept = {
        account: CONTRACT_OWNER,
        name: 'acceptbet',
        authorization: [{
          actor: CONTRACT_OWNER,
          permission: 'active',
        }],
        data: {
          key: betKey,
        }
      }
      const result = await api.transact({
        actions: [action_accept, action_bet]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      })
    }
  }
}, 1000)
