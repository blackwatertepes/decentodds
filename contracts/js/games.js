const dotenv = require('dotenv').config();
const { api, rpc } = require('./base');

const { ACTOR } = process.env;
const TIME_BETWEEN = 5000;

(async () => {
  let games, game, players, player, actions;

  // newGame(gameId)
  console.log("newgame...");
  await api.transact({
    actions: [{
      account: ACTOR,
      name: 'newgame',
      authorization: [{
        actor: ACTOR,
        permission: 'active',
      }],
      data: {},
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });

  await new Promise((res, rej) => {
    setTimeout(() => res(), TIME_BETWEEN);
  });

  games = await rpc.get_table_rows({code: ACTOR, scope: ACTOR, table: 'game'});
  game = games.rows.pop();
  console.log("game:", game);

  // addplayer(gameId, account_name);
  console.log(`addplayer...`);
  await api.transact({
    actions: [{
      account: ACTOR,
      name: 'addplayer',
      authorization: [{
        actor: ACTOR,
        permission: 'active',
      }],
      data: {
        gameId: game.id,
        playerAccountName: 'blackwaterte'
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });

  await new Promise((res, rej) => {
    setTimeout(() => res(), TIME_BETWEEN);
  });

  players = await api.get_table_rows({code: ACTOR, scope: ACTOR, table: 'player', index_position: 2, key_type: 'i64', lower_bound: game.id, upper_bound: game.id + 1});
  console.log("players:", players.rows);

  console.log(`addplayer...`);
  await api.transact({
    actions: [{
      account: ACTOR,
      name: 'addplayer',
      authorization: [{
        actor: ACTOR,
        permission: 'active',
      }],
      data: {
        gameId: game.id,
        playerAccountName: 'blackwaterpe'
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });

  await new Promise((res, rej) => {
    setTimeout(() => res(), TIME_BETWEEN);
  });

  players = await rpc.get_table_rows({code: ACTOR, scope: ACTOR, table: 'player', index_position: 2, key_type: 'i64', lower_bound: game.id, upper_bound: game.id + 1});
  console.log("players:", players.rows);

  console.log(`addplayer...`);
  await api.transact({
    actions: [{
      account: ACTOR,
      name: 'addplayer',
      authorization: [{
        actor: ACTOR,
        permission: 'active',
      }],
      data: {
        gameId: game.id,
        playerAccountName: 'blackwaters'
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });

  await new Promise((res, rej) => {
    setTimeout(() => res(), TIME_BETWEEN);
  });

  players = await rpc.get_table_rows({code: ACTOR, scope: ACTOR, table: 'player', index_position: 2, key_type: 'i64', lower_bound: game.id, upper_bound: game.id + 1});
  console.log("players:", players.rows);

  // delplayer(playerId);
  /*
  console.log("delplayer...");
  player = players.rows.pop();
  await api.transact({
    actions: [{
      account: ACTOR,
      name: 'delplayer',
      authorization: [{
        actor: ACTOR,
        permission: 'active',
      }],
      data: {
        playerId: player.id,
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });

  await new Promise((res, rej) => {
    setTimeout(() => res(), TIME_BETWEEN);
  });

  players = await rpc.get_table_rows({code: ACTOR, scope: ACTOR, table: 'player', table_key: 'gameId', lower_bound: game.id, upper_bound: game.id + 1});
  console.log("players:", players.rows);
  */

  // advancegame(gameId);
  console.log("advancegame...");
  await api.transact({
    actions: [{
      account: ACTOR,
      name: 'advancegame',
      authorization: [{
        actor: ACTOR,
        permission: 'active',
      }],
      data: {
        gameId: game.id
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });

  await new Promise((res, rej) => {
    setTimeout(() => res(), TIME_BETWEEN);
  });

  games = await rpc.get_table_rows({code: ACTOR, scope: ACTOR, table: 'game', lower_bound: game.id, upper_bound: game.id + 1});
  game = games.rows.pop();
  console.log("game:", game);

  // updatescore(playerId, score);
  console.log("updatescore...");
  actions = players.rows.map((player) => {
    return {
      account: ACTOR,
      name: 'updatescore',
      authorization: [{
        actor: ACTOR,
        permission: 'active',
      }],
      data: {
        playerId: player.id,
        score: Math.round(Math.random() * 1000)
      },
    }
  });

  console.log("actions:", actions);

  await api.transact({
    actions: actions
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });

  await new Promise((res, rej) => {
    setTimeout(() => res(), TIME_BETWEEN);
  });

  players = await rpc.get_table_rows({code: ACTOR, scope: ACTOR, table: 'player', index_position: 2, key_type: 'i64', lower_bound: game.id, upper_bound: game.id + 1});
  console.log("players:", players.rows);

  // endgame(gameId);
  console.log("endgame...");
  await api.transact({
    actions: [{
      account: ACTOR,
      name: 'endgame',
      authorization: [{
        actor: ACTOR,
        permission: 'active',
      }],
      data: {
        gameId: game.id
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });

  await new Promise((res, rej) => {
    setTimeout(() => res(), TIME_BETWEEN);
  });

  games = await rpc.get_table_rows({code: ACTOR, scope: ACTOR, table: 'game', lower_bound: game.id, upper_bound: game.id + 1});
  game = games.rows.pop();
  console.log("game:", game);

  // delgame(gameId);
  console.log("delgame...");
  await api.transact({
    actions: [{
      account: ACTOR,
      name: 'delgame',
      authorization: [{
        actor: ACTOR,
        permission: 'active',
      }],
      data: {
        gameId: game.id,
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
})();
