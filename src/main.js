import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import messages  from './locales/messages.json';
console.log(messages, 'messages');
const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages,
})
  
const app = createApp(App)
app.use(i18n)
app.mount('#app')
