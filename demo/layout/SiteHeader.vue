<template>
  <n-layout-header style="height: 64px" class="nav" bordered :style="style">
    <n-text tag="div" class="ui-logo" :depth="1" @click="handleLogoClick">
      <img src="../assets/logo.png" alt="useless ui logo">
      <span>Useless UI</span>
    </n-text>
    <div />
    <div class="nav-end">
      <n-button @click="changeLang">
        {{ langText }}
      </n-button>
    </div>
  </n-layout-header>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { useIsMobile } from '../utils/composables'
import { computed } from 'vue'
import { useSystemStore } from '../store'
import { storeToRefs } from 'pinia'
const { locale } = storeToRefs(useSystemStore())
const isMobileRef = useIsMobile()
const router = useRouter()
const route = useRoute()

const langText = computed(() => {
  return locale.value === 'zh-CN' ? '中文' : 'English'
})

const style = computed(() => {
  return isMobileRef.value
    ? {
        '--side-padding': '16px',
        'grid-template-columns': 'auto 1fr auto'
      }
    : {
        '--side-padding': '32px',
        'grid-template-columns': 'calc(272px - var(--side-padding)) 1fr auto'
      }
})

const handleLogoClick = () => {
  router.push('/')
}

const changeLang = () => {
  const curLang = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  // 获取当前路由name
  const curRouteName = route.name ?? 'home'
  router.push({
    name: curRouteName,
    params: { lang: curLang },
    query: route.query
  })
}
</script>

<style scoped>
.nav {
  display: grid;
  grid-template-rows: calc(var(--header-height) - 1px);
  align-items: center;
  padding: 0 var(--side-padding);
}

.ui-logo {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
}

.ui-logo > img {
  margin-right: 12px;
  height: 32px;
  width: 32px;
}

.nav-menu {
  padding-left: 36px;
}

.nav-picker {
  margin-right: 4px;
}

.nav-picker.padded {
  padding: 0 10px;
}

.nav-picker:last-child {
  margin-right: 0;
}

.nav-end {
  display: flex;
  align-items: center;
}
</style>

<style>
.nav-menu .n-menu-item {
  height: calc(var(--header-height) - 1px) !important;
}
</style>
