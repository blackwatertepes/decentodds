const { deletegame } = require('../src/helpers/actions');

if (process.argv.length < 3) {
  console.log("Required Args: data.key")
  process.exit()
}

deletegame(process.argv[2]);
