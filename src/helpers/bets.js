const ecc = require('eosjs-ecc')
const { getbets } = require('./actions')
const { getAssetSymbol } = require('./eos')
const { xor } = require('./random')

async function fetchBets() {
  const bets = await getbets();
  return bets.rows;
}

function myBets(bets, name) {
  return bets.filter((bet) => {
    return bet.better == name;
  });
}

function acceptedBets(bets) {
  return bets.filter((bet) => {
    return bet.accepted;
  });
}

function unacceptedBets(bets) {
  return bets.filter((bet) => {
    return !bet.accepted;
  })
}

function roundBets(bets, round) {
  return bets.filter((bet) => {
    return bet.round == round;
  });
}

function potBets(bets, round) {
  return acceptedBets(roundBets(bets, round));
}

function revealedBets(bets) {
  return bets.filter((bet) => {
    return bet.secret;
  })
}

function unrevealedBets(bets) {
  return bets.filter((bet) => {
    return !bet.secret;
  })
}

// TODO: Test
function paidBets(bets) {
  return bets.filter((bet) => {
    return getAssetSymbol(bet.paid);
  })
}

// TODO: Test
function unpaidBets(bets) {
  return bets.filter((bet) => {
    return !getAssetSymbol(bet.paid);
  })
}

async function refreshBet(_bet) {
  const bets = await fetchBets();
  return bets.find((bet) => {
    return bet.key == _bet.key;
  });
}

// NOTE: Hashes the secret with the players name...
function hashSecret(secret, playerName) {
  return ecc.sha256(`${secret}:${playerName}`);
}

// NOTE: Make sure the revealed secret matches the bet hash...
function validBet(bet) {
  return bet.hash == hashSecret(bet.secret, bet.better)
}

// NOTE: xor's the secets together...
function xorBets(bets) {
  return xor(bets.map((bet) => { return bet.secret }))
}

module.exports = {
  fetchBets,
  myBets,
  acceptedBets,
  roundBets,
  potBets,
  revealedBets,
  refreshBet,
  unacceptedBets,
  unrevealedBets,
  paidBets,
  unpaidBets,
  hashSecret,
  validBet,
  xorBets,
}
