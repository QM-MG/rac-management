export const LOGIN = './login';
export const LOGINAXIOS = './loginAjax';
export const LOGOUT= './logout'; // 用户登出

export const BIZLINE_LIST = './bizline/listPage';
export const BIZLINE_ADD = './bizline/create';
export const BIZLINE_EDIT = './bizline/edit';
export const BIZLINE_DEL = './bizline/delete';
export const BIZLINE_ALL_LIST = './bizline/listAuthBizLine';

export const USER_LIST = './user/listPage';
export const USER_ADD = './user/create';
export const USER_EDIT = './user/edit';
export const USER_DEL = './user/delete';
export const USER_TO_ROLE = './user/listUserRoleId'; // 用户已绑定的角色
export const USER_TO_ROLE_SAVE = './user/grantRoles'; // 用户绑定角色保存
export const USER_GRANTAUTH_SAVE = './user/grantAuth'; // 用户绑定角色和维度保存
export const USER_TO_DIMENSION = './user/listUserDimensionNodes'; // 用户已绑定维度
export const USER_TO_DIMENSION_SAVE = './user/grantDimensionNodes'; // 用户绑定角色保存
export const USER_TO_PROPERTY_LIST = './user/listUserExtProperty'; // 用户下的所有属性
export const USER_TO_PROPERTY_SAVE = './user/addExtProperty'; // 用户下的所有属性
export const USER_LIST_MENU = './user/listMenu'; // 用户下的所有菜单
export const ROPERTY_TO_DEL= './user/dropExtProperty';


// export const USER_BIND_DIMENSION = './user/bindDimensionNodes';

export const ROLE_LIST = './role/listPage';
export const ROLE_ADD = './role/create';
export const ROLE_EDIT = './role/edit';
export const ROLE_DEL = './role/delete';
export const ROLE_LIST_ALL = './role/listByBizLineId';
export const ROLE_TO_FUNC = './role/listFuncId'; // 角色已绑定的功能id
export const ROLE_TO_FUNC_SAVE = './role/bindAuth'; // 角色绑定功能保存接口
export const ROLE_TO_FUNC_DEL = './role/unbindAuth'; // 角色绑定功能保存接口
export const ROLE_TO_FUNC_LIST = './role/listAuth'; // 角色 授权列表
export const ROLE_TO_MENU_SAVE = './role/bindMenu'; // 角色 绑定菜单保存
export const ROLE_TO_MENU= './role/listBindMenuId';


export const FUNC_LIST = './func/listPage';
export const FUNC_ADD = './func/create';
export const FUNC_EDIT = './func/edit';
export const FUNC_DEL = './func/delete';
export const FUNC_TREE= './func/listByParentId';
export const FUNC_ALL_TREE= './func/listByBizLineId';

export const MENU_LIST = './menu/listPage';
export const MENU_ADD = './menu/create';
export const MENU_EDIT = './menu/edit';
export const MENU_DEL = './menu/delete';
export const MENU_TREE= './menu/listByParentId';
export const MENU_ALL_TREE= './menu/listByBizLineId';


export const DICTIONARY_LIST = './dictionary/listPage';
export const DICTIONARY_ADD = './dictionary/create';
export const DICTIONARY_EDIT = './dictionary/edit';
export const DICTIONARY_DEL = './dictionary/delete';
export const DICTIONARY_LIST_ALL = './dictionary/listByBizLineId';
export const DICTIONARY_PORPERTY_LIST = './dictionary/node/listExtProperty';
export const DICTIONARY_PORPERTY_SAVE = './dictionary/node/addExtProperty';
export const DICTIONARY_PORPERTY_DEL = './dictionary/node/dropExtProperty';
export const DICTIONARY_TREE_LIST = './dictionary/node/listByParentId';
export const DICTIONARY_TREE_CREATE = './dictionary/node/create';
export const DICTIONARY_TREE_EDIT = './dictionary/node/edit';
export const DICTIONARY_TREE_DEL = './dictionary/node/delete';
export const DICTIONARY_SEARCH_BYNAME = './dictionary/queryByEnName';
export const DICTIONARY_ALL_TREE = '/dictionary/node/listByDictionaryId';

export const PROPERTY_LIST = './property/listPage';
export const ROPERTY_ADD = './property/create';
export const ROPERTY_EDIT = './property/edit';
export const ROPERTY_DEL = './property/delete';
export const ROPERTY_TO_ENTITY= './property/listByBizEntityEnName';

export const BIZENTITY_LIST = './bizentity/listPage';
export const BIZENTITY_ADD = './bizentity/create';
export const BIZENTITY_EDIT = './bizentity/edit';
export const BIZENTITY_DEL = './bizentity/delete';
export const BIZENTITY_LIST_ALL = './bizentity/listByBizLineId';

export const DIMENSION_LIST = './dimension/listPage';
export const DIMENSION_ADD = './dimension/create';
export const DIMENSION_EDIT = './dimension/edit';
export const DIMENSION_DEL = './dimension/delete';
export const DIMENSION_LIST_ALL = './dimension/listByBizLineId';

export const DIMENSION_TREE_LIST = './dimension/node/listByParentId';
export const DIMENSION_TREE_CREATE = './dimension/node/create';
export const DIMENSION_TREE_EDIT = './dimension/node/edit';
export const DIMENSION_TREE_DEL = './dimension/node/delete';
export const DIMENSION_BIND_NODE = './dimension/node/bindObjectNode';
export const DIMENSION_UNBIND_NODE = './dimension/node/unbindObjectNode';
export const DIMENSION_SEARCH_NODE = './dimension/node/queryObjectNode';
export const DIMENSION_SEARCH_BYNAME = './dimension/queryByEnName';
export const DIMENSION_PORPERTY_LIST = './dimension/node/listExtProperty';
export const DIMENSION_PORPERTY_SAVE = './dimension/node/addExtProperty';
export const DIMENSION_PORPERTY_DEL = './dimension/node/dropExtProperty';

export const STRATEGY_LIST = './strategy/listPage';
export const STRATEGY_CREATE = './strategy/create';
export const STRATEGY_EDIT = './strategy/edit';
export const STRATEGY_DEL = './strategy/delete';
export const STRATEGY_LIST_ALL = './strategy/listByBizLineId';




