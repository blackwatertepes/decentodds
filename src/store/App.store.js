import Room from 'ipfs-pubsub-room'
let Buffer = require('buffer/').Buffer

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
    async addGame({ commit, dispatch, state }, game) {
      const id = await state.ipfs.id()
      console.log("ID:", id)
      const room = Room(state.ipfs, 'ipfs-pubsub-demo')
      console.log("Room:", room)
      /*
      await dispatch('loadGames')
      let err = await state.ipfs.pubsub.publish('/games', Buffer.from([ Math.random() ]))
      if (err) { console.log("Write Error:", err) }
      await dispatch('loadGames')
      */
      state.games.push(game)
    },
    async createPrivateKey({ commit }) {
      const key = await eosjs_ecc.randomKey()
      commit('setPrivateKey', key)
    },
    async loadGames({ commit, state }) {
      let err = await state.ipfs.pubsub.subscribe('/games')
      if (err) { console.log("Read Error:", err) }
      //console.log("Read Games:", buf)//buf.toString('utf8'))
    }
  },
  getters: {
    publicKey(state) {
      return eosjs_ecc.privateToPublic(state.privateKey)
    }
  }
}
