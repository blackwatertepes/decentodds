<template>
  <div id="bets">
    <h2>Open Bets: {{ bets.length }}</h2>
    <ul id="bets-list">
      <li v-for="(bet, idx) in bets" :key="idx">
        {{ bet }}
      </li>
    </ul>
  </div>
</template>

<script>
  import ecc from 'eosjs-ecc';

  export default {
    name: 'Bets',
    computed: {
      bets() { return this.$store.state.game.bets }
    },
    mounted: function() {
      const { id } = this.$route.params
      this.$store.dispatch('updateBets', id)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
