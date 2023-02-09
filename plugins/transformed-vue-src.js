import demoLoader from './loader/demo-loader'
import docLoader from './loader/doc-loader'

const targetTransformedVueSrc = async (code, path) => {
  // 解析demo.vue
  if (path.endsWith('.demo.md') || path.endsWith('.demo.vue')) {
    const type = path.endsWith('.vue') ? 'vue' : 'md'
    return demoLoader(code, path, type)
  } else if (path.endsWith('.md')) {
    // 解析 入口的md文件
    return docLoader(code, path)
  }
}

export default targetTransformedVueSrc
