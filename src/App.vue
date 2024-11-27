<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { locale, setLocaleMessage } = useI18n()
const age = ref(`<<你好>>`)
const name = `<<那么大>>`
const test = () => {
  return `<<你想去看>>`  // 代表要自动翻译的
}

async function changeLocal(lang) {
  locale.value = lang
  const messages = await import(`./locales/langs/${lang}.json`);
  console.log('messages', messages)
  setLocaleMessage(lang, messages.default)
  console.log('messages', messages.default)
  localStorage.setItem('lang', lang)
}



</script>

<template><h6>当前语言:{{ locale }}</h6>
<div>{{ $t(name) }}</div>
<div>{{ $t(age) }}</div>
<div>{{ $t(test()) }}</div>
<button @click="changeLocal('cn')">cn</button>
<button @click="changeLocal('en')">en</button>
</template>
