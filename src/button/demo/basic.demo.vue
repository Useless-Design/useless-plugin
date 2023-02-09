<markdown>
# 浮雕按钮
这种按钮的效果是在按钮的基础上添加了一个 `浮雕` 的效果，使按钮看起来更加立体。
</markdown>

<template>
  <UButton> <CashIcon />浮雕按钮 </UButton>
</template>

<script lang="ts">
import { CashOutline as CashIcon } from '@vicons/ionicons5'
import { defineComponent, h } from 'vue'

export default defineComponent({
  components: {
    CashIcon
  },
  setup () {
    return {
      renderIcon () {
        return h(CashIcon)
      }
    }
  }
})
</script>
