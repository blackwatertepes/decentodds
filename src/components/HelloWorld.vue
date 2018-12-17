<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div id="dealer" class="person">
      <h2>Dealer</h2>
      <label>ID:</label>
      <input value="123" />
      <button>Deal</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
