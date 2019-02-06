//import Room from 'ipfs-pubsub-room'
import ecc from 'eosjs-ecc';
import { CONTRACT_OWNER } from '../../constants';

const REFRESH_INT_IN_SECONDS = 2;

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
    acceptbet({ dispatch }, key) {
      dispatch('transact', { name: 'acceptbet', data: {
        key
      }})
    },
    async addGame({ dispatch }, game) {
      dispatch('transact', { name: 'creategame', data: {
        creator: game.creator,
        hash: ecc.sha256(game.content)
      }})
    },
    askpayout({ dispatch }, key) {
      dispatch('transact', { name: 'askpayout', data: {
        key,
        payout: '1 EOS'
      }})
    },
    bet({ dispatch }, key) {
      dispatch('transact', { name: 'bet', data: {
        hash: ecc.sha256('asdf'),
        gamekey: key,
        better: 'decentoddsaa',
        wager: '1 EOS',
        deposit: '1 EOS'
      }})
    },
    blowupgame({ dispatch }, key) {
      dispatch('transact', { name: 'blowupgame', data: {
        key
      }})
    },
    deletegame({ dispatch }, key) {
      dispatch('transact', { name: 'deletegame', data: {
        key,
      }})
    },
    async refreshBets({ getters, state }) {
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
    },
    reveal({ dispatch }, key) {
      dispatch('transact', { name: 'reveal', data: {
        key,
        secret: ecc.sha256('something')
      }})
    },
    unbet({ dispatch }, key) {
      dispatch('transact', { name: 'unbet', data: {
        key
      }})
    },
    paybet({ dispatch }, key) {
      dispatch('transact', { name: 'paybet', data: {
        key,
        amount: '1 EOS'
      }})
    },
  }
}
