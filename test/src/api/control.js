import request from '@/utils/request'

export function getcontrol() {
  return request({
    url: '/api/control',
    method: 'get',
  })
}
