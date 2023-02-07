import { createPinia } from 'pinia'
import { App } from 'vue'
import { SystemStore } from './modules/system'

const store = createPinia()

const setupStore = (app: App): void => {
  app.use(store)
}

export { store }

export const useSystemStore = () => SystemStore(store)

export default setupStore
