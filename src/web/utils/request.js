import axios from 'axios'
import { MessageBox, Message, Notification } from 'element-ui'
import store from '@/web/store'
import { getToken } from '@/web/utils/auth'

// 创建一个axios实例
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // api 的 base_url
  // baseURL: '',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // console.log('res:', res)
    // if the custom code is not null, it is judged as an error.
    if (res.status && res.status !== 20000) {
      // console.log('res.message', res.message)
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 已过期；
      if (res.code === 401) {
        // to re-login
        MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // console.log('err:' + error) // for debug
    let resCode = 0
    try {
      resCode = error.response.data.status
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Notification.error({
          title: '网络请求超时',
          duration: 5000
        })
        return Promise.reject(error)
      }
    }
    if (resCode) {
      if (resCode === 401) {
        // to re-login
        MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else if (resCode === 403) {
        this.$router.push({ path: '/403' })
      } else {
        const errorMsg = error.response.data.message
        if (errorMsg !== undefined) {
          Notification.error({
            title: errorMsg.length < 20 ? errorMsg : '未知异常,请刷新',
            duration: 5000
          })
        }
      }
    } else {
      Notification.error({
        title: '接口请求失败',
        duration: 5000
      })
    }
    return Promise.reject(error)
  }
)

export default service
