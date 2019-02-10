const { paybet } = require('../src/helpers/actions');

if (process.argv.length < 4) {
  console.log("Required Args: data.key, data.amount")
  process.exit()
}

paybet(process.argv[2], process.argv[3]);
