//import Room from 'ipfs-pubsub-room'
import ecc from 'eosjs-ecc';

const CONTRACT_OWNER = 'decentoddsaz'
const REFRESH_INT_IN_SECONDS = 2

export default {
  state: {
    bets: [],
    games: [],
    refreshGamesInt: null,
    refreshBetsInt: null,
  },
  mutations: {
    setBets(state, { bets }) {
      state.bets = bets
    },
    setGames(state, { games }) {
      state.games = games
    }
  },
  actions: {
    async addGame({ dispatch }, game) {
      dispatch('transact', { name: 'creategame', data: {
        creator: game.creator,
        hash: ecc.sha256(game.content)
      }})
    },
    bet({ dispatch }, key) {
      dispatch('transact', { name: 'bet', data: {
        hash: ecc.sha256('asdf'),
        gamekey: key,
        better: 'decentoddsaz',
        wager: '1 EOS',
        deposit: '1 EOS'
      }})
    },
    deletegame({ dispatch, state }, key) {
      dispatch('transact', { name: 'deletegame', data: {
        key,
      }})
    },
    async refreshBets({ getters, state }, key) {
      const { rpc } = getters.eos;
      if (state.refreshBetsInt) {
        clearInterval(state.refreshBetsInt);
      }
      state.refreshBetsInt = setInterval(async () => {
        let { rows:bets } = await rpc.get_table_rows({code: CONTRACT_OWNER, scope: CONTRACT_OWNER, table: 'bets'})
        this.commit('setBets', { bets })
      }, REFRESH_INT_IN_SECONDS * 1000);
    },
    refreshGames({ getters, state }) {
      const { rpc } = getters.eos;
      if (state.refreshGamesInt) {
        clearInterval(state.refreshGamesInt);
      }
      state.refreshGamesInt = setInterval(async () => {
        let { rows:games } = await rpc.get_table_rows({code: CONTRACT_OWNER, scope: CONTRACT_OWNER, table: 'games'})
        this.commit('setGames', { games })
      }, REFRESH_INT_IN_SECONDS * 1000);
    }
  }
}
