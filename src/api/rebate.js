import request from '@/utils/request'

export function getAgentRebateList(params) {
  return request({
    url: '/rebate/getAgentRebateList.do',
    method: 'post',
    params
  })
}

export function getRecommendRebateList(params) {
  return request({
    url: '/rebate/getRecommendRebateList.do',
    method: 'post',
    params
  })
}



