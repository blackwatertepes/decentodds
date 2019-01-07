const dotenv = require('dotenv').config();
const eosjs = require('eosjs');
const fetch = require('node-fetch');
const { TextDecoder, TextEncoder } = require('text-encoding');

const { PRIVATE_KEY_AZ, PRIVATE_KEY_AA, EOS_URI, ACTOR } = process.env;

//const signatureProvider = new eosjs.SignatureProvider([PRIVATE_KEY_AZ, PRIVATE_KEY_AA]);
const signatureProvider = new eosjs.SignatureProvider([PRIVATE_KEY_AA]);

const rpc = new eosjs.Rpc.JsonRpc(EOS_URI, { fetch });
const api = new eosjs.Api({ rpc, signatureProvider, textDecoder: new TextDecoder, textEncoder: new TextEncoder });

(async () => {
  console.log('DEBUG', await rpc.get_info());
})();

module.exports = {
  api,
  eosjs,
  rpc,
};
