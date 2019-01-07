import Room from 'ipfs-pubsub-room'
const rpc = new eosjs_jsonrpc.default('https://kylin.eoscanada.com');

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
      const id = await state.ipfs.id()
      console.log("ID:", id)
      const room = Room(state.ipfs, 'ipfs-pubsub-demo')
      console.log("Room:", room)
      state.games.push(game)
    },
    async createPrivateKey() {
      //const key = await eosjs_ecc.randomKey()
      //commit('setPrivateKey', key)
    },
    async loadGames({ state }) {
      console.log("loadGames()")
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
