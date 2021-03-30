import request from '@/web/utils/request'

export function getProvince() {
  return request({
    url: '/present-cloud/area/province',
    method: 'get'
  })
}
export function getCity(province) {
  return request({
    url: '/present-cloud/area/city',
    method: 'get',
    params: { province }
  })
}
export function inProvince(province, city) {
  return request({
    url: '/present-cloud/area/inProvince',
    method: 'get',
    params: { province, city }
  })
}
