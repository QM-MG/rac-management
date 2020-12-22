import axiosIns from '../axiosConfig';
import * as url from '../url';

export function searchMenuList(param) {
    return axiosIns.post(url.MENU_LIST, param); 
}
export function add(param) {
    return axiosIns.post(url.MENU_ADD, param); 
}
export function edit(param) {
    return axiosIns.post(url.MENU_EDIT, param); 
}
export function del(param) {
    return axiosIns.post(url.MENU_DEL, param); 
}
export function findMenuTree(param) {
    return axiosIns.post(url.MENU_TREE, param); 
}
export function findMenuAllTree(param) {
    return axiosIns.post(url.MENU_ALL_TREE, param); 
}

