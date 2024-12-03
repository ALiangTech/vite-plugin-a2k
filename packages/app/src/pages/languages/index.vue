<template>
<section>
  <div style="padding: 1em">
    <a-space>
      <AKSearchModal :schema="schema" @search="handleSearch"></AKSearchModal>
      <LanguagesOperate :lang="params.lang" @translate="handleTranslate"></LanguagesOperate>
    </a-space>
  </div>
  <a-table :columns="columns" :data-source="data" @resizeColumn="handleResizeColumn" :pagination="false"></a-table>
</section>
</template>
<script lang="ts" setup>
import {useFetch,useFetchApi} from "../../hooks/useFetch.ts";
import {ref, unref} from "vue";
import AKSearchModal from '../../components/ak-search-modal/index.vue'
import type { TableColumnsType } from 'ant-design-vue';
import useLangSearch from "./modules/search/useLangSearch.ts";
import LanguagesOperate from './modules/operate/index.vue'

defineOptions({
  name: 'Languages'
})
const columns = ref<TableColumnsType>([
  {
    title: 'Key',
    dataIndex: 'key',
    resizable: true,
    ellipsis: true,
    width: 200,
    minWidth: 100,
    maxWidth: 300,
  },
  {
    title: 'Value',
    dataIndex: 'value',
    resizable: true,
    ellipsis: true,
    minWidth: 100,
    width: 200,
    maxWidth: 300,
  },
  {
    title: 'Path',
    resizable: true,
    dataIndex: 'path',
    ellipsis: true,
    minWidth: 100,
    width: 200,
    maxWidth: 300,
  },
  {
    title: 'Lang',
    dataIndex: 'lang',
    ellipsis: true,
    width: 200,
  },
  {
    title: 'IsTranslated',
    dataIndex: 'isTranslated',
    ellipsis: true,
    width: 200,
  },
]);

function handleResizeColumn(w:any, col:any) {
  col.width = w;
}



// 搜索模块 语言搜索  key搜索 按钮翻译 按钮生成json
const { schema } = useLangSearch()

const data = ref([])
const params = ref({})

// 拉取语言数据
useFetch('/langs', 'GET', params, data)


function handleSearch(searchParams:any) {
  params.value = searchParams
}

const { api } = useFetchApi('/translate', 'POST')

const handleTranslate = async () => {
  debugger;
  for (let i = 0; i <unref(data).length; i++) {
    try {
      const { key, value, lang, isTranslated } = unref(data)[i]
      if (isTranslated) {
        continue;
      }
      const result = await api({value, lang, key, isTranslated})
      data.value[i].value = result.text
    } catch (e) {
      console.log(e)
    }
  }
}







</script>

