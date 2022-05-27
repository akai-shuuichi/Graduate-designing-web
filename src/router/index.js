import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  // { //左侧控制
  //   path: '/',
  //   component: Layout,
  //   redirect: '/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/index/index'),
  //       name: '数据',
  //       meta: { title: '数据', icon: 'dashboard', affix: true }
  //     }
  //   ]
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/permission/directive'),
        name: '主页',
        meta: { title: '主页', icon: 'people', affix: true }
      }
    ]
  },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'Documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'Guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/profile',
  //   component: Layout,
  //   redirect: '/profile/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Profile',
  //       meta: { title: 'Profile', icon: 'user', noCache: true }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  { //左侧控制
    path: '/data',
    component: Layout,
    redirect: '/data',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index/index'),
        name: '数据',
        meta: { title: '数据', icon: 'dashboard', affix: true ,roles:["2"]}
      }
    ]
  },
  // nestedRouter,
  tableRouter,


  {
    path: '/table/order-table',
    component: Layout,
    redirect: '/table/order-table',
    children: [
      {
        path: 'order-table',
        component: () => import('@/views/table/order-table'),
        name: '订单管理',
        meta: { title: '订单管理', icon: 'clipboard', affix: true ,roles:['2']}
      }
    ]
  },
  {
    path: '/table/inline-edit-table',
    component: Layout,
    redirect: '/table/inline-edit-table',
    children: [
      {
        path: 'order-table',
        component: () => import('@/views/table/inline-edit-table'),
        name: '商家信息',
        meta: { title: '商家信息', icon: 'tab', affix: true,roles:['3'] }
      }
    ]
  },
  {
    path: '/table/drag-table',
    component: Layout,
    redirect: '/table/drag-table',
    children: [
      {
        path: 'order-table',
        component: () => import('@/views/table/drag-table'),
        name: '餐厅信息',
        meta: { title: '餐厅信息', icon: 'example', affix: true ,roles:['3']}
      }
    ]
  },
  {
    path: '/table/chat',
    component: Layout,
    redirect: '/table/chat',
    children: [
      {
        path: 'chat',
        component: () => import('@/views/table/chat'),
        name: '交流空间',
        meta: { title: '交流空间', icon: 'peoples', affix: true ,roles:['2']}
      }
    ]
  }
  ,
  {
    path: '/table/com',
    component: Layout,
    redirect: '/table/zhiliang1',
    children: [
      {
        path: 'chat1',
        component: () => import('@/views/20220523/zhiliang1'),
        name: '质量评价',
        meta: { title: '质量评价', icon: 'peoples', affix: true ,roles:['2']}
      }
    ]
  },
  {
    path: '/table/tableadmin',
    component: Layout,
    redirect: '/table/tableadmin',
    children: [
      {
        path: 'tableadmin',
        component: () => import('@/views/table/complex-tableadmin'),
        name: 'ComplexTable',
        meta: { title: '菜品管理' , icon: 'peoples',roles:['3']}
      }
    ]
  },  {
    path: '/table/zhiliang2',
    component: Layout,
    redirect: '/table/zhiliang2',
    children: [
      {
        path: 'chat2',
        component: () => import('@/views/20220523/zhiliang2'),
        name: '质量评价管理',
        meta: { title: '质量评价管理', icon: 'peoples', affix: true ,roles:['3']}
      }
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
