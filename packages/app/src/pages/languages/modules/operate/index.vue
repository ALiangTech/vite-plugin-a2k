

<template>
  <a-space v-if="props.lang && props.lang !== 'all'">
    <a-button type="primary" @click="handlerGenerateJSONFile">生成语言文件</a-button>
    <a-button type="primary" @click="handlerAutoTranslate">自动翻译</a-button>
  </a-space>
</template>
<script setup lang="ts">
import { useFetchApi } from "@/hooks/useFetch.ts";
defineOptions({ name: 'LanguagesOperate' })
const emit = defineEmits(['translate'])
interface Props {
  lang: string
}
const props = defineProps<Props>()
const { api } = useFetchApi('/langs', 'POST')
const handlerGenerateJSONFile = () => {
  api({ lang: props.lang })
}
const handlerAutoTranslate = () => {
   emit('translate', props.lang)
}



</script>
<style scoped>

</style>