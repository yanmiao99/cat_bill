export const routerMenu = [
  {
    name: 'home',
    path: '/home',
    icon: 'HomeFilled',
    meta: {
      title: '首页',
      requireAuth: true,
    },
    component: () => import('../views/home.vue'),
  },
  {
    name: 'lend',
    path: '/lend',
    icon: 'RemoveFilled',
    meta: {
      title: '借出',
      requireAuth: true,
    },
    component: () => import('../views/lend.vue'),
  },
  {
    name: 'income',
    path: '/income',
    icon: 'CirclePlusFilled',
    meta: {
      title: '收入',
      requireAuth: true,
    },
    component: () => import('../views/income.vue'),
  },
  {
    name: 'report',
    path: '/report',
    icon: 'TrendCharts',
    meta: {
      title: '报告',
      requireAuth: true,
    },
    component: () => import('../views/report.vue'),
  },
  {
    name: 'settings',
    path: '/settings',
    icon: 'Tools',
    meta: {
      title: '设置',
      requireAuth: true,
    },
    component: () => import('../views/settings.vue'),
  },
]
