import {createApp} from 'vue'
import "@/styles/reset.css"
import '@/styles/common.scss'
import ElementPlus from 'element-plus'
import App from './App.vue'
import {createPinia} from 'pinia'
import router from './router/router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App)
const pinia = createPinia();

// 引入 icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app
  .use(router)
  .use(ElementPlus)
  .use(pinia)
  .mount('#app')

