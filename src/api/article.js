import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/shopitem/query',
    method: 'get',
    data: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/shopitem/update',
    method: 'post',
    data
  })
}
export function fetchByName(query) {
  const param = { id: 1, title: query.title.trim() }
  return request({
    url: '/shopitem/querybyname',
    method: 'get',
    params: param
  })
}
export function fetchByType(query) {
  const param = { id: 1, tag: query.type.trim() }
  return request({
    url: '/shopitem/querybytag',
    method: 'get',
    params: param
  })
}
export function fetchOrderList(query) {
  console.log(query.importance)
  const param = { shopid: query.importance, size: 20 }
  return request({
    url: '/order/queryData',
    method: 'get',
    params: param
  })
}

