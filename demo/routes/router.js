import { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useSystemStore } from '../store'
import routes from './routes'

const { setLocale } = useSystemStore()

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const { lang } = to.params
  setLocale(lang as string)
  next()
})

const setupRouter = (app: App): void => {
  app.use(router)
}

export default setupRouter
