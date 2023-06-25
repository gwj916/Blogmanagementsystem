import request from '@/utils/request'

export function getblogs(page=1,limit=10) {
  return request({
    url: '/api/blog',
    method: 'get',
    params: {
      page,
      limit
    }
  })
}
export function delblog(id) {
  return request({
    url: `/api/blog/${id}`,
    method: 'delete'
  })
}

export function addblog(data) {
  return request({
    url: `/api/blog`,
    method: 'post',
    data
  })
}

export function editblog(info) {
  return request({
    url: `/api/blog/${info.id}`,
    method: 'put',
    data:info.data
  })
}

export function findoneblog(id) {
  return request({
    url: `/api/blog/${id}`,
    method: 'get'
  })
}