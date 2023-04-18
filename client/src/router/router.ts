import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";
import {routerMenu} from "./routerMenu";
import config from "../config/config";
import storage from "../utils/storage";

/*
* createRouter 路由器
* createWebHashHistory  Hash
* createWebHistory  History
*
* 注意点 :
* 如果你的 router 和文件的名称的大小写不一致 ,会导致热更新失效 (大小写敏感)
* */

// 页面路由
const routes: Array<RouteRecordRaw> = [
  {
    name: 'layout',
    path: '/',
    redirect: '/home', // 必须使用 path 或者 name
    meta: {
      title: '首页',
      requireAuth: false,
    },
    component: () => import('../layout/layout.vue'),
    children: [...routerMenu]
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录',
      requireAuth: false,
    },
    component: () => import('../views/login.vue'),
  },
  {
    path: '/:catchAll(.*)',  // 导出必须使用 catchAll 正则匹配
    name: '/404',
    meta: {
      title: '页面找不到',
      requireAuth: false,
    },
    component: () => import('../components/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),  // 选择模式
  routes
})

// 设置浏览器标题
router.beforeEach((to, from, next) => {
  // 动态设置浏览器标题
  document.title = to.meta.title as string + ' - ' + config.globalName

  const hasUserInfo = storage.getItem('userInfo')
  const hasToken = hasUserInfo?.token
  // 路由拦截
  if (to.meta.requireAuth && !hasToken) {
    next({name: 'login'})
  } else {
    next()
  }
})


export default router

