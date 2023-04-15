/*
* 环境配置封装
* */
// @ts-ignore
const env: string = import.meta.env.MODE || 'prod';

// MODE: "development"

const EnvConfig: any = {
  dev: { // 开发环境
    baseApi: '/api',
    mockApi: ''
  },
  prod: { // 线上环境
    baseApi: '/',
    mockApi: ''
  }
}


export default {
  env,
  namespace: 'cat_', // 命名空间
  globalName: '橘·记账', //全局名称
  mock: false, // 是否启动全局 mock
  ...EnvConfig[env]
}
