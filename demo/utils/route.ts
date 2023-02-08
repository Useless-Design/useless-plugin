import { h } from 'vue'
import { RouterLink } from 'vue-router'

export interface IMenuOption {
  type?: 'group' | 'item'
  key?: string
  count?: number
  label: string
  path?: string
  enSuffix?: boolean
  children?: IMenuOption[]
}

export function findMenuValue (options: IMenuOption[], path: string): string | undefined {
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

export const renderMenuLabel = (option: IMenuOption) => {
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

const appendCounts = (item: IMenuOption) => {
  if (!item.children) {
    item.count = 1
    return item
  } else {
    item.children.forEach(appendCounts)
    item.count = item.children.reduce((sum, item) => sum + (item.count ?? 0), 0)
    if (item.type === 'group') {
      item.label += ` (${item.count})`
    }
    return item
  }
}

function createItems (prefix: string, items: IMenuOption[]) {
  return items.map((rawItem) => {
    const item = {
      ...rawItem,
      key: rawItem.label,
      label: rawItem.label,
      extra: rawItem.enSuffix ? rawItem.label : undefined,
      path: rawItem.path ? prefix + rawItem.path : undefined
    }
    if (rawItem.children) {
      item.children = createItems(prefix, rawItem.children)
    }
    return item
  })
}

export function createComponentMenuOptions () {
  return createItems('/components', [
    appendCounts({
      label: '拟态组件',
      type: 'group',
      children: [
        {
          label: '按钮',
          enSuffix: true,
          path: '/relief-button'
        }
      ]
    })
  ])
}
