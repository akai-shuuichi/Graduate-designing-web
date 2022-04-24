import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/loginByAdmin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/getinfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
