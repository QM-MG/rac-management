import axiosIns from '../axiosConfig';
import * as url from '../url';
import qs from 'qs';

export function login(param) {
    return axiosIns({
        url: '/login',
        method: 'post',
        data: qs.stringify(param)
    })
}
export function loginAxios(param) {
    return axiosIns.post(url.LOGINAXIOS, param); 
}
export function logout(param) {
    return axiosIns.post(url.LOGOUT, param); 
}
