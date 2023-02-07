import { defineStore } from 'pinia'

export const SystemStore = defineStore('System', {
  state: () => ({
    theme: 'dark',
    locale: ''
  }),
  actions: {
    getTheme () {
      this.theme = ''
    },
    setLocale (locale: string) {
      this.locale = locale
    }
  }
})
