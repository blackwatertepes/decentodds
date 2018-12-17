export default {
  state: {
    games: [],
    privateKey: ''
  },
  mutations: {
    addGame(state, game) {
      state.games.push(game)
    },
    setPrivateKey(state, key) {
      state.privateKey = key
    }
  },
  actions: {
    async createPrivateKey({ commit }) {
      const key = await eosjs_ecc.randomKey()
      commit('setPrivateKey', key)
    }
  },
  getters: {
    publicKey(state) {
      return eosjs_ecc.privateToPublic(state.privateKey)
    }
  }
}
