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
export function findTreeList(param) {
    return axiosIns.post(url.DIMENSION_TREE_LIST, param); 
}
export function treeAdd(param) {
    return axiosIns.post(url.DIMENSION_TREE_CREATE, param); 
}
export function treeEdit(param) {
    return axiosIns.post(url.DIMENSION_TREE_EDIT, param); 
}
export function treeDel(param) {
    return axiosIns.post(url.DIMENSION_TREE_DEL, param); 
}
export function findDimensionList(param) {
    return axiosIns.post(url.DIMENSION_LIST_ALL, param); 
}

export function bindNode(param) {
    return axiosIns.post(url.DIMENSION_BIND_NODE, param); 
}
export function unbindNode(param) {
    return axiosIns.post(url.DIMENSION_UNBIND_NODE, param); 
}
export function findNode(param) {
    return axiosIns.post(url.DIMENSION_SEARCH_NODE, param); 
}
export function findDimensionTreeByName(param) {
    return axiosIns.post(url.DIMENSION_SEARCH_BYNAME, param); 
}

export function findPropertyList(param) {
    return axiosIns.post(url.DIMENSION_PORPERTY_LIST, param); 
}
export function propertySave(param) {
    return axiosIns.post(url.DIMENSION_PORPERTY_SAVE, param); 
}
export function propertyDel(param) {
    return axiosIns.post(url.DIMENSION_PORPERTY_DEL, param); 
}
