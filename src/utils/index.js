/**
 * 判断对象是否为空
 * @param {Object} Object
 * @return {Boolean}
 */
export function isEmptyObj(obj) {
    if (!obj) {
        return;
    }
    if (Object.keys(obj).length === 0) {
        return true
    }
    else {
        return false;
    }
}