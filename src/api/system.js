import request from '@/utils/request'

export function saveInfo() {
  return request({
    url: '/system/saveInfo.do',
    method: 'post'
  })
}
export function saveInfoNoFile(params) {
  return request({
    url: '/system/saveInfoNoFile.do',
    method: 'post',
    params
  })
}
export function getInfo() {
  return request({
    url: '/system/getInfo.do',
    method: 'get'
  })
}

export function getImg(url) {
  return request({
    url: '/file/getImg.do',
    method: 'get',
    params:{url:url}
  })
}



