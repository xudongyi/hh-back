import request from '@/utils/request'

export function getBrandList() {
  return request({
    url: '/brand/list.do',
    method: 'get'
  })
}


/**
 * @Description:获取品牌列表，分页
 * @Author: zhangqiang
 * @Date: 16:03 2018/4/14
 */
export function getBrandListByPage(params) {
  return request({
    url: '/brand/getBrandList.do',
    method: 'post',
    params
  })
}

/**
 * @Description:保存品牌
 * @Author: zhangqiang
 * @Date: 14:37 2018/4/16
 */
export function saveBrand(params) {
  return request({
    url: '/brand/saveBrand.do',
    method: 'post',
    params
  })
}


/**
 * @Description:删除品牌
 * @Author: zhangqiang
 * @Date: 14:38 2018/4/16
 */
export function deleteBrand(params) {
  return request({
    url: '/brand/deleteBrand.do',
    method: 'post',
    params
  })
}


