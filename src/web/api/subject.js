import request from '@/web/utils/request'

export function getList(currentPage, pagesize, name) {
  return request({
    url: '/present-cloud/subject/data',
    method: 'get',
    params: { currentPage, pagesize, name }
  })
}

export function updateList(form) {
  return request({
    url: '/present-cloud/subject/update',
    method: 'put',
    params: { form }
  })
}

export function deleteItem(form) {
  return request({
    url: '/present-cloud/subject/delete',
    method: 'delete',
    params: { form }
  })
}

export function addItem(form) {
  return request({
    url: '/present-cloud/subject/add',
    method: 'post',
    params: { form }
  })
}

export function isExist(id, name, school, department) {
  return request({
    url: '/present-cloud/subject/exist',
    method: 'get',
    params: { id, name, school, department }
  })
}
