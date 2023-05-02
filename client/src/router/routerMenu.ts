export const routerMenu = [
  {
    name: 'home',
    path: '/home',
    icon: 'House',
    meta: {
      title: '首页',
      requireAuth: true,
    },
    component: () => import('../views/home/home.vue'),
  },
  {
    name: 'finance',
    path: '/finance',
    icon: 'Money',
    meta: {
      title: '财务管理',
      requireAuth: true,
    },
    children: [
      {
        name: 'lend',
        path: '/lend',
        meta: {
          title: '借出',
          requireAuth: true,
        },
        component: () => import('../views/lend/lend.vue'),
      },
      {
        name: 'income',
        path: '/income',
        meta: {
          title: '收入',
          requireAuth: true,
        },
        component: () => import('../views/income/income.vue'),
      }
    ],
  },
  {
    name: 'noteManage',
    path: '/noteManage',
    icon: 'Notebook',
    meta: {
      title: '笔记管理',
      requireAuth: true,
    },
    children: [
      {
        name: 'noteList',
        path: '/noteList',
        meta: {
          title: '笔记列表',
          requireAuth: true,
        },
        // @ts-ignore
        component: () => import('../views/noteList/noteList.vue'),
      },
    ],
  },
]
