const componentRoutes = [
  {
    path: 'relief-button',
    name: 'relief-button',
    component: async () =>
      await import('../../src/button/demo/index.demo-entry.md')
  }
]

const routes = [
  {
    name: 'home',
    path: '/:lang',
    component: async () => await import('../pages/index.vue')
  },
  {
    name: 'components',
    path: '/:lang/components',
    component: async () => await import('../layout/BasicLayout.vue'),
    children: componentRoutes
  },
  {
    name: 'not-found',
    path: '/:pathMatch(.*)*',
    redirect: {
      name: 'home',
      params: {
        lang: navigator.language,
        theme: 'os-theme'
      }
    }
  }
]

export default routes
