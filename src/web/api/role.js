import request from '@/web/utils/request'

export function getAll() {
  return request({
    url: 'api/roles/all',
    method: 'get'
  })
}

export function getList(params) {
  return request({
    url: 'api/roles',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/roles',
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: 'api/roles/' + id,
    method: 'get'
  })
}

export function getLevel() {
  return request({
    url: 'api/roles/level',
    method: 'get'
  })
}

export function del(ids) {
  return request({
    url: 'api/roles',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/roles',
    method: 'put',
    data
  })
}

export function editMenu(data) {
  return request({
    url: 'api/roles/menu',
    method: 'put',
    data
  })
}

export default { getList, add, edit, del, get, editMenu, getLevel }
