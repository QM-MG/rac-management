import axiosIns from '../axiosConfig';
import * as url from '../url';

export function searchStrategy(param) {
    return axiosIns.post(url.STRATEGY_LIST, param); 
}
export function add(param) {
    return axiosIns.post(url.STRATEGY_CREATE, param); 
}
export function edit(param) {
    return axiosIns.post(url.STRATEGY_EDIT, param); 
}
export function del(param) {
    return axiosIns.post(url.STRATEGY_DEL, param); 
}
export function searchStrategyAll(param) {
    return axiosIns.post(url.STRATEGY_LIST_ALL, param); 
}