import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Bets from '../../src/components/Bets'

const localVue = createLocalVue()

localVue.use(Vuex)
localVue.use(VueRouter)

describe('Bets', () => {
  test('is a Vue instance', () => {
    const router = new VueRouter()
    let store = new Vuex.Store({
      state: {
        game: {
          bets: []
        }
      },
      actions: {
        refreshBets: jest.fn()
      }
    })
    const wrapper = shallowMount(Bets, { store, router, localVue })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
