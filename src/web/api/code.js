import request from '@/web/utils/request'

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

export function sendCode(data) {
  return request({
    url: 'api/users/emailCode',
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
