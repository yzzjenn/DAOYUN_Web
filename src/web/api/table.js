import request from '@/web/utils/request'

export function getList(params) {
  return request({
    url: '/present-cloud/table/list',
    method: 'get',
    params
  })
}
