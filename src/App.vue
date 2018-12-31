<template>
  <div id="app">
    <h2>Private Key: {{ privateKey }}</h2>
    <h2>Public Key: {{ publicKey }}</h2>
    <img alt="Vue logo" src="./assets/logo.png">
    <Games />
  </div>
</template>

<script>
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
    this.$store.dispatch('createPrivateKey')
    const ipfs = new window.Ipfs()
    ipfs.on('ready', async () => {
      this.$store.commit('setIpfs', ipfs)
      this.$store.dispatch('loadGames')
    })
  }
}

// IPFS...
const ipfs = new window.Ipfs({
  //repo: 'com/wargoats/' + Math.random(),
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
      ]
    }
  }
})
ipfs.on('ready', async () => {
  console.log("IPFS Ready!");

  /*
  // Load/Create a private public key pair...
  let ecc = eosjs_ecc
  const privateKey = await ecc.randomKey()
  console.log("privateKey:", privateKey)
  const publicKey = ecc.privateToPublic(privateKey)
  console.log("publicKey:", publicKey)

  // Generate a random number, with proof...
  const random = Math.random().toString()
  const signature = ecc.sign(random, privateKey);
  console.log("Signature:", signature)

  // Verify the signature/proof...
  const verified = ecc.verify(signature, random, publicKey)
  console.log("Verified:", verified)

  let game = {
    publicKey,
    signature
  }
  let content = ipfs.types.Buffer.from(game.toString());
  let results = await ipfs.files.add(content);
  let hash = results[0].hash; // "Qm...WW"
  console.log("Game Saved to address:", hash)

  ipfs.files.get(hash, function (err, files) {
    files.forEach((file) => {
      //console.log("Pulled from address:", file.path)
      //console.log(file.content.toString('utf8'))
    })
  })
  */
})

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
