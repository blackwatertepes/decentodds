<template>
  <div class="games">
    <h1>Active Games: {{ games.length }}</h1>
    <button v-on:click="addGame">Start new game</button>
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
