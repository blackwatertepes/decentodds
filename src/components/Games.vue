<template>
  <div id="games">
    <h1>Active Games: {{ games.length }}</h1>
    <button v-on:click="addGame">Start new game</button>
    <ul id="games-list">
      <li v-for="(game, key) in games">
        <span>{{ game }}</span>
        <button @click="deleteGame(key)">
          Delete
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Games',
  props: {
    msg: String
  },
  computed: {
    games() { return this.$store.state.games }
  },
  methods: {
    addGame() {
      this.$store.dispatch('addGame', {})
    },
    deleteGame(key) {
      let game = this.games[key];
      console.log("game:", game);
      const defaultPrivateKey = "5JGMvtstqP2SNrVBRhMCY269sP83T6xuFZgPAxf6JHFoJdJCFrE";
      const rpc = new eosjs_jsonrpc.default('https://kylin.eoscanada.com');
      const signatureProvider = new eosjs_jssig.default([defaultPrivateKey]);
      const api = new eosjs_api.default({ rpc, signatureProvider });
      console.log("deletegame:", defaultPrivateKey, rpc, api);
      api.transact({
        actions: [{
          account: 'decentoddsaz',
          name: 'deletegame',
          authorization: [{
            actor: 'decentoddsaz',
            permission: 'active',
          }],
          data: {
            hash: game.hash,
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 30,
      });
      this.games.splice(key, 1);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
