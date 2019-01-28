import AppStore from './app.store'
import GameStore from './game.store'

export default {
  ...AppStore,
  modules: {
    game: GameStore
  }
}
