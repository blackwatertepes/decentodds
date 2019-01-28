<template>
  <div id="games">
    <h1>Active Games: {{ games.length }}</h1>
    <button v-on:click="addGame">Start new game</button>
    <ul id="games-list">
      <Game
        v-for="(game, key) in games"
        :key="key"
        :game="game" />
    </ul>
  </div>
</template>

<script>
  import Game from './Game.vue'

  export default {
    name: 'Games',
    components: {
      Game
    },
    computed: {
      games() { return this.$store.state.game.games }
    },
    mounted: function() {
      this.$store.dispatch('refreshGames')
    },
    methods: {
      addGame() {
        this.$store.dispatch('addGame', { creator: 'decentoddsaz', content: 'something' })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
