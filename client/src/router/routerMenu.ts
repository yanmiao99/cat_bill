export const routerMenu = [
  {
    name: 'home',
    path: '/home',
    icon: 'HomeFilled',
    meta: {
      title: '首页'
    },
    component: () => import('../views/home.vue'),
  },
  {
    name: 'lend',
    path: '/lend',
    icon: 'RemoveFilled',
    meta: {
      title: '借出'
    },
    component: () => import('../views/lend.vue'),
  },
  {
    name: 'income',
    path: '/income',
    icon: 'CirclePlusFilled',
    meta: {
      title: '收入'
    },
    component: () => import('../views/income.vue'),
  },
  {
    name: 'report',
    path: '/report',
    icon: 'TrendCharts',
    meta: {
      title: '报告'
    },
    component: () => import('../views/report.vue'),
  },
  {
    name: 'settings',
    path: '/settings',
    icon: 'Tools',
    meta: {
      title: '设置'
    },
    component: () => import('../views/settings.vue'),
  },
]
