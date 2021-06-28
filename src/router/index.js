import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/web/layout'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    meta: { title: '登录', noCache: true },
    component: () => import('@/web/routes/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/web/routes/404'], resolve),
    hidden: true
  },
  {
    path: '/403',
    component: (resolve) => require(['@/web/routes/403'], resolve),
    hidden: true
  },
  {
    path: '/500',
    component: () => import('@/web/routes/500'),
    hidden: true
  },

  {
    path: '/def',
    component: () => import('@/web/routes/def'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: (resolve) => require(['@/web/routes/redirect'], resolve)
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/web/routes/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/userList',
    name: '静态菜单',
    meta: { title: '静态菜单', icon: 'example' },
    children: [
      {
        path: 'userList',
        name: '静态用户管理',
        component: () => import('@/web/routes/user/teacher/index'),
        meta: { title: '用户管理', icon: 'form' }
      },
      {
        path: 'roleList',
        name: '静态角色管理',
        component: () => import('@/web/routes/role/index'),
        meta: { title: '角色管理', icon: 'role' }
      },
      {
        path: 'system',
        redirect: '/example/system/dictionary',
        name: '静态系统管理',
        component: () => import('@/web/routes/system/index'),
        meta: { title: '系统管理', icon: 'monitor' },
        children: [
          {
            path: 'dictionary',
            name: '静态数据字典',
            component: () => import('@/web/routes/system/dictionary/index'),
            meta: { title: '数据字典', icon: 'documentation' }
          },
          {
            path: 'menu',
            name: '静态菜单管理',
            component: () => import('@/web/routes/system/menu/index'),
            meta: { title: '菜单管理', icon: 'table' }
          }
        ]
      },
      {
        path: 'school',
        redirect: '/example/school/schoolList',
        name: '静态学校管理',
        component: () => import('@/web/routes/school/index'),
        meta: { title: '学校管理', icon: 'education' },
        children: [
          {
            path: 'schoolList',
            name: '静态院校管理',
            component: () => import('@/web/routes/school/school/index'),
            meta: { title: '院校管理', icon: 'school1' }
          },
          {
            path: 'study',
            name: '静态学习行为管理',
            component: () => import('@/web/routes/school/study/index'),
            meta: { title: '学习行为管理', icon: 'behavior' }
          },
          {
            path: 'subject',
            name: '静态课程管理',
            component: () => import('@/web/routes/school/subject/index'),
            meta: { title: '课程管理', icon: 'behavior' }
          }
        ]
      },
      {
        path: 'error',
        redirect: '/example/error/404',
        name: 'error',
        component: () => import('@/web/routes/school/index'),
        meta: { title: '异常界面', icon: 'education' },
        children: [
          {
            path: '404',
            name: '404',
            component: () => import('@/web/routes/404'),
            meta: { title: '404', icon: '404' }
          },
          {
            path: '403',
            name: '403',
            component: () => import('@/web/routes/403'),
            meta: { title: '403', icon: '403' }
          },
          {
            path: '500',
            name: '500',
            component: () => import('@/web/routes/500'),
            meta: { title: '500', icon: '500' }
          },
          {
            path: 'def',
            name: 'def',
            component: () => import('@/web/routes/def'),
            meta: { title: '自定义异常', icon: 'behavior' }
          }
        ]
      },
      {
        path: 'table',
        name: '标准表格',
        component: () => import('@/web/routes/table/index'),
        meta: { title: '表格', icon: 'table' }
      },
      {
        path: 'list',
        name: '标准列表',
        component: () => import('@/web/routes/list/index'),
        meta: { title: '列表', icon: 'list' }
      }
    ]
  },
  {
    path: '/userInfo',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: () => import('@/web/routes/user/center/index'),
        hidden: true,
        name: '个人中心',
        meta: { title: '个人中心' }
      }
    ]
  }
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
