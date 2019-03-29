<template>
  {{ el }}
</template>

<script>
  import Deck from 'deck-of-cards'

  export default {
    name: 'GameTable',
    props: {
    },
    computed: {
    },
    mounted: function() {
      let $container = document.getElementsByClassName('player-table')

      // create Deck
      let deck = window.deck = Deck()

      // add to DOM
      let el = "<div></div>";
      deck.mount(el)

      deck.fan()
      deck.flip()
    },
    watch: {
      // cards: function(cards) {
      //   let idx = 1;
      //   for (let card of cards) {
      //     window.deck.cards[card.position].animateTo({ x: 200 * idx, y: 0 });
      //     idx++;
      //   }
      // }
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
