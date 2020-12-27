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
// 用户绑定角色
export function userToRole(param) {
    return axiosIns.post(url.USER_TO_ROLE, param); 
}
// 用户绑定角色保存
export function userToRoleSave(param) {
    return axiosIns.post(url.USER_TO_ROLE_SAVE, param); 
}
// 用户绑定维度和角色保存
export function userToDimensionAuthSave(param) {
    return axiosIns.post(url.USER_GRANTAUTH_SAVE, param); 
}
// 用户已绑定节点
export function userToDimension(param) {
    return axiosIns.post(url.USER_TO_DIMENSION, param); 
}
// 用户绑定角色保存
export function userToDimensionSave(param) {
    return axiosIns.post(url.USER_TO_DIMENSION_SAVE, param); 
}
// 用户查关联的属性
export function userToPropertyList(param) {
    return axiosIns.post(url.USER_TO_PROPERTY_LIST, param); 
}
// 用户绑定角色保存
export function userToPropertySave(param) {
    return axiosIns.post(url.USER_TO_PROPERTY_SAVE, param); 
}
// 用户绑定角色保存
export function userToMenu(param) {
    return axiosIns.post(url.USER_LIST_MENU, param); 
}
// 用户删除属性
export function propertyToDel(param) {
    return axiosIns.post(url.ROPERTY_TO_DEL, param); 
}