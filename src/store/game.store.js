//import Room from 'ipfs-pubsub-room'
import ecc from 'eosjs-ecc';

const CONTRACT_OWNER = 'decentoddsaz'
const REFRESH_GAMES_INT_IN_SECONDS = 1

export default {
  state: {
    games: [],
    refreshGamesInt: null,
  },
  actions: {
    async addGame({ dispatch }, game) {
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
    refreshGames({ getters, state }) {
      const { rpc } = getters.eos;
      if (!state.refreshGamesInt) {
        state.refreshGamesInt = setInterval(async () => {
          let { rows:games } = await rpc.get_table_rows({code: CONTRACT_OWNER, scope: CONTRACT_OWNER, table: 'games'})
          state.games = games;
        }, REFRESH_GAMES_INT_IN_SECONDS * 1000);
      }
    }
  }
}
