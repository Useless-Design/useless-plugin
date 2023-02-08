<template>
  <n-layout
    :style="{
      height: '100vh',
    }"
  >
    <SiteHeader />
    <n-layout :native-scrollbar="false" style="top: 64px">
      <h1>主页</h1>
      <n-text code>
        能看到这里说明项目已经ok了，开始进行下一步吧
      </n-text>
    </n-layout>
  </n-layout>
</template>
<script setup lang="ts">
import SiteHeader from '../layout/SiteHeader.vue'
</script>
