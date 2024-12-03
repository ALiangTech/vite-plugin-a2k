<template>
  <div>
    <a-button type="primary" @click="showModal">搜索</a-button>
    <a-modal v-model:open="open" title="搜索表单" @ok="handleOk" :width="640">
      <a-form
          ref="formRef"
          name="advanced_search"
          :model="formState"
      >
        <a-flex wrap="wrap" gap="small">
          <template v-for="item of props.schema">
            <div style="flex: 1">
              <a-form-item :label="item.label">
                <component :is="item.is" v-bind="item.props" v-model:value="formState[`${item.field}`]"></component>
              </a-form-item>
            </div>
          </template>
        </a-flex>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import {ref, reactive, watchEffect} from 'vue';
import {Props} from './type.ts'
defineOptions({ name: 'AKSearchModal' })
const props = defineProps<Props>()
const emit = defineEmits(['search'])
const value = defineModel('value')
const open = ref<boolean>(false);
const showModal = () => {
  open.value = true;
};
const formState = reactive({});

const handleOk = () => {
  emit('search', {...formState})
  open.value = false;
};
// 表单模块
watchEffect(() => {
  value.value = {...formState}
})
</script>

