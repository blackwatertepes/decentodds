const dotenv = require('dotenv').config()
const { runBetter } = require('./better');
const { runAdmin } = require('./contractadmin');
const { runPlayer } = require('./player');

runAdmin();
runBetter();
runPlayer();
