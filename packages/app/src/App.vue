<template>
  <a-space direction="vertical" :style="{ width: '100%' }" :size="[0, 48]">
    <a-layout>
      <a-layout-header :style="headerStyle">Header</a-layout-header>
      <a-layout-content :style="contentStyle">
        <Languages></Languages>
      </a-layout-content>
      <a-layout-footer :style="footerStyle"> a2k ©2024 Created by H</a-layout-footer>
    </a-layout>
  </a-space>
</template>
<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import Languages from "./pages/languages/index.vue";
const headerHeight = 64;
const bottomHeight = 16;
const headerStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  minHeight: `${headerHeight}px`,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
};

const contentStyle: CSSProperties = {
  textAlign: 'center',
  height: `calc(100vh - ${headerHeight+bottomHeight + 16}px)`, // 16 是body的上下margin
  color: '#fff',
  overflow: 'auto',
  backgroundColor: '#fff',
};

const footerStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  minHeight: `${bottomHeight}px`,
  lineHeight: `${bottomHeight}px`,
  backgroundColor: '#7dbcea',
  padding: 0,
};
</script>

