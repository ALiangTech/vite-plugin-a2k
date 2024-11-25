<script setup>
import HelloWorld from './components/HelloWorld.vue';
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
const age = ref(`<<世界>>`)
const name = `<<那么大的>>`
const test = () => {
  return `<<你想去看看>>`  // 代表要自动翻译的
}
</script>

<template>
<h1>{{ $t(name) }}</h1>
<h1>{{ $t(age) }}</h1>
<h1>{{ $t(test()) }}</h1>
<button @click="locale = 'cn'">cn</button>
<button @click="locale = 'en'">en</button>
</template>
