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
  mounted: function() {
    this.$store.dispatch('refreshGames')
  },
  methods: {
    addGame() {
      this.$store.dispatch('addGame', { creator: 'decentoddsaz', content: 'something' })
    },
    deleteGame(key) {
      this.$store.dispatch('deletegame', key);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
