import {createApp, reactive} from 'vue'

import myLoad from './loading.vue'

const msg = reactive({
  show: false,
  title: '拼命加载中...'
})

const $loading = createApp(myLoad, {msg}).mount(document.createElement('div'))
const load = {
  show(title) { // 控制显示loading的方法
    msg.show = true
    msg.title = title || '拼命加载中...'
    document.body.appendChild($loading.$el)
  },

  hide() { // 控制loading隐藏的方法
    msg.show = false
  }
}
export {load}

// export default {
//     install(app) {
//         // console.log(app);
//         // Vue.prototype.$http = axios
//         app.config.globalProperties.$loading = load
//     }
// }

