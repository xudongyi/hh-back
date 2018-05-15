import request from '@/utils/request'

export function getAngelApplyList(params) {
  return request({
    url: '/apply/getAngelApplyList.do',
    method: 'post',
    params
  })
}

export function getBrandListByUser(params) {
  return request({
    url: '/apply/getBrandListByUser.do',
    method: 'post',
    params
  })
}

export function saveApplyState(params) {
  return request({
    url: '/apply/saveApplyState.do',
    method: 'post',
    params
  })
}

export function savePayState(params) {
  return request({
    url: '/apply/savePayState.do',
    method: 'post',
    params
  })
}

export function getApplyFile(params) {
  return request({
    url: '/apply/getApplyFile.do',
    method: 'post',
    params
  })
}


