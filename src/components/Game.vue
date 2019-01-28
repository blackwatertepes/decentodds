<template>
  <div class="game">
    <h4>{{ game }}</h4>
    <button @click="deleteGame(game.key)">Delete</button>
    <br />
    <button @click="bet(game.key)">Bet</button>
  </div>
</template>

<script>
  export default {
    name: 'Game',
    computed: {
      game () {
        const { id } = this.$route.params
        return this.$store.state.game.games.find((game) => {
          return game.key == id
        })
      }
    },
    mounted: function() {
    },
    methods: {
      bet(key) {
        this.$store.dispatch('bet', key)
      },
      deleteGame(key) {
        this.$store.dispatch('deletegame', key)
        this.$router.push({ name: 'root' })
      }
    }
  }
</script>
