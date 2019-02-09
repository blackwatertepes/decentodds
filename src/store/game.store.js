//import Room from 'ipfs-pubsub-room'
import ecc from 'eosjs-ecc';
import { CONTRACT_OWNER } from '../../constants';
import { getRandom } from '../helpers/random';

const REFRESH_INT_IN_SECONDS = 5;

export default {
  state: {
    bets: [],
    games: [],
    refreshGamesInt: null,
    refreshBetsInt: null,
    random: 0,
  },
  mutations: {
    setBets(state, { bets }) {
      state.bets = bets
    },
    setGames(state, { games }) {
      state.games = games
    },
    setRandom(state, { random }) {
      state.random = random
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
      //const random = Math.abs(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) ^ new Date().getMilliseconds())
      // TODO: Share methods with the "Backend"
      // TODO: Save random in local storage
      const random = getRandom();
      const better = 'decentoddsaa';
      console.log("Random:", random);
      this.commit('setRandom', { random });
      dispatch('transact', { name: 'bet', data: {
        hash: ecc.sha256(`${random}:${better}`),
        gamekey: key,
        better: better,
        wager: '1 EOS',
        deposit: '0 EOS'
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
    reveal({ dispatch, state }, key) {
      dispatch('transact', { name: 'reveal', data: {
        key,
        secret: `${state.random}`
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
