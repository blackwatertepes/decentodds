<template>
  <div id="bets">
    <h2>Open Bets: {{ bets.length }}</h2>
    <ul id="bets-list">
      <li v-for="(bet, idx) in bets" :key="idx">
        {{ bet }}
        <button @click="unbet(bet.key)">Unbet</button>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'Bets',
    computed: {
      bets() { return this.$store.state.game.bets }
    },
    mounted: function() {
      const { id } = this.$route.params
      this.$store.dispatch('refreshBets', id)
    },
    methods: {
      unbet(key) {
        this.$store.dispatch('unbet', key)
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
