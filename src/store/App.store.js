import Room from 'ipfs-pubsub-room'
import { Api, JsonRpc } from 'eosjs';
import JsSignatureProvider from 'eosjs/dist/eosjs-jssig';
import ecc from 'eosjs-ecc';

const REFRESH_GAMES_INT_IN_SECONDS = 1;

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
    async addGame({ state }, game) {
      /*
      const id = await state.ipfs.id()
      console.log("ID:", id)
      const room = Room(state.ipfs, 'ipfs-pubsub-demo')
      console.log("Room:", room)
      */
      const defaultPrivateKey = "5JGMvtstqP2SNrVBRhMCY269sP83T6xuFZgPAxf6JHFoJdJCFrE";
      const rpc = new JsonRpc('https://kylin.eoscanada.com');
      const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
      const api = new Api({ rpc, signatureProvider });
      await api.transact({
        actions: [{
          account: 'decentoddsaz',
          name: 'creategame',
          authorization: [{
            actor: 'decentoddsaz',
            permission: 'active',
          }],
          data: {
            creator: game.creator,
            hash: ecc.sha256(game.content)
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
    },
    async deletegame({ state }, key) {
      console.log("deletegame", "key:", key, "games:", state.games);
      let game = state.games[key];
      console.log("game:", game);
      const defaultPrivateKey = "5JGMvtstqP2SNrVBRhMCY269sP83T6xuFZgPAxf6JHFoJdJCFrE";
      const rpc = new JsonRpc('https://kylin.eoscanada.com');
      const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
      const api = new Api({ rpc, signatureProvider });
      console.log("deletegame:", defaultPrivateKey, rpc, api);
      await api.transact({
        actions: [{
          account: 'decentoddsaz',
          name: 'deletegame',
          authorization: [{
            actor: 'decentoddsaz',
            permission: 'active',
          }],
          data: {
            key: game.key,
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
    refreshGames({ state }) {
      if (!state.refreshGamesInt) {
        state.refreshGamesInt = setInterval(async () => {
          const rpc = new JsonRpc('https://kylin.eoscanada.com');
          let { rows:games } = await rpc.get_table_rows({code: 'decentoddsaz', scope: 'decentoddsaz', table: 'games'})
          state.games = games;
        }, REFRESH_GAMES_INT_IN_SECONDS * 1000);
      }
    }
  },
  getters: {
    publicKey() {
      //return eosjs_ecc.privateToPublic(state.privateKey)
    }
  }
}
