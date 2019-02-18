const { api, rpc } = require('./eos');
const { CONTRACT_OWNER } = require('../../constants');

/////////////
// PRIVATE //
/////////////

function buildAction(name, authorization, data) {
  return {
    account: CONTRACT_OWNER,
    name,
    authorization: [authorization],
    data
  }
}

function buildOptions(options = {}) {
  return {
    blocksBehind: 3,
    expireSeconds: 30,
    ...options
  }
}

function buildOwnerAction(name, data) {
  return buildAction(name, {
    actor: CONTRACT_OWNER,
    permission: 'active'
  }, data);
}

////////////
// PUBLIC //
////////////

function creategame(hash) {
  const action = buildOwnerAction('creategame', { creator: CONTRACT_OWNER, hash });
  return api.transact({ actions: [action] }, buildOptions());
}

function getgames() {
  return rpc.get_table_rows({ code: CONTRACT_OWNER, scope: CONTRACT_OWNER, table: 'games' });
}

function advanceround(key) {
  const action = buildOwnerAction('advanceround', {
    key,
  });
  return api.transact({ actions: [action] }, buildOptions());
}

function deletegame(key) {
  const action = buildOwnerAction('deletegame', { key });
  return api.transact({ actions: [action] }, buildOptions());
}

function bet(actor, hash, gamekey, wager) {
  const action = buildAction('bet', { actor, permission: 'active' }, {
    hash,
    gamekey,
    better: actor,
    wager: `${wager} EOS`,
    deposit: '0.0000 EOS'
  });
  return api.transact({ actions: [action] }, buildOptions());
}

function getbets() {
  return rpc.get_table_rows({ code: CONTRACT_OWNER, scope: CONTRACT_OWNER, table: 'bets' });
}

function paybet(key, amount) {
  const action = buildOwnerAction('paybet', {
    key,
    amount: `${amount} EOS`
  });
  return api.transact({ actions: [action] }, buildOptions());
}

function unbet(actor, key) {
  const action = buildAction('unbet', { actor, permission: 'active' }, {
    key,
  });
  return api.transact({ actions: [action] }, buildOptions());
}

function acceptbet(key) {
  const action = buildOwnerAction('acceptbet', {
    key,
  });
  return api.transact({ actions: [action] }, buildOptions());
}

function reveal(actor, key, secret) {
  const action = buildAction('reveal', { actor, permission: 'active' }, {
    key,
    secret,
  });
  return api.transact({ actions: [action] }, buildOptions());
}

function deletebet(actor, key) {
  const action = buildAction('deletebet', { actor, permission: 'active'}, {
    key,
  });
  return api.transact({ actions: [action] }, buildOptions());
}

module.exports = {
  creategame,
  getgames,
  advanceround,
  deletegame,
  bet,
  getbets,
  acceptbet,
  reveal,
  paybet,
  unbet,
  deletebet
}
