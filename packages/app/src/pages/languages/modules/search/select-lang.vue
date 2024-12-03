

<template>
  <a-select
      ref="select"
      v-model:value="value"
      style="width: 120px"
      :options="langList"
  >
  </a-select>
</template>
<script setup lang="ts">
import {useFetch} from "@/hooks/useFetch.ts";
import {ref, unref, watchEffect} from "vue";
defineOptions({
  name: 'LanguagesSelectLang'
})
const value = defineModel('value')
// 获取系统里面存在的语言类型
const langList = ref([])
useFetch('/langs/list', 'GET', undefined, langList)
watchEffect(() => {
  value.value = unref(langList)[0]?.value
})
</script>
<style scoped>

</style>