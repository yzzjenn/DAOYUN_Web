import router from './router'
import store from './web/store'
// eslint-disable-next-line no-unused-vars
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/web/utils/auth' // get token from cookie
import getPageTitle from '@/web/utils/get-page-title'
import { buildMenus } from '@/web/api/menu'
import { filterAsyncRouter } from '@/web/store/modules/permission'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  console.log('调整前的，拦截器')
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 用户已登录，重定向至首页
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('user/getInfo').then(res => { // 拉取user_info
          // 动态路由，拉取菜单
          loadMenus(next, to)
        }).catch(() => {
          // console.log(err)
          store.dispatch('user/resetToken').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      // 登录时未拉取 菜单，在此处拉取
      } else if (store.getters.loadMenus) {
        // 修改成false，防止死循环
        store.dispatch('user/updateLoadMenus').then(res => {})
        loadMenus(next, to)
      } else {
        next()
      }
    }
    // else {
    //   const hasGetUserInfo = store.getters.user
    //   if (hasGetUserInfo) {
    //     if (store.getters.loadMenus) {
    //       // 修改成false，防止死循环
    //       await store.dispatch('user/updateLoadMenus')
    //       loadMenus(next, to)
    //     } else {
    //       next()
    //     }
    //   } else {
    //     try {
    //       // 获取用户信息
    //       store.dispatch('user/getInfo').then(res => {
    //         // 动态路由，拉取菜单
    //         loadMenus(next, to)
    //       })
    //       next()
    //     } catch (error) {
    //       // 移除原有token，重定向至登陆页，重新登录
    //       store.dispatch('user/resetToken').then(res => {
    //         location.reload() // 为了重新实例化vue-router对象 避免bug
    //       })
    //       Message.error(error || 'Has Error')
    //       next(`/login?redirect=${to.path}`)
    //       NProgress.done()
    //     }
    //   }
    // }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录页面白名单中，直接进入对应页面
      next()
    } else {
      // 其他无权访问的页面将重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

export const loadMenus = (next, to) => {
  buildMenus().then(res => {
    // console.log('buildMenus', res)
    const asyncRouter = filterAsyncRouter(res)
    asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
    store.dispatch('permission/GenerateRoutes', asyncRouter).then(() => { // 存储路由
      router.addRoutes(asyncRouter) // 动态添加可访问路由表
      next({ ...to, replace: true })
    })
  })
}

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
