const dotenv = require('dotenv').config()
const { runBetter } = require('./better');
const { runAdmin } = require('./contractadmin');
const { runPlayer } = require('./player');

const { CONTRACT_OWNER } = process.env
const GAMEKEY = 0

runBetter();
runAdmin();
runPlayer();
