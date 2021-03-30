import { login, logout, getInfo } from '@/web/api/user'
import { getToken, setToken, removeToken } from '@/web/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    user: {},
    roles: [],
    loadMenus: false
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_LOAD_MENUS: (state, loadMenus) => {
    state.loadMenus = loadMenus
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const { username, password, rememberMe } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        // const { data } = response
        // console.log('loginres', response)
        commit('SET_TOKEN', response.token)
        commit('SET_LOAD_MENUS', true)
        setToken(response.token, rememberMe)
        // commit('SET_USER', response.user)
        // getInfo().then(response => {
        //   console.log('getInfo', response)
        // })
        setUserInfo(response.user, commit)
        resolve()
      }).catch(error => {
        // console.log('loginErr', error)
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        // const { data } = response
        // console.log('getInfo', response)
        if (!response) {
          reject('验证失败，请重新登录')
        }

        // const { name, avatar } = response

        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        setUserInfo(response, commit)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 注销
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // 移除token
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 移除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // 移除token
      commit('RESET_STATE')
      resolve()
    })
  },

  updateLoadMenus({ commit }) {
    return new Promise((resolve, reject) => {
      commit('SET_LOAD_MENUS', false)
    })
  }
}

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  // console.log('setUserInfo1', res)
  // console.log('setUserInfo2', res.roles)
  // console.log('setUserInfo3', res.user)
  if (res.roles.length === 0) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', res.roles)
  }
  commit('SET_USER', res.user)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

