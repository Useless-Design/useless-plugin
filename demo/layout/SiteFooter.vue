<template>
  <n-layout-footer
    bordered
    class="footer"
    :class="{
      ['footer--centered']: centered,
    }"
  >
    <div class="footer-links">
      <div class="footer-links-col">
        <n-text depth="1" class="col-header">
          帮助
        </n-text>
        <n-button
          text
          tag="a"
          target="_blank"
          href="https://github.com/tiny-dust/useless-ui/issues/new"
        >
          报告 Bug
        </n-button>
      </div>
      <div class="footer-links-col">
        <n-text depth="1" class="col-header">
          社区
        </n-text>
        <n-button text tag="a" target="_blank" :href="repoUrl">
          GitHub
        </n-button>
      </div>
    </div>
    <n-divider class="footer-divider" />
    <div style="text-align: center; padding: 20px">
      <n-text depth="3">
        Useless UI {{ version }} · Made by Tiny dust
      </n-text>
    </div>
  </n-layout-footer>
</template>

<script lang="ts" setup>
import { version } from 'useless-ui'
import { repoUrl } from '../utils/github-url'

defineProps({
  centered: {
    type: Boolean
  }
})
</script>

<style scoped>
.footer {
  --x-padding: 56px;
  margin-top: auto;
}

.footer.footer--centered .footer-links {
  margin: auto;
  max-width: 960px;
  --x-padding: 36px;
}

.footer-links {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: var(--x-padding);
  padding-bottom: 0;
  padding-top: 32px;
}

.footer-links-col {
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-right: 24px;
  padding-bottom: 24px;
}

.col-header {
  font-weight: 500;
  white-space: nowrap;
}

@media only screen and (min-width: 1024px) {
  .footer.footer--centered .footer-links-col.footer-links-col--last {
    flex: 0 0 0;
  }
}

.footer.footer--centered .footer-links-col {
  width: initial;
}

.footer-divider {
  margin: 0;
  padding: 0 var(--x-padding);
}

.footer-links-col > * {
  line-height: 2;
}

.link {
  text-decoration: none;
}
</style>
