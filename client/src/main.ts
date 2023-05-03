import {createApp, nextTick} from 'vue'
import "@/styles/reset.css"
import '@/styles/common.scss'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import '@/styles/index.scss'


import App from './App.vue'
import {createPinia} from 'pinia'
const pinia = createPinia();
import router from './router/router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// 引入 icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 自定义全局指令 (在dialog 中使用, 需要每次关闭dialog都要销毁元素)
app.directive("auto-focus", {
  mounted(el, bindings) {
    nextTick(() => {
      setTimeout(() => {
        el.querySelector('input').focus()
      }, 100)
    })
  }
})


app
  .use(pinia)
  .use(router)
  .use(ElementPlus)
  .mount('#app')

