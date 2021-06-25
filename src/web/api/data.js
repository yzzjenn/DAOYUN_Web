import request from '@/web/utils/request'
import qs from 'qs'

// qs.parse()是将URL解析成对象的形式
// qs.stringify()是将对象 序列化成URL的形式，以&进行拼接
// 例如 url = api/dept、 params = {"page":0,"size":5,"sort":["id,desc"]} 得到如下的url:
// url : api/dept?page=0&size=5&sort=id%2Cdesc
export function initData(url, params) {
  return request({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function download(url, params) {
  return request({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get',
    responseType: 'blob'
  })
}
