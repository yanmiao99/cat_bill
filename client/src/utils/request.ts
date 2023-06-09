// axios 二次封装

// 引入文件
import axios from "axios"
import {ElMessage} from "element-plus"
import router from "../router/router"
import storage from "../utils/storage"

// @ts-ignore
import {load} from '../components/loading/loading'

// 无效token
const TOKEN_INVALID = 'Token认证失败, 请重新登陆'
// 请求异常
const NETWORK_ERROR = "网络异常,请稍后重试"

// 全局配置
const service = axios.create({
  baseURL: (import.meta as any).env.VITE_BASE_URL,
  timeout: 8000,
})

// 请求拦截
service.interceptors.request.use((req) => {
  const headers = req.headers
  let token = ''
  try {
    token = storage.getItem('userInfo').token
  } catch (e) {
    token = ''
  }
  if (!headers.Authorization) headers.Authorization = 'Bearer ' + token

  // 开启 loading 定时器，定时器结束后再显示 loading , 并且 将定时器存储到请求参数中
  // @ts-ignore
  req.timer = setTimeout(() => {
    load.show()
  }, 1000)

  return req;
})

// 响应拦截
service.interceptors.response.use(
  (res) => {
    // @ts-ignore
    res.config.timer && clearTimeout(res.config.timer) // 取消定时器
    const {code, data, msg} = res.data
    if (code === 200) {
      load.hide() // 隐藏 loading
      return data // 返回数据正确
    } else {
      ElMessage.error(msg || NETWORK_ERROR) // 常规报错
      return Promise.reject(msg || NETWORK_ERROR)
    }
  }, (error) => {
    error.config.timer && clearTimeout(error.config.timer) // 取消定时器
    load.hide()
    if (error.response && error.response.status === 401) {
      // token 失效，跳转到登录页
      storage.clearItem('userInfo'); // 移除 token
      ElMessage.error(TOKEN_INVALID)
      router.push('/login')
        .then(() => Promise.reject(error))
        .catch(() => {
          // 使用 catch 防止路由重复报错
        });
    }
  }
)

// request 方法
function request(options: any) {
  options.method = options.method || 'get'

  if (options.method.toLowerCase() === 'get') {
    options.params = options.data
  }

  return service(options)
}

// 使用对象的方式调用
['get', 'post', 'put', 'delete', 'patch'].forEach(item => {
  // @ts-ignore
  request[item] = (url: string, data: object, options: any) => {
    return request({
      url,
      data,
      method: item,
      ...options
    })
  }
})

export default request
