import axiosIns from '../axiosConfig';
import * as url from '../url';

export function searchAuthList(param) {
    return axiosIns.post(url.ROLE_LIST, param); 
}
export function add(param) {
    return axiosIns.post(url.ROLE_ADD, param); 
}
export function edit(param) {
    return axiosIns.post(url.ROLE_EDIT, param); 
}
export function del(param) {
    return axiosIns.post(url.ROLE_DEL, param); 
}
