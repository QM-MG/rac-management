import axiosIns from '../axiosConfig';
import * as url from '../url';

export function searchData(param) {
    return axiosIns.post(url.BIZENTITY_LIST, param); 
}
export function add(param) {
    return axiosIns.post(url.BIZENTITY_ADD, param); 
}
export function edit(param) {
    return axiosIns.post(url.BIZENTITY_EDIT, param); 
}
export function del(param) {
    return axiosIns.post(url.BIZENTITY_DEL, param); 
}
export function searchBizentityAll(param) {
    return axiosIns.post(url.BIZENTITY_LIST_ALL, param); 
}