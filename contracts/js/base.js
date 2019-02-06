const dotenv = require('dotenv').config();
const eosjs = require('eosjs');
const fetch = require('node-fetch');
const { TextDecoder, TextEncoder } = require('text-encoding');

const { CONTRACT_OWNER_PRIVATE_KEY, PLAYER_A_PRIVATE_KEY, EOS_RPC_URI, CONTRACT_OWNER } = process.env;

//const signatureProvider = new eosjs.SignatureProvider([PRIVATE_KEY_AZ, PRIVATE_KEY_AA]);
const signatureProvider = new eosjs.SignatureProvider([PLAYER_A_PRIVATE_KEY, CONTRACT_OWNER_PRIVATE_KEY]);

const rpc = new eosjs.Rpc.JsonRpc(EOS_RPC_URI, { fetch });
const api = new eosjs.Api({ rpc, signatureProvider, textDecoder: new TextDecoder, textEncoder: new TextEncoder });

(async () => {
  console.log('DEBUG', await rpc.get_info());
})();

module.exports = {
  api,
  eosjs,
  rpc,
};
