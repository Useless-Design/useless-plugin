
<template>
  <component :is=" configProvider " class="demo" namespace="naive-ui-doc" preflight-style-disabled :hljs=" hljs ">
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </component>
</template>
<script setup lang="ts">
import hljs from './utils/hljs'
import { NConfigProvider } from 'naive-ui'

const configProvider = NConfigProvider

</script>
