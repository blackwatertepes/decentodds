<template>
  <div id="games">
    <h1>Active Games: {{ games.length }}</h1>
    <button v-on:click="addGame">Start new game</button>
    <ul id="games-list">
      <li v-for="(game, idx) in games" :key="idx">
        {{ game }}
        <router-link :to="{ name: 'game', params: { id: game.key }}">Play</router-link>
        <button @click="deleteGame(game.key)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'Games',
    computed: {
      games() { return this.$store.state.game.games }
    },
    methods: {
      addGame() {
        this.$store.dispatch('addGame', { creator: 'decentoddsaz', content: 'something' })
      },
      deleteGame(key) {
        this.$store.dispatch('deletegame', key)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
