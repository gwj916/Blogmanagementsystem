import request from '@/utils/request'

export function getbanners() {
  return request({
    url: '/api/banner',
    method: 'get',
  })
}
export function setbanners(data) {
  return request({
    url: '/api/banner',
    method: 'post',
    data
  })
}