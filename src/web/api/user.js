import request from '@/web/utils/request'
import { encrypt } from '@/web/utils/rsaEncrypt'

export function login(data) {
  return request({
    // url: '/present-cloud/user/login',
    url: '/auth/login',
    method: 'post',
    data
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/present-cloud/user/info',
//     method: 'get',
//     params: { token }
//   })
// }
export function getInfo() {
  return request({
    url: 'auth/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/present-cloud/user/logout',
    method: 'post'
  })
}

// export function changePassword(form) {
//   return request({
//     url: '/present-cloud/user/changePassword',
//     method: 'post',
//     params: { form }
//   })
// }

export function changePassword(data) {
  return request({
    url: 'api/users/resetPass',
    method: 'post',
    data
  })
}

export function getCode() {
  return request({
    url: '/present-cloud/user/getCode',
    method: 'get'
  })
}

export function updateEmail(form) {
  const data = {
    password: encrypt(form.pass),
    email: form.email
  }
  return request({
    url: 'api/users/updateEmail/' + form.code,
    method: 'post',
    data
  })
}

export function editUser(data) {
  return request({
    url: 'api/users/center',
    method: 'put',
    data
  })
}

export function updatePass(user) {
  const data = {
    oldPass: encrypt(user.oldPass),
    newPass: encrypt(user.newPass)
  }
  return request({
    url: 'api/users/updatePass/',
    method: 'post',
    data
  })
}
