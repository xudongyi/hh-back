import request from '@/utils/request'

export function getSettleList(params) {
  return request({
    url: '/settle/getSettleList.do',
    method: 'post',
    params
  })
}
export function updateSettleLog(params) {
  return request({
    url: '/settle/updateSettleLog.do',
    method: 'post',
    params
  })
}
export function batchUpdateSettleLog(ids) {
  return request({
    url: '/settle/batchUpdateSettleLog.do',
    method: 'get',
    params:{
      ids:ids
    }
  })
}

export function getMonthSettle(params) {
  return request({
    url: '/settle/getMonthSettle.do',
    method: 'get',
    params
  })
}



