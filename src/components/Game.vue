<template>
  <div class="game">
    <h4>{{ game }}</h4>
    <button @click="deleteGame(game.key)">Delete</button>
    <br />
    <button @click="bet(game.key)">Bet</button>
    <Bets />
  </div>
</template>

<script>
  import Bets from './Bets.vue'

  export default {
    name: 'Game',
    components: {
      Bets
    },
    computed: {
      game () {
        const { id } = this.$route.params
        return this.$store.state.game.games.find((game) => {
          return game.key == id
        })
      }
    },
    mounted: function() {
      //const { id } = this.$route.params
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
