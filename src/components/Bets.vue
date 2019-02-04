<template>
  <div id="bets">
    <h2>Open Bets: {{ bets.length }}</h2>
    <ul id="bets-list">
      <li v-for="(bet, idx) in bets" :key="idx">
        {{ bet }}
        <button @click="paybet(bet.key)">Paybet</button>
        <button @click="unbet(bet.key)">Unbet</button>
        <button @click="acceptbet(bet.key)">Accept</button>
        <button @click="reveal(bet.key)">Reveal</button>
        <button @click="askpayout(bet.key)">Ask</button>
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
      acceptbet(key) {
        this.$store.dispatch('acceptbet', key)
      },
      askpayout(key) {
        this.$store.dispatch('askpayout', key)
      },
      reveal(key) {
        this.$store.dispatch('reveal', key)
      },
      unbet(key) {
        this.$store.dispatch('unbet', key)
      },
      paybet(key) {
        this.$store.dispatch('paybet', key)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
