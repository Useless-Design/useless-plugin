---
theme: cyanosis
highlight: atom-one-dark
---
# Naive UI Doc

## 前言

前面两篇我们对`Vite`插件的开发有了一个大致的了解，这篇我们从零开始，一步步实现`Naive UI`组件库说明文档的`Vite`插件。
- [从Naive UI项目上学习Vite Plugin的使用](https://juejin.cn/post/7195094900482768956)
- [Vue3项目如何通过自定义的Vite Plugin实现路由加载md文件](https://juejin.cn/post/7196915437808074809)

### 项目初始化

#### 项目依赖

- highlight.js `代码高亮`
- pinia `Vue的状态管理库`
- vue-router `Vue的路由`

#### 开发依赖

- marked `markdown解析器`
- naive-ui `组件库`
- unplugin-vue-components `vite插件 自动加载naive ui组件`
- eslint 
- prettier
- @vicons/ionicons5 `图标库 纯粹的测试用  可以不安装`
- fs-extra `文件操作库`
- deepmerge `对象合并库`
- codesandbox `代码沙箱`
- typescript
- eslint-plugin-markdown  `eslint markdown的规则插件`

#### 依赖安装

```bash
pnpm i highlight.js pinia vue-router -S

pnpm i marked naive-ui unplugin-vue-components eslint prettier @vicons/ionicons5 fs-extra deepmerge codesandbox typescript -D
```

#### 配置eslint和tsconfig

```bash
# 初始化tsconfig.json
npx tsc --init 

# 如下图处理即可
npm init @eslint/config

✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · none
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · browser, node
✔ How would you like to define a style for your project? · guide
✔ Which style guide do you want to follow? · standard-with-typescript
✔ What format do you want your config file to be in? · JavaScript
Checking peerDependencies of eslint-config-standard-with-typescript@latest
✔ The style guide "standard-with-typescript" requires eslint@^8.0.1. You are currently using eslint@7.32.0.
  Do you want to upgrade? · No / Yes
```

配置简单的eslint规则后还不够，需要针对每种文件类型的规则进行配置。详细配置如下：

```js
// .eslintrc.js
const path = require('path')

module.exports = {
  extends: ['plugin:markdown/recommended', 'prettier'],
  parserOptions: {
    project: ['./tsconfig.json', './commitlint.config.js']
  },
  overrides: [
    {
      files: '*.vue',
      extends: [
        '@vue/typescript/recommended',
        'plugin:vue/vue3-recommended',
        '@vue/typescript'
      ]
    },
    {
      files: ['*.vue', '*.js'],
      extends: ['plugin:vue/essential', '@vue/standard'],
      rules: {
        'vue/multiline-html-element-content-newline': 0,
        'vue/multi-word-component-names': 0,
        'vue/max-attributes-per-line': [
          2,
          {
            singleline: 20,
            multiline: 1
          }
        ],
        'vue/require-default-prop': 0,
        'vue/no-multiple-template-root': 0,
        'vue/no-lone-template': 0,
        'vue/no-v-model-argument': 0,
        'vue/one-component-per-file': 0,
        'import/no-cycle': 1
      }
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: ['standard-with-typescript', 'plugin:import/typescript'],
      parserOptions: {
        project: path.join(__dirname, './tsconfig.json'),
        ecmaFeatures: {
          jsx: true
        }
      },
      rules: {
        '@typescript-eslint/strict-boolean-expressions': 0,
        '@typescript-eslint/prefer-nullish-coalescing': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/naming-convention': 0,
        'multiline-ternary': 0,
        'no-void': 0,
        'import/no-cycle': 1
      }
    },
    {
      files: ['*.md'],
      processor: 'markdown/markdown',
      rules: {
        'MD025/single-title/single-h1': 0
      }
    },
    {
      files: '*',
      globals: {
        __DEV__: 'readonly'
      }
    }
  ]
}

```

tsconfig.json配置也需要处理，初始化的tsconfig不易阅读，我们可以全部删除，贴上以下代码：

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "jsx": "preserve",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
    "noImplicitAny": true,
    "noUnusedLocals": false,
    "module": "ES6",
    "moduleResolution": "Node",
    "declaration": true,
    "forceConsistentCasingInFileNames": true,
    "composite": true,
    "target": "ES6",
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"]
  },
  "exclude": ["node_modules","dist"]
}
```

至此，eslint和tsconfig配置完成。

### 文件目录初始化

首先我们先将目录进行设计，主要的目录就是`demo`和`src`,`demo`是文档站点，`src`用于存放组件的代码。

```bash
|-- demo
|   |-- App.vue
|   |-- main.js
|   |-- router
|   |   |-- index.js
|   |   |-- routes.js
|   |-- layout
|   |   |-- BasicLayout.vue # 基础布局
|   |   |-- SiteFooter.vue # 底部
|   |   |-- SiteHeader.vue # 头部
|   |-- pages
|   |   |-- Home.vue
|   |-- utils
|   |   |-- codesandbox.js # 代码沙箱配置 如果组件没有发布 可以不需要配置 本文也不做重点
|   |   |-- composables.js # 公共方法
|   |   |-- ComponentDemo.vue # 演示组件
|   |   |-- ComponentDemos.tsx # 包裹所有演示组件的父级组件
|   |   |-- CopyCodeButton.tsx # 复制代码按钮
|   |   |-- EditInCodeSandboxButton.tsx # 代码沙盒编辑按钮
|   |   |-- EditOnGithubButton.tsx # 去github编辑的按钮 直接定位到github的对应demo文件
|   |   |-- EditOnGithubHeader.tsx # 去github编辑文档标题的按钮
|   |   |-- github-url.js # github地址配置
|   |   |-- hljs.js # 代码高亮配置
|   |   |-- route.js # 路由相关的函数，提供生成左侧菜单的工具函数
|-- src
|   |-- index.ts # 组件库入口 也是打包的入口
|   |-- components.ts # 组件库的所有组件
|   |-- button
|   |   |-- index.ts # 组件入口
|   |   |-- src
|   |   |   |-- Button.tsx # 组件源码
|   |   |-- demos
|   |   |   |-- basic.demo.vue # 演示组件
|   |   |   |-- index.demo-entry.md # 演示组件的文档
.... # 还有一些test、style等目录 本文不做关注
```

可以直接克隆这里的代码，获取干净的目录结构。(实际上`Naive UI`的站点更加复杂，因为还包括了主题切换、国际化、编辑器等等)
