import request from '@/utils/request'

export function getprogect() {
  return request({
    url: '/api/project',
    method: 'get',
  })
}

export function setprogect(id,data) {
  return request({
    url: `/api/project/${id}`,
    method: 'put',
    data
  })
}

export function addprogect(data) {
  return request({
    url:'/api/project',
    method: 'post',
    data
  })
}

export function delprogect(id) {
  return request({
    url: `/api/project/${id}`,
    method: 'delete',
  })
}