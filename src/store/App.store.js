import Room from 'ipfs-pubsub-room'
import { Api, JsonRpc } from 'eosjs';
import JsSignatureProvider from 'eosjs/dist/eosjs-jssig';
import ecc from 'eosjs-ecc';

export default {
  state: {
    games: [],
    ipfs: null,
    privateKey: ''
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
    async addGame({ state }, game) {
      /*
      const id = await state.ipfs.id()
      console.log("ID:", id)
      const room = Room(state.ipfs, 'ipfs-pubsub-demo')
      console.log("Room:", room)
      state.games.push(game)
      */
      const defaultPrivateKey = "5JGMvtstqP2SNrVBRhMCY269sP83T6xuFZgPAxf6JHFoJdJCFrE";
      const rpc = new JsonRpc('https://kylin.eoscanada.com');
      const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
      const api = new Api({ rpc, signatureProvider });
      api.transact({
        actions: [{
          account: 'decentoddsaz',
          name: 'creategame',
          authorization: [{
            actor: 'decentoddsaz',
            permission: 'active',
          }],
          data: {
            creator: 'decentoddsaz',
            hash: ecc.sha256('something')
          },
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
    async loadGames({ state }) {
      console.log("loadGames()")
      const rpc = new JsonRpc('https://kylin.eoscanada.com');
      let { rows:games } = await rpc.get_table_rows({code: 'decentoddsaz', scope: 'decentoddsaz', table: 'games'})
      for (let game of games) {
        state.games.push(game)
      }
    }
  },
  getters: {
    publicKey() {
      //return eosjs_ecc.privateToPublic(state.privateKey)
    }
  }
}
