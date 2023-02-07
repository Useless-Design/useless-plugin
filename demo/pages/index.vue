<template>
  <n-layout
    :style="{
      height: '100vh',
    }"
  >
    <SiteHeader />
    <n-layout :native-scrollbar="false" style="top: 64px">
      <h1>{{ t("home") }}</h1>
    </n-layout>
  </n-layout>
</template>
<script setup lang="ts">
import SiteHeader from '../layout/SiteHeader.vue'
import { i18n } from '../utils/composables'
const { t } = i18n({
  'zh-CN': {
    home: '主页'
  },
  'en-US': {
    home: 'Home'
  }
})
</script>
