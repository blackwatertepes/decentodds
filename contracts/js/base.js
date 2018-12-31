const dotenv = require('dotenv').config();
const eosjs = require('eosjs');
const fetch = require('node-fetch');
const { TextDecoder, TextEncoder } = require('text-encoding');

const { PRIVATE_KEY, EOS_URI } = process.env;

const signatureProvider = new eosjs.SignatureProvider([PRIVATE_KEY]);

const rpc = new eosjs.Rpc.JsonRpc(EOS_URI, { fetch });
(async () => {
  console.log('DEBUG', await rpc.get_info());
})();

const api = new eosjs.Api({ rpc, signatureProvider, textDecoder: new TextDecoder, textEncoder: new TextEncoder });

module.exports = {
  api,
  eosjs,
  rpc,
};
