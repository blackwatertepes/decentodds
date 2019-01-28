import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App.vue'
import Games from './components/Games.vue'
import Game from './components/Game.vue'
import Store from './store'

Vue.use(Vuex)
Vue.use(VueRouter)

Vue.config.productionTip = false

const router = new VueRouter({
  routes: [
    { path: '/', component: Games, name: 'root' },
    { path: '/game/:id', component: Game, name: 'game' }
  ]
})

new Vue({
  render: h => h(App),
  router,
  store: new Vuex.Store(Store)
}).$mount('#app')
