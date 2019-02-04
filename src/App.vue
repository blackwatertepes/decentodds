<template>
  <div id="app">
    <router-link :to="{ name: 'root' }">Home</router-link>
    <router-view></router-view>
    <span>{{ random }}</span>
    <GameTable></GameTable>
  </div>
</template>

<script>
  import Ipfs from '../node_modules/ipfs/dist'
  import GameTable from './components/GameTable.vue'

  export default {
    name: 'app',
    components: {
      GameTable
    },
    computed: {
      privateKey() { return this.$store.state.privateKey },
      publicKey() { return this.$store.getters.publicKey },
      random() { return Math.random() * Number.MAX_SAFE_INTEGER ^ ((new Date()).getMilliseconds() / 1000 * Number.MAX_SAFE_INTEGER) }
    },
    mounted: function() {
      console.log("App Mounted!")

      this.$store.dispatch('refreshGames')

      const ipfs = window.ipfs = new Ipfs()
      ipfs.on('ready', async () => {
        console.log("IPFS Ready!")
        this.$store.commit('setIpfs', { ipfs })
      })
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
  }
  button {
    padding: 3px;
  }
</style>
