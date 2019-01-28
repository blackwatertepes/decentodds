<template>
  <li class="game">
    <span>{{ game }}</span>
    <button @click="deleteGame(game.key)">
      Delete
    </button>
  </li>
</template>

<script>
  export default {
    name: 'Game',
    props: ['game'],
    computed: {
    },
    mounted: function() {
    },
    methods: {
      deleteGame(key) {
        this.$store.dispatch('deletegame', key);
      }
    }
  }
</script>
