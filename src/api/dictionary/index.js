import axiosIns from '../axiosConfig';
import * as url from '../url';

export function searchData(param) {
    return axiosIns.post(url.DICTIONARY_LIST, param); 
}
export function add(param) {
    return axiosIns.post(url.DICTIONARY_ADD, param); 
}
export function edit(param) {
    return axiosIns.post(url.DICTIONARY_EDIT, param); 
}
export function del(param) {
    return axiosIns.post(url.DICTIONARY_DEL, param); 
}
export function searchDictionaryAll(param) {
    return axiosIns.post(url.DICTIONARY_LIST_ALL, param); 
}

export function findDictionaryTreeList(param) {
    return axiosIns.post(url.DICTIONARY_TREE_LIST, param); 
}
export function treeAdd(param) {
    return axiosIns.post(url.DICTIONARY_TREE_CREATE, param); 
}
export function treeEdit(param) {
    return axiosIns.post(url.DICTIONARY_TREE_EDIT, param); 
}
export function treeDel(param) {
    return axiosIns.post(url.DICTIONARY_TREE_DEL, param); 
}
export function findPropertyList(param) {
    return axiosIns.post(url.DICTIONARY_PORPERTY_LIST, param); 
}
export function propertySave(param) {
    return axiosIns.post(url.DICTIONARY_PORPERTY_SAVE, param); 
}
export function propertyDel(param) {
    return axiosIns.post(url.DICTIONARY_PORPERTY_DEL, param); 
}
export function findDictionaryTreeByName(param) {
    return axiosIns.post(url.DICTIONARY_SEARCH_BYNAME, param); 
}
export function findDictionaryAllTree(param) {
    return axiosIns.post(url.DICTIONARY_ALL_TREE, param); 
}