import Room from 'ipfs-pubsub-room'
import { Api, JsonRpc } from 'eosjs';
import JsSignatureProvider from 'eosjs/dist/eosjs-jssig';
import ecc from 'eosjs-ecc';

const CONTRACT_OWNER = 'decentoddsaz'
const DEFAULT_PRIVATE_KEY = "5JGMvtstqP2SNrVBRhMCY269sP83T6xuFZgPAxf6JHFoJdJCFrE"
const EOS_RPC_URI = 'https://kylin.eoscanada.com'
const REFRESH_GAMES_INT_IN_SECONDS = 1

export default {
  state: {
    games: [],
    ipfs: null,
    privateKey: '',
    refreshGamesInt: null,
  },
  mutations: {
    setIpfs(state, ipfs) {
      state.ipfs = ipfs
    },
    setPrivateKey(state, key) {
      state.privateKey = key
    }
  },
  actions: {
    async addGame({ dispatch }, game) {
      /*
      const id = await state.ipfs.id()
      console.log("ID:", id)
      const room = Room(state.ipfs, 'ipfs-pubsub-demo')
      console.log("Room:", room)
      */
      dispatch('transact', { name: 'creategame', data: {
        creator: game.creator,
        hash: ecc.sha256(game.content)
      }})
    },
    deletegame({ dispatch, state }, index) {
      let { key } = state.games[index];
      dispatch('transact', { name: 'deletegame', data: {
        key,
      }})
    },
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
    async createPrivateKey() {
      //const key = await eosjs_ecc.randomKey()
      //commit('setPrivateKey', key)
    },
    refreshGames({ getters, state }) {
      const { rpc } = getters.eos;
      if (!state.refreshGamesInt) {
        state.refreshGamesInt = setInterval(async () => {
          let { rows:games } = await rpc.get_table_rows({code: CONTRACT_OWNER, scope: CONTRACT_OWNER, table: 'games'})
          state.games = games;
        }, REFRESH_GAMES_INT_IN_SECONDS * 1000);
      }
    }
  },
  getters: {
    eos() {
      const signatureProvider = new JsSignatureProvider([DEFAULT_PRIVATE_KEY])
      const rpc = new JsonRpc(EOS_RPC_URI)
      const api = new Api({ rpc, signatureProvider })

      return { api, rpc }
    },
    publicKey() {
      //return eosjs_ecc.privateToPublic(state.privateKey)
    }
  }
}
