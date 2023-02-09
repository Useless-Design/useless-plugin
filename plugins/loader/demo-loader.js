
import { vueToDemo, mdToDemo } from './demo-render'
import projectPath from '../utils/project-path' // 获取项目根目录

// demo文件解析
const demoLoader = (code, id, type) => {
  // 获取相对路径 用于生成codesandbox、github链接等 输出为：src/button/demo/xxx.demo.vue
  const relativeUrl = id.replace(projectPath + '/', '')

  if (type === 'vue') {
    return vueToDemo(code, {
      relativeUrl,
      resourcePath: id,
      isVue: true
    })
  }
  return mdToDemo(code, {
    relativeUrl,
    resourcePath: id,
    isVue: false
  })
}

export default demoLoader
