import axiosIns from '../axiosConfig';
import * as url from '../url';

export function searchData(param) {
    return axiosIns.post(url.DIMENSION_LIST, param); 
}
export function add(param) {
    return axiosIns.post(url.DIMENSION_ADD, param); 
}
export function edit(param) {
    return axiosIns.post(url.DIMENSION_EDIT, param); 
}
export function del(param) {
    return axiosIns.post(url.DIMENSION_DEL, param); 
}