import axiosIns from '../axiosConfig';
import * as url from '../url';

export function searchData(param) {
    return axiosIns.post(url.PROPERTY_LIST, param); 
}
export function add(param) {
    return axiosIns.post(url.ROPERTY_ADD, param); 
}
export function edit(param) {
    return axiosIns.post(url.ROPERTY_EDIT, param); 
}
export function del(param) {
    return axiosIns.post(url.ROPERTY_DEL, param); 
}
export function propertyToEntity(param) {
    return axiosIns.post(url.ROPERTY_TO_ENTITY, param); 
}
