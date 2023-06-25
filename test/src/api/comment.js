import request from '@/utils/request'

export function getcomment(page = 1,limit = 10) {
  return request({
    url: '/api/comment',
    method: 'get',
    params:{
        page,
        limit
    }
  })
}

export function delcomment(id) {
  return request({
    url: `/api/comment/${id}`,
    method: 'delete',
  })
}