const dotenv = require('dotenv').config()
const { runBetter } = require('./better');
const { runApprover } = require('./approver');
const { runPlayer } = require('./player');
const { runPayer } = require('./payer');

runApprover();
runBetter();
//runPlayer();
runPayer();
