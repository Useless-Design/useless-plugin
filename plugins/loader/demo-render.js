// ./plugins/utils/demo-render.js
import { marked } from 'marked'
import handleMergeCode from '../utils/handle-merge-code'
import createRender from './md-render'
import fs from 'fs'
import path from 'path'

const mdRenderer = createRender()
const __HTTP__ = process.env.NODE_ENV !== 'production' ? 'http' : 'https'
const demoBlock = fs
  .readFileSync(path.resolve(__dirname, 'ComponentDemoTemplate.vue'))
  .toString()

// 解析demo文件的文本，生成ComponentDemo组件的props对象
function getPartsOfDemo (text) {
  // 获取template、script、style、markdown等数据
  const template = text.match(/<template>([\s\S]*?)<\/template>/)?.[1]
  const script = text.match(/<script.*?>([\s\S]*?)<\/script>/)?.[1]
  const style = text.match(/<style>([\s\S]*?)<\/style>/)?.[1]
  const markdownText = text.match(/<markdown>([\s\S]*?)<\/markdown>/)?.[1]
  // 获取markdown文本中的h1标题作为demo标题 将其他内容作为content进行解析
  const tokens = marked.lexer(markdownText)
  const contentTokens = []
  let title = ''
  for (const token of tokens) {
    if (token.type === 'heading' && token.depth === 1) {
      title = token.text
    } else {
      contentTokens.push(token)
    }
  }
  const languageType = text.includes('lang="ts"') ? 'ts' : 'js'
  return {
    template,
    script,
    style,
    title,
    content: marked.parser(contentTokens, {
      renderer: mdRenderer
    }),
    language: languageType
  }
}

function getPartsOfDemoForMd (tokens) {
  let template = null
  let script = null
  let style = null
  let title = null
  const contentTokens = []
  contentTokens.links = tokens.links
  let languageType = 'js'
  for (const token of tokens) {
    if (token.type === 'heading' && token.depth === 1) {
      title = token.text
    } else if (
      token.type === 'code' &&
      (token.lang === 'template' || token.lang === 'html')
    ) {
      template = token.text
    } else if (
      token.type === 'code' &&
      (token.lang === 'script' || token.lang === 'js' || token.lang === 'ts')
    ) {
      languageType = token.lang
      script = token.text
    } else if (
      token.type === 'code' &&
      (token.lang === 'style' || token.lang === 'css')
    ) {
      style = token.text
    } else {
      contentTokens.push(token)
    }
  }
  return {
    template,
    script,
    style,
    title,
    content: marked.parser(contentTokens, {
      renderer: mdRenderer
    }),
    language: languageType
  }
}

// 插入jsCode、tsCode
const mergeParts = ({ parts, isVue }) => {
  const mergedParts = { ...parts }
  mergedParts.tsCode = ''
  mergedParts.jsCode = ''
  // 因为需要手动加上template script style等标签，还需要将ts->js，单独把函数提取出来
  handleMergeCode({ parts, mergedParts, isVue })
  // encodeURIComponent 函数可把字符串作为 URI 组件进行编码。
  mergedParts.tsCode = encodeURIComponent(mergedParts.tsCode.trim())
  mergedParts.jsCode = encodeURIComponent(mergedParts.jsCode.trim())
  return mergedParts
}

// 获取文件名
function getFileName (resourcePath) {
  const dirs = resourcePath.split('/')
  const fileNameWithExtension = dirs[dirs.length - 1]
  return [fileNameWithExtension.split('.')[0], fileNameWithExtension]
}

const genVueComponent = (parts, fileName, relativeUrl) => {
  const demoFileNameReg = /<!--DEMO_FILE_NAME-->/g
  const relativeUrlReg = /<!--URL-->/g
  const titleReg = /<!--TITLE_SLOT-->/g
  const contentReg = /<!--CONTENT_SLOT-->/
  const tsCodeReg = /<!--TS_CODE_SLOT-->/
  const jsCodeReg = /<!--JS_CODE_SLOT-->/
  const scriptReg = /<!--SCRIPT_SLOT-->/
  const styleReg = /<!--STYLE_SLOT-->/
  const demoReg = /<!--DEMO_SLOT-->/
  const languageTypeReg = /<!--LANGUAGE_TYPE_SLOT-->/
  let src = demoBlock
  src = src.replace(demoFileNameReg, fileName)
  src = src.replace(relativeUrlReg, relativeUrl)
  if (parts.content) {
    src = src.replace(contentReg, parts.content)
  }
  if (parts.title) {
    src = src.replace(titleReg, parts.title)
  }
  if (parts.tsCode) {
    src = src.replace(tsCodeReg, parts.tsCode)
  }
  if (parts.jsCode) {
    src = src.replace(jsCodeReg, parts.jsCode)
  }
  if (parts.script) {
    const startScriptTag =
      parts.language === 'ts' ? '<script lang="ts">\n' : '<script>\n'
    src = src.replace(scriptReg, startScriptTag + parts.script + '\n</script>')
  }
  if (parts.language) {
    src = src.replace(languageTypeReg, parts.language)
  }
  if (parts.style) {
    const style = genStyle(parts.style)
    if (style !== null) {
      src = src.replace(styleReg, style)
    }
  }
  if (parts.template) {
    src = src.replace(demoReg, parts.template)
  }
  if (/__HTTP__/.test(src)) {
    src = src.replace(/__HTTP__/g, __HTTP__)
  }
  return src.trim()
}


export const vueToDemo = (
  code,
  { resourcePath, relativeUrl, isVue = true }
) => {
  const parts = getPartsOfDemo(code)
  const mergedParts = mergeParts({ parts, isVue })
  const [fileName] = getFileName(resourcePath)
  return genVueComponent(mergedParts, fileName, relativeUrl)
}

export const mdToDemo = (code, { resourcePath, relativeUrl, isVue = false }) => {
  const tokens = marked.lexer(text) // 将markdown文本解析成tokens 
  const parts = getPartsOfDemoForMd(tokens)
  const mergedParts = mergeParts({ parts, isVue })
  const [fileName] = getFileName(resourcePath)
  return genVueComponent(mergedParts, fileName, relativeUrl)
}
