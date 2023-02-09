import { marked } from 'marked'
import fse from 'fs-extra'
import createRenderer from './md-render'
import path from 'path'
import projectPath from '../utils/project-path'

const mdRenderer = createRenderer()

async function resolveDemoTitle (fileName, demoEntryPath) {
  const demoStr = await fse.readFile(
    path.resolve(projectPath, demoEntryPath, '..', fileName),
    'utf-8'
  )
  return demoStr.match(/# ([^\n]+)/)[1]
}

const cameLCase = (str) => {
  // 将 - . 小驼峰转换成首字母大写的大驼峰
  return str
    .replace(/-([a-z])/g, (all, letter) => {
      return letter.toUpperCase()
    })
    .replace(/\.([a-z])/g, (all, letter) => {
      return letter.toUpperCase()
    })
    .replace(/^[a-z]/, (s) => {
      return s.toUpperCase()
    })
}


function genAnchorTemplate (
  children,
  options = {
    ignoreGap: false
  }
) {
  return `
    <n-anchor
      internal-scrollable
      :bound="16"
      type="block"
      style="width: 192px; position: sticky; top: 32px; max-height: calc(100vh - 32px - 64px); height: auto;"
      offset-target="#doc-layout"
      :ignore-gap="${options.ignoreGap}"
    >
      ${children}
    </n-anchor>
  `
}


// 处理每一个demo.vue文件  将其转换成组件 比如 basic.demo.vue  转换成 <BasicDemo />
const resolveDemoInfos = async (demoInfos, relativeDir, env) => {
  // demoInfos 就是```demo ```中的文本，我们处理成数组
  const demoStr = demoInfos
    .split('\n')
    .map((item) => item.trim())
    .filter((id) => id.length)
  const demos = []
  // 处理md文件中的demo文件名 保持和真实文件名一致
  for (const demo of demoStr) {
    const debug = demo.includes('debug') || demo.includes('Debug')
    // 生产环境就不显示debug的demo
    if (env === 'production' && debug) continue
    let fileName
    if (demo.includes('.vue')) {
      fileName = demo.slice(0, -4) + '.demo.vue'
    } else {
      fileName = demo + '.demo.vue'
    }
    const componentName = `${cameLCase(demo)}Demo`
    demos.push({
      id: demo.replace(/\.demo|\.vue/g, ''),
      variable: componentName,
      fileName,
      title: await resolveDemoTitle(fileName, relativeDir),
      tag: `<${componentName} />`,
      debug
    })
  }
  return demos
}

function genDemosApiAnchorTemplate (tokens) {
  const api = [
    {
      id: 'API',
      title: 'API',
      debug: false
    }
  ]
  return api.concat(
    tokens
      .filter((token) => token.type === 'heading' && token.depth === 3)
      .map((token) => {
        return {
          id: token.text.replace(/ /g, '-'),
          title: token.text,
          debug: false
        }
      })
  )
}


// 生成文档页的锚点，快速定位到对应的位置 详情看naive的anchor文档： https://www.naiveui.com/zh-CN/os-theme/components/anchor
const genDemosAnchorTemplate = (demoInfos, hasApi, mdLayer) => {
  // 如果有api，就将api的锚点放在最后 否则就放在第一个
  const links = // 将demos的锚点和md文档中的h3标签的锚点合并
    (
      hasApi ? demoInfos.concat(genDemosApiAnchorTemplate(mdLayer)) : demoInfos
    ).map(
      ({ id, title }) => `<n-anchor-link
      title="${title}"
      href="#${id}"
    />`
    )
  // 注意 原文中有个v-if的判断displayMode，这里删除不作处理
  // 将锚点放在一个n-anchor组件中
  return genAnchorTemplate(links.join('\n'), {
    ignoreGap: hasApi
  })
}

// 将非组件说明文档的md文件进行转换
const genPageAnchorTemplate = (mdLayer) => {
  const titles = mdLayer
    .filter((md) => md.type === 'heading' && md.depth === 2)
    .map((md) => md.title)
  // 将标题转换成锚点
  const links = titles.map((title) => {
    const href = title.replace(/ /g, '-')
    return `<n-anchor-link title="${title}" href="#${href}" />`
  })
  return genAnchorTemplate(links.join('\n'), { ignoreGap: true })
}

function genDemosTemplate (demoInfos, colSpan) {
  return `<component-demos :span="${colSpan}">${demoInfos
    .map(({ tag }) => tag)
    .join('\n')}</component-demos>`
}


function genDocScript (demoInfos, components = [], url, forceShowAnchor) {
  const showAnchor = !!(demoInfos.length || forceShowAnchor)
  const importStmts = demoInfos
    .map(({ variable, fileName }) => `import ${variable} from './${fileName}'`)
    .concat(components.map(({ importStmt }) => importStmt))
    .join('\n')
  const componentStmts = demoInfos
    .map(({ variable }) => variable)
    .concat(components.map(({ ids }) => ids).flat())
    .join(',\n')
  const script = `<script>
${importStmts}
import { computed } from 'vue'
import { useMemo } from 'vooks'
import { useIsMobile } from '/demo/utils/composables'

export default {
  components: {
    ${componentStmts}
  },
  setup () {
    const isMobileRef = useIsMobile()
    const showAnchorRef = useMemo(() => {
      if (isMobileRef.value) return false
      return ${showAnchor}
    })
    const useSmallPaddingRef = isMobileRef
    return {
      showAnchor: showAnchorRef,
      wrapperStyle: computed(() => {
        return !useSmallPaddingRef.value
          ? 'display: flex; flex-wrap: nowrap; padding: 32px 24px 56px 56px;'
          : 'padding: 16px 16px 24px 16px;'
      }),
      contentStyle: computed(() => {
        return showAnchorRef.value
          ? 'width: calc(100% - 228px); margin-right: 36px;'
          : 'width: 100%; padding-right: 12px;'; 
      }),
      url: ${JSON.stringify(url)}
    }
  }
}
</script>`
  return script
}


const docLoader = async (code, relativeDir, env = 'development') => {
  const colSpan = ~code.search('<!--single-column-->') ? 1 : 2
  const forceShowAnchor = !!~code.search('<!--anchor:on-->')
  const hasApi = !!~code.search('## API')

  const mdLayer = marked.lexer(code)

  // 获取组件的代码  比如md文件中引入了一些第三方的组件  就使用这里的代码
  const componentsIndex = mdLayer.findIndex(
    (item) => item.type === 'code' && item.lang === 'component'
  )
  let components = []
  if (~componentsIndex) {
    // mdLayer[componentsIndex].text : NButton: import { Button } from 'naive-ui'
    components = mdLayer[componentsIndex].text
      .split('\n')
      .map((component) => {
        const [compName, importCode] = component.split(':')
        if (!compName.trim()) throw new Error('没有组件名')
        if (!importCode.trim()) throw new Error('没有组件资源地址')
        return {
          compName: compName.split(',').map((item) => item.trim()),
          importCode
        }
      })
      .filter(({ compName, importCode }) => compName && importCode) // 过滤掉空的
  }

  // 处理标题  并添加在github中编辑的功能
  const titleIndex = mdLayer.findIndex(
    (item) => item.type === 'heading' && item.depth === 1
  )
  if (~titleIndex) {
    const title = mdLayer[titleIndex].text
    const btnTemplate =
      `<edit-on-github-header :relative-url="url" text=${title}></edit-on-github-header>`
    mdLayer.splice(titleIndex, 1, {
      type: 'html',
      pre: false,
      text: btnTemplate
    })
  }

  // 处理demo 并移除在生产中的打包构建
  const demoIndex = mdLayer.findIndex(
    (item) => item.type === 'code' && item.lang === 'demo'
  )
  let demoInfos = []
  if (~demoIndex) {
    demoInfos = await resolveDemoInfos(
      mdLayer[demoIndex].text,
      relativeDir,
      env,
    )
    mdLayer.splice(demoIndex, 1, {
      type: 'html',
      pre: false,
      text: genDemosTemplate(demoInfos, colSpan)
    })
  }

  const docMainTemplate = marked.parser(mdLayer, {
    renderer: mdRenderer,
    gfm: true
  })
  // 生成文档的模板
  const docTemplate = `
    <template>
      <div
        class="doc"
        :style="wrapperStyle"
      >
        <div :style="contentStyle">
          ${docMainTemplate}
        </div>
        <div style="width: 192px;" v-if="showAnchor">
          ${
            demoInfos.length
              ? genDemosAnchorTemplate(demoInfos, hasApi, mdLayer)
              : genPageAnchorTemplate(mdLayer)
          }
        </div>
      </div>
    </template>`
  
  const docScript = genDocScript(
    demoInfos,
    components,
    relativeDir,
    forceShowAnchor,
  )
  return `${docTemplate}\n\n${docScript}`
}

export default docLoader
