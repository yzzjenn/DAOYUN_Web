import request from '@/web/utils/request'

export function getList(currentPage, pagesize, type, name, fatherId) {
  return request({
    url: '/present-cloud/school/data',
    method: 'get',
    params: { currentPage, pagesize, type, name, fatherId }
  })
}

export function updateList(form) {
  return request({
    url: '/present-cloud/school/update',
    method: 'put',
    params: { form }
  })
}

export function deleteItem(form) {
  return request({
    url: '/present-cloud/school/delete',
    method: 'delete',
    params: { form }
  })
}

export function addItem(form) {
  return request({
    url: '/present-cloud/school/add',
    method: 'post',
    params: { form }
  })
}

export function getFather(fatherId) {
  return request({
    url: '/present-cloud/school/getFather',
    method: 'get',
    params: { fatherId }
  })
}

export function isExist(id, name, fatherId) {
  return request({
    url: '/present-cloud/school/exist',
    method: 'get',
    params: { id, name, fatherId }
  })
}
