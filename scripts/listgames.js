const { getgames } = require('../src/helpers/actions');

(async () => {
  const games = await getgames();
  console.log(games.rows);
})();
