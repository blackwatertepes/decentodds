require = require("esm")(module/*, options*/)
const { getbets } = require('../src/helpers/actions');

(async () => {
  const bets = await getbets();
  console.log(bets.rows);
})();
