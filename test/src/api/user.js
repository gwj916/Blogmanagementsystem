import request from '@/utils/request'

export function loginapi(data) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/admin/whoami',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function setUser(data){
  return request({
    url : '/api/admin',
    method : 'PUT',
    data
  })
}