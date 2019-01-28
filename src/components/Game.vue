<template>
  <div class="game">
    <span>{{ game }}</span>
    <button @click="deleteGame(game.key)">Delete</button>
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
      deleteGame(key) {
        this.$store.dispatch('deletegame', key)
        this.$router.push({ name: 'root' })
      }
    }
  }
</script>
