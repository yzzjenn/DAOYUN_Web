import request from '@/web/utils/request'

export function getDicts(page, size, sort, blurry) {
  let params = null
  if (blurry !== null && blurry !== '') {
    params = { page, size, sort, blurry }
  } else {
    params = { page, size, sort }
  }
  return request({
    url: 'api/dict',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/dict',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/dict/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/dict',
    method: 'put',
    data
  })
}
export function search(dictName) {
  const params = {
    dictName,
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/dict/search',
    method: 'get',
    params
  })
}

export default { getDicts, add, edit, del, search }
