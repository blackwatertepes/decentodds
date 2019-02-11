const dotenv = require('dotenv').config();
const { Api, JsonRpc } = require('eosjs');
const { default:JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const fetch = require('node-fetch');
const { TextDecoder, TextEncoder } = require('text-encoding');

const { CONTRACT_OWNER_PRIVATE_KEY, PLAYER_A_PRIVATE_KEY, PLAYER_B_PRIVATE_KEY, EOS_RPC_URI } = process.env;

const signatureProvider = new JsSignatureProvider([CONTRACT_OWNER_PRIVATE_KEY, PLAYER_A_PRIVATE_KEY, PLAYER_B_PRIVATE_KEY]);

const rpc = new JsonRpc(EOS_RPC_URI, { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder, textEncoder: new TextEncoder });

function getAssetAmount(asset) {
  return parseFloat(asset.split(' ')[0])
}

module.exports = {
  api,
  getAssetAmount,
  rpc,
};
