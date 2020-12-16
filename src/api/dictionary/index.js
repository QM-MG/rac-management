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