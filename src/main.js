import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import AppStore from './store/App.store'

Vue.use(Vuex)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store: new Vuex.Store(AppStore)
}).$mount('#app')
