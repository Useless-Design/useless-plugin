import ComponentDemo from './utils/ComponentDemo.vue'
import ComponentDemos from './utils/ComponentDemos'
import EditOnGithubHeader from './utils/EditOnGithubHeader.vue'
import useless from 'useless-ui'
import './styles/demo.css'
import 'vfonts/Inter.css'
import 'vfonts/FiraCode.css'
import 'katex/dist/katex.css'

export function installDemoComponents(app) {
  app.use(useless)
  app.component('ComponentDemo', ComponentDemo)
  app.component('ComponentDemos', ComponentDemos)
  app.component('EditOnGithubHeader', EditOnGithubHeader)
}
