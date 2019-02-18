<template>
  <div class="game">
    <h4>{{ game }}</h4>
    <button @click="deleteGame(game.key)">Delete</button>
    <button @click="blowupgame(game.key)">Blowup</button>
    <br />
    <button @click="bet(game.key)">Bet</button>
    <Bets />
    <div id="cards">
      <h2>Cards: {{ cards.length }}</h2>
      <ul id="cards-list">
        <li v-for="(card, idx) in cards" :key="idx">
          {{ card }}
        </li>
      </ul>
    </div>
    <GameTable />
  </div>
</template>

<script>
  import GameTable from './GameTable.vue'
  import Bets from './Bets.vue'

  export default {
    name: 'Game',
    components: {
      GameTable,
      Bets
    },
    computed: {
      game () {
        const { id } = this.$route.params
        return this.$store.state.game.games.find((game) => {
          return game.key == id
        })
      },
      cards () {
        return this.$store.getters.cards;
      }
    },
    mounted: function() {
      console.log("Game mounted!");
      //const { id } = this.$route.params
    },
    methods: {
      bet(key) {
        this.$store.dispatch('bet', key)
      },
      blowupgame(key) {
        this.$store.dispatch('blowupgame', key)
        this.$router.push({ name: 'root' })
      },
      deletegame(key) {
        this.$store.dispatch('deletegame', key)
        this.$router.push({ name: 'root' })
      }
    }
  }
</script>
