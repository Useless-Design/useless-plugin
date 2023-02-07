# zh-CN: 按钮, en-US: Button

zh-CN: 按钮用来触发一些操作; en-US: Buttons are used to trigger some operations;

## zh-CN: 演示; en-US: Demo

```demo
basic.vue
```

## API

### Button Props

| Name | Type | Default | Description | Vision |
| --- | --- | --- | --- | --- |
| attr-type | `'button' \| 'submit' \| 'reset'` | `'button'` | zh-CN:按钮的 DOM 的 `type` 属性;en-US:The `type` attribute of the button's DOM |  |

### ButtonGroup Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| vertical | `boolean` | `false` | zh-CN: 组内按钮的排列方式; en-US: Arrangement of buttons in the group |

### Button Slots

| Name    | Default | Description                              |
| ------- | ------- | ---------------------------------------- |
| default | `()`    | zh-CN: 按钮的内容; en-US: Button content |
