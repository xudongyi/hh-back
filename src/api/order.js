/**
 * Created by Honker on 2018/4/17.
 */
import request from '@/utils/request'

export function getOrderList(params) {
  return request({
    url: '/order/getOrderList.do',
    method: 'post',
    params
  })
}
export function getOrderGoodsList(params) {
  return request({
    url: '/order/getOrderGoodsList.do',
    method: 'post',
    params
  })
}

export function updateOrderGoods(params) {
  return request({
    url: '/order/updateOrderGoods.do',
    method: 'post',
    params
  })
}

export function getOrderStatisticList(params) {
  return request({
    url: '/order/getOrderStatisticList.do',
    method: 'post',
    params
  })
}
