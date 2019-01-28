<template>
  <div id="app">
    <Games />
  </div>
</template>

<script>
  import Ipfs from '../node_modules/ipfs/dist'
  import Deck from 'deck-of-cards'
  import Games from './components/Games.vue'

  export default {
    name: 'app',
    components: {
      Games
    },
    computed: {
      privateKey() { return this.$store.state.privateKey },
      publicKey() { return this.$store.getters.publicKey }
    },
    mounted: function() {
      console.log("App Mounted!")

      const ipfs = window.ipfs = new Ipfs()
      ipfs.on('ready', async () => {
        console.log("IPFS Ready!")
        this.$store.commit('setIpfs', ipfs)
      })

      let $container = document.getElementById('container')

      // create Deck
      let deck = window.deck = Deck()

      // add to DOM
      deck.mount($container)

      deck.fan()
      deck.flip()
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 350px;
  }
  #container {
    top: 200px;
  }
  button {
    padding: 3px;
  }
</style>
