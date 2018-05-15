import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/user/getUserList.do',
    method: 'post',
    params
  })
}


