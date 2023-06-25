import request from '@/utils/request'

export function getabout() {
  return request({
    url: '/api/about',
    method: 'get',
  })
}
export function editabout(data) {
  return request({
    url: '/api/about',
    method: 'post',
    data
  })
}