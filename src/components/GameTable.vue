<template>
  <div id="game-table">
    <ul id="players-list">
      <li v-for="(hand, idx) in hands" :key="idx">
        <Player v-bind:cards="hand" />
      </li>
    </ul>
  </div>
</template>

<script>
  import Player from './Player.vue'

  export default {
    name: 'GameTable',
    components: {
      Player,
    },
    props: {
      cards: Array,
    },
    computed: {
      hands() {
        return [
          { rank: 1, rankName: 'ace', suit: 0, suitName: 'spade', position: 0 },
          { rank: 11, rankName: 'jack', suit: 1, suitName: 'heart', position: 22 }
        ]
      }
    },
    mounted: function() {
    },
    watch: {
      cards: function(cards) {
        let idx = 1;
        for (let card of cards) {
          window.deck.cards[card.position].animateTo({ x: 200 * idx, y: 0 });
          idx++;
        }
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
