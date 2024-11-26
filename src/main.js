import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import cnData from './locales/langs/cn.json'
console.log(cnData, 'init')
const i18n = createI18n({
    legacy: false,
    locale: 'cn',
    fallbackLocale: 'cn',
    messages: {
        cn: cnData,
    }
})
const app = createApp(App)
app.use(i18n)
app.mount('#app')
