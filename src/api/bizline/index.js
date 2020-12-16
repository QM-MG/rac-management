import axiosIns from '../axiosConfig';
import * as url from '../url';

export function searchData(param) {
    return axiosIns.post(url.BIZLINE_LIST, param); 
}
export function add(param) {
    return axiosIns.post(url.BIZLINE_ADD, param); 
}
export function edit(param) {
    return axiosIns.post(url.BIZLINE_EDIT, param); 
}
export function del(param) {
    return axiosIns.post(url.BIZLINE_DEL, param); 
}
export function searchBizLine() {
    return axiosIns.post(url.BIZLINE_ALL_LIST); 
}