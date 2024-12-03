import { createApp } from 'vue'
import './style.css'
// @ts-ignore
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import messages from './locales/langs/cn.json'
const i18n = createI18n({
    legacy: false,
    locale: 'cn',
    fallbackLocale: 'cn',
    messages: {
        cn: messages,
    }
})

createApp(App).use(i18n).mount('#app')
