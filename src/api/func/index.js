import axiosIns from '../axiosConfig';
import * as url from '../url';

export function searchFuncList(param) {
    return axiosIns.post(url.FUNC_LIST, param); 
}
export function add(param) {
    return axiosIns.post(url.FUNC_ADD, param); 
}
export function edit(param) {
    return axiosIns.post(url.FUNC_EDIT, param); 
}
export function del(param) {
    return axiosIns.post(url.FUNC_DEL, param); 
}
export function findFuncTree(param) {
    return axiosIns.post(url.FUNC_TREE, param); 
}
export function findFuncAllTree(param) {
    return axiosIns.post(url.FUNC_ALL_TREE, param); 
}
