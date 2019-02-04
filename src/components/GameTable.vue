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

      deck.cards[0].x = 600;
      deck.cards[0].y = 400;

      deck.fan()
      deck.flip()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #game-table {
    position: fixed;
    top: calc(50% + 1.5em);
    left: 50%;
  }
</style>
