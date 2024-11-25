<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const test = `<<你好！{msg}纽约>>`
const testFn =  () => {
  return `<<函数2>>`
}
</script>

<template>
  <h1>{{ msg }}</h1>
  <div>{{ $t(test, { msg: "北京"}) }}</div>
  <div>{{ $t(testFn()) }}</div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
