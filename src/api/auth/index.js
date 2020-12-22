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
export function saveBind(param) {
    return axiosIns.post(url.ROLE_TO_FUNC_SAVE, param); 
}
export function saveUnbind(param) {
    return axiosIns.post(url.ROLE_TO_FUNC_DEL, param); 
}
export function roleToFunc(param) {
    return axiosIns.post(url.ROLE_TO_FUNC, param); 
}
export function roleListAll(param) {
    return axiosIns.post(url.ROLE_LIST_ALL, param); 
}
export function roleFuncList(param) {
    return axiosIns.post(url.ROLE_TO_FUNC_LIST, param); 
}
export function saveBindMenu(param) {
    return axiosIns.post(url.ROLE_TO_MENU_SAVE, param); 
}
export function findMenuToBind(param) {
    return axiosIns.post(url.ROLE_TO_MENU, param); 
}
