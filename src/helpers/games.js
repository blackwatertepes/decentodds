const ecc = require('eosjs-ecc')
const { getgames } = require('./actions')

async function fetchGames() {
  const games = await getgames();
  return games.rows;
}

async function refreshGame(_game) {
  const games = await fetchGames();
  return games.find((game) => {
    return game.key == _game.key;
  });
}

module.exports = {
  fetchGames,
  refreshGame,
}
