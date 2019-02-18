import { Api, JsonRpc } from 'eosjs';
import JsSignatureProvider from 'eosjs/dist/eosjs-jssig';
import { CONTRACT_OWNER, PLAYER_A, CONTRACT_OWNER_PRIVATE_KEY, PLAYER_A_PRIVATE_KEY, EOS_RPC_URI } from '../../constants';

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
            actor: PLAYER_A,
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
      const signatureProvider = new JsSignatureProvider([CONTRACT_OWNER_PRIVATE_KEY, PLAYER_A_PRIVATE_KEY])
      const rpc = new JsonRpc(EOS_RPC_URI)
      const api = new Api({ rpc, signatureProvider })

      return { api, rpc }
    },
  }
}
