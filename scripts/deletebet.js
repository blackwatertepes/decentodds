const { deletebet } = require('../src/helpers/actions');

if (process.argv.length < 4) {
  console.log("Required Args: actor, data.key")
  process.exit()
}

deletebet(process.argv[2], process.argv[3]);
