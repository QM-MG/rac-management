import axiosIns from '../axiosConfig';
import * as url from '../url';

export function searchUserList(param) {
    return axiosIns.post(url.USER_LIST, param); 
}
export function add(param) {
    return axiosIns.post(url.USER_ADD, param); 
}
export function edit(param) {
    return axiosIns.post(url.USER_EDIT, param); 
}
export function del(param) {
    return axiosIns.post(url.USER_DEL, param); 
}
