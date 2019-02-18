<template>
  <div id="game-table">
  </div>
</template>

<script>
  import Deck from 'deck-of-cards'

  export default {
    name: 'GameTable',
    computed: {
    },
    mounted: function() {
      let $container = document.getElementById('game-table')

      // create Deck
      let deck = window.deck = Deck()

      // add to DOM
      deck.mount($container)

      deck.fan()
      deck.flip()

      let idx = 1;
      for (let card of this.$store.getters.cards) {
        deck.cards[card.rank].animateTo({ x: 200 * idx, y: 0 });
        idx++;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #game-table {
    position: fixed;
    top: calc(70% + 1.5em);
    left: 50%;
  }
</style>
