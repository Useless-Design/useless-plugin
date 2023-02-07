import { h } from 'vue'
import { RouterLink } from 'vue-router'

export function findMenuValue (options, path) {
  for (const option of options) {
    if (option.children) {
      const value = findMenuValue(option.children, path)
      if (value) return value
    }
    if (option.path === path) {
      return option.key
    }
  }
  return undefined
}

export const renderMenuLabel = (option) => {
  if (!('path' in option) || option.label === '--Debug') {
    return option.label
  }
  return h(
    RouterLink,
    {
      to: option.path
    },
    { default: () => option.label }
  )
}

const appendCounts = (item) => {
  if (!item.children) {
    item.count = 1
    return item
  }
  if (item.children) {
    item.children.forEach(appendCounts)
    item.count = item.children.reduce((sum, item) => sum + item.count, 0)
    if (item.type === 'group') {
      item.en += ` (${item.count})`
      item.zh += ` (${item.count})`
    }
    return item
  }
}

function createItems (lang, theme, prefix, items) {
  const isZh = lang === 'zh-CN'
  const langKey = isZh ? 'zh' : 'en'
  return items.map((rawItem) => {
    const item = {
      ...rawItem,
      key: rawItem.en,
      label: rawItem[langKey] || rawItem.en,
      extra: rawItem.enSuffix && isZh ? rawItem.en : undefined,
      path: rawItem.path ? prefix + rawItem.path : undefined
      // path: rawItem.path
      //   ? `/${lang}/${theme}` + prefix + rawItem.path
      //   : undefined
    }
    if (rawItem.children) {
      item.children = createItems(lang, theme, prefix, rawItem.children)
    }
    return item
  })
}

export function createComponentMenuOptions ({ lang, theme, mode }) {
  return createItems(lang, theme, '/components', [
    appendCounts({
      zh: '拟态组件',
      en: 'Common Components',
      type: 'group',
      children: [
        {
          en: 'Button',
          zh: '按钮',
          enSuffix: true,
          path: '/relief-button'
        },
        {
          en: 'Clock',
          zh: '时钟',
          enSuffix: true,
          path: '/clock'
        }
      ]
    })
    // appendCounts({
    //   zh: '废弃的组件',
    //   en: 'Deprecated Components',
    //   type: 'group',
    //   children: [
    //     {
    //       en: 'Legacy Transfer',
    //       zh: '旧版穿梭框',
    //       enSuffix: true,
    //       path: '/legacy-transfer'
    //     }
    //   ]
    // })
  ])
}
