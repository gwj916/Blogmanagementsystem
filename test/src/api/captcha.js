import request from '@/utils/request'
export function getcaptcha() {
  return request({
    url: '/res/captcha',
    method: 'get'
  })
}
