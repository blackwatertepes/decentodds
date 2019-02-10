const ecc = require('eosjs-ecc')
const { getbets } = require('./actions')
const { getRandom } = require('./random')

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

async function refreshBet(_bet) {
  const bets = await fetchBets();
  return bets.find((bet) => {
    return bet.key == _bet.key;
  });
}

function hashSecret(secret, playerName) {
  return ecc.sha256(`${secret}:${playerName}`);
}

function getRandomWithHash(playerName) {
  const secret = getRandom();
  const hash = hashSecret(secret, playerName);
  return { secret, hash };
}

module.exports = {
  fetchBets,
  myBets,
  acceptedBets,
  roundBets,
  potBets,
  revealedBets,
  refreshBet,
  hashSecret,
  getRandomWithHash,
}
