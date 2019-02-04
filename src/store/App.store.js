import { Api, JsonRpc } from 'eosjs';
import JsSignatureProvider from 'eosjs/dist/eosjs-jssig';

const CONTRACT_OWNER = 'decentoddsaz'
const DEFAULT_PRIVATE_KEY = "5JGMvtstqP2SNrVBRhMCY269sP83T6xuFZgPAxf6JHFoJdJCFrE"
const EOS_RPC_URI = 'https://kylin.eoscanada.com'

export default {
  state: {
    ipfs: null,
    gameTypes: [{ id: 'hicard', name: "Hi Card" }, { id: 'texasholdem', name: "Texas Hold'em" }],
  },
  mutations: {
    setIpfs(state, { ipfs }) {
      state.ipfs = ipfs
    }
  },
  actions: {
    async transact({ getters }, { name, data }) {
      const { api } = getters.eos;
      await api.transact({
        actions: [{
          account: CONTRACT_OWNER,
          name,
          authorization: [{
            actor: CONTRACT_OWNER,
            permission: 'active',
          }],
          data
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
    },
  },
  getters: {
    eos() {
      const signatureProvider = new JsSignatureProvider([DEFAULT_PRIVATE_KEY])
      const rpc = new JsonRpc(EOS_RPC_URI)
      const api = new Api({ rpc, signatureProvider })

      return { api, rpc }
    }
  }
}
