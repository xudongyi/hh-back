import axios from 'axios'
import Qs from 'qs'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  transformRequest: [function (data) {
    data = Qs.stringify(data);
    return data;
  }],
  timeout: 10000 // request timeout
});
initInterceptors(service);
//初始化拦截器
function initInterceptors(instance) {
  instance.interceptors.request.use(function(config) {
    //在发送请求之前做某事
    if (store.getters.token) {
      config.headers['X-Token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    }
    if(config.data) {
      console.log("请求参数:", config.data)
    }
    return config;
  }, function(error) {
    //请求错误时做些事
    console.log("请求发生异常!", error);
    return Promise.reject(error);
  });

  //添加响应拦截器
  instance.interceptors.response.use(function(response) {

    //对响应数据做些事
    if(response) {
      var status = response.status;
      if(status === 200 || status === 304) {
        console.log("请求url:" + response.config.url);
        console.log("返回结果:", response.data);
        return response.data;
      } else if(status == 500) {
        Message({
          message: "服务器错误",
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        console.log("response结果:", response)
      }
      return response.data;
    }
  }, function(error) {
    //请求错误时做些事
    if(!isEmptyObject(error)) {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error);
  });
}
function isEmptyObject(e) {
  var t;
  for(t in e)
    return !1;
  return !0
}

export default service
