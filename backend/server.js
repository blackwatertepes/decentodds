const dotenv = require('dotenv').config()
const { runBetter } = require('./better');
const { runApprover } = require('./approver');
const { runPlayer } = require('./player');
// TODO: Finish & Import payer

runApprover();
runBetter();
runPlayer();
