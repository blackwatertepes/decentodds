const { unbet } = require('../src/helpers/actions');

if (process.argv.length < 4) {
  console.log("Required Args: actor, data.key")
  process.exit()
}

unbet(process.argv[2], process.argv[3]);
