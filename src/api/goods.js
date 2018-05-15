import request from '@/utils/request'

export function getGoodsList() {
  return request({
    url: '/goods/list.do',
    method: 'get'
  })
}

/**
 * @Description:获取商品列表，分页
 * @Author: zhangqiang
 * @Date: 16:03 2018/4/14
 */
export function getGoodsListByPage(params) {
  return request({
    url: '/goods/getGoodsListByPage.do',
    method: 'post',
    params
  })
}

/**
 * @Description:保存商品
 * @Author: zhangqiang
 * @Date: 14:37 2018/4/16
 */
export function saveGoods(params) {
  return request({
    url: '/goods/saveGoods.do',
    method: 'post',
    params
  })
}


/**
 * @Description:删除品牌
 * @Author: zhangqiang
 * @Date: 14:38 2018/4/16
 */
export function deleteGoods(params) {
  return request({
    url: '/goods/deleteGoods.do',
    method: 'post',
    params
  })
}


