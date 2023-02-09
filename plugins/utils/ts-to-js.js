const { transformSync } = require('esbuild')

const tsToJs = (content) => {
  if (!content) {
    return ''
  }
  // 注意这里，因为esbuild会把空行给去掉，所以这里先把空行替换成__blankline，然后再替换回来
  const beforeTransformContent = content.replace(
    /\n(\s)*\n/g,
    '\n__blankline\n'
  )
  const { code } = transformSync(beforeTransformContent, {
    loader: 'ts',
    minify: false,
    minifyWhitespace: false,
    charset: 'utf8'
  })
  
  return code.trim().replace(/__blankline;/g, '')
}

export default tsToJs
