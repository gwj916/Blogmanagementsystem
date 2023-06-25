import request from '@/utils/request'

export function getblogtype() {
  return request({
    url: '/api/blogtype',
    method: 'get',
  })
}
export function delblogtype(id) {
  return request({
    url:`/api/blogtype/${id}`,
    method: 'delete',
  })
}
export function addblogtype(data) {
  return request({
    url:`/api/blogtype`,
    method: 'post',
    data
  })
}
export function findoneblogtype(id) {
    return request({
      url:`/api/blogtype/${id}`,
      method: 'get',
    })
  }
export function updateoneblogtype(editinfo) {
    return request({
      url:`/api/blogtype/${editinfo.id}`,
      method: 'put',
      data:editinfo.data
    })
  }