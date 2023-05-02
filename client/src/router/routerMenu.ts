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
    name: 'userManage',
    path: '/userManage',
    icon: 'User',
    meta: {
      title: '用户管理',
      requireAuth: true,
    },
    children: [
      {
        name: 'userList',
        path: '/userList',
        meta: {
          title: '用户列表',
          requireAuth: true,
        },
        component: () => import('../views/userList/userList.vue'),
      },
      {
        name: 'userAuth',
        path: '/userAuth',
        meta: {
          title: '用户权限',
          requireAuth: true,
        },
        component: () => import('../views/userAuth/userAuth.vue'),
      },
    ],
  },
]
