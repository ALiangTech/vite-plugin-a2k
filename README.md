# vite-plugin-gen-i18n-key



## 功能

- 自动生成 i18n key
- 自动翻译 (使用[百度翻译api](https://fanyi-api.baidu.com/?fr=pcHeader))

## 安装

**node version:** >=20

```bash
pnpm add vite-plugin-gen-i18n-key -D
```


## 使用

```vue

<template>
  <div>{{ $t(test) }}</div>
</template>
<script setup>
  import {ref} from 'vue'
  const test = ref(`<<你好, 世界>>`) // 通过<<>>包裹的模板字符串文本会被自动翻译
</script>

```













