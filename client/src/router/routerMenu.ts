export const routerMenu = [
  {
    name: 'home',
    path: '/home',
    icon: 'HomeFilled',
    meta: {
      title: '首页',
      requireAuth: true,
    },
    component: () => import('../views/home/home.vue'),
  },
  {
    name: 'lend',
    path: '/lend',
    icon: 'RemoveFilled',
    meta: {
      title: '借出',
      requireAuth: true,
    },
    component: () => import('../views/lend/lend.vue'),
  },
  {
    name: 'income',
    path: '/income',
    icon: 'CirclePlusFilled',
    meta: {
      title: '收入',
      requireAuth: true,
    },
    component: () => import('../views/income/income.vue'),
  }
]
