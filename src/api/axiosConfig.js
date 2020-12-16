import axios from 'axios';
import {
  Message,
} from 'element-ui'
const BASE_URL = '/rac';
const axiosIns = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})
axiosIns.interceptors.response.use(
    response => { //成功请求到数据
      if (+response.data.status === 0) {
        return response.data;
      } else {
        return Promise.reject(response.data.msg)
      }
    },
    error => { //响应错误处理
      Message({
        message: '系统错误，请稍后重试！',
        type: 'error'
      })
      // return Promise.reject(error)
    }
  );
export default axiosIns;