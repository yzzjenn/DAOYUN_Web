import request from '@/web/utils/request'
// import { param2Obj } from '../utils'

export function resetEmail(data) {
  return request({
    url: 'api/code/resetEmail?email=' + data,
    method: 'post'
  })
}

export function updatePass(pass) {
  return request({
    url: 'api/users/updatePass/' + pass,
    method: 'get'
  })
}

export function sendCode(data, phone) {
  return request({
    url: 'api/code/phoneCode?phoneNumber=' + phone,
    method: 'post',
    data
  })
}

export function checkCode(data) {
  return request({
    url: 'api/code/validated',
    method: 'post',
    data
  })
}
