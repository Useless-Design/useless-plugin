<template>
  <n-layout
    id="doc-layout"
    :style="{
      height: '100vh',
    }"
    has-sider
  >
    <layout-header />
    <n-layout position="absolute" style="top: 64px" has-sider>
      <n-layout-sider
        :native-scrollbar="false"
        :collapsed-width="0"
        collapse-mode="transform"
        trigger-style="top: 240px;"
        collapsed-trigger-style="top: 240px; right: -20px;"
        bordered
        show-trigger="arrow-circle"
      >
        <n-menu
          :value="menuValue"
          :options="componentOptions"
          :render-label="renderMenuLabel"
        />
      </n-layout-sider>
      <n-layout :native-scrollbar="false">
        <router-view />
        <layout-footer />
      </n-layout>
    </n-layout>
  </n-layout>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import {
  createComponentMenuOptions,
  findMenuValue,
  renderMenuLabel
} from '../utils/route'
import { useRoute } from 'vue-router'
import LayoutFooter from './SiteFooter.vue'
import LayoutHeader from './SiteHeader.vue'
import { useSystemStore } from '../store'

const { locale } = useSystemStore()
const route = useRoute()
const componentOptions = createComponentMenuOptions({
  lang: locale,
  theme: 'dark',
  mode: 'debug'
})
const menuValue = computed(() => {
  return findMenuValue(componentOptions, route.path)
})
</script>
