
import { type SchemaItem } from '../../../../components/ak-search-modal/type.ts'
import {Input} from "ant-design-vue";
import LanguagesSelectLang from './select-lang.vue'







export default function useLangSearch() {

    const schema: SchemaItem[] = [
        {
            field: 'lang',
            is: LanguagesSelectLang,
            label: '语言',
            props: {},
        },
        {
            field: 'key',
            is: Input,
            label: '国际化Key',
            props: {
                placeholder: '请输入国际化Key',
                allowClear: true,
            },
        },
    ]
    return { schema }
}