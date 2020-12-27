import axios from 'axios';
import Router from '../router/router'

import {
  Message,
} from 'element-ui'
import router from '../router/router';
const BASE_URL = '/rac';
const axiosIns = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': "XMLHttpRequest"
    }
})
axiosIns.interceptors.request.use(function(res){
  if (res.url === './login') {
    res.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return res
},function(fail){
})
axiosIns.interceptors.response.use(
    response => { //成功请求到数据
      if (response && response.data && +response.data.status === 0) {
        return response.data;
      } 
      else if (response && response.data && +response.data.status === 403) {
        response.data = {
          data: {}
        };
        Router.push({path: '/login'})
        Message({
          message: '权限失效，请重新登录！',
          type: 'warning'
        })
        return response.data;
      }
      else {
        return Promise.reject(response.data.msg)
      }
    },
    error => { //响应错误处理
      // console.log(error)
      // Message({
      //   message: '系统错误，请稍后重试！',
      //   type: 'error'
      // })
      return Promise.reject(error)
    }
  );
export default axiosIns;