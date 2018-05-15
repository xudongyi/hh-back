import request from '@/utils/request'


/**
 * @Description:获取库存列表，分页
 * @Author: zhangqiang
 * @Date: 16:03 2018/4/14
 */
export function getStoreListByPage(params) {
  return request({
    url: '/store/getStoreListByPage.do',
    method: 'post',
    params
  })
}

/**
 * @Description:批量入库
 * @Author: zhangqiang
 * @Date: 15:03 2018/4/18
 */
export function startStoreIn(params) {
  return request({
    url: '/store/startStoreIn.do',
    method: 'post',
    params
  })
}

/**
 * @Description:批量出库
 * @Author: zhangqiang
 * @Date: 13:46 2018/4/19
 */
export function startStoreOut(params) {
  return request({
    url: '/store/startStoreOut.do',
    method: 'post',
    params
  })
}


/**
 * @Description:库存流水
 * @Author: zhangqiang
 * @Date: 13:46 2018/4/19
 */
export function storeDetail(params) {
  return request({
    url: '/store/getGoodsStoreDetail.do',
    method: 'post',
    params
  })
}


