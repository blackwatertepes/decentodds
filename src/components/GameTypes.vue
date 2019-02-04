<template>
  <div id="games-types">
    <ul id="game-types-list">
      <li v-for="({ id:gametype, name:game }, idx) in gameTypes" :key="idx">
        <router-link :to="{ name: 'gametype', params: { gametype } }">{{ game }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'GameTypes',
    computed: {
      gameTypes() { return this.$store.state.gameTypes },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
