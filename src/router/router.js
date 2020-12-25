import Vue from 'vue'
import Router from 'vue-router'
import login from '../views/login.vue'
import home from '../views/home.vue'
// import bizline from '../views/bizline.vue'
// import user from '../views/user/index.vue'
// import auth from '../views/auth/index.vue'
// import func from '../views/func/index.vue'
// import dictionary from '../views/dictionary.vue'
// import property from '../views/property.vue'
// import bizentity from '../views/bizentity.vue'
// import dimension from '../views/dimension/index.vue'
// import strategy from '../views/strategy.vue'
// import menu from '../views/menu/index.vue'
import {findMenuAllTree} from '@/api/menu/index';
const _import = require('./_import_' + process.env.NODE_ENV) //获取组件的方法
Vue.use(Router)
let routerList = []; // 存储到storage的数据
let routerData = []; // 接收后端数据
let newRoutes = [
	{
		path: '/',
		component: home,
		redirect: '/login',
		meta: {
		  title: '首页'
		},
	  }
]
const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
  ]
})

router.beforeEach(async(to, from, next) => {
	// if (to.path === '/login') {
	// 	routerList = [];
	// 	localStorage.removeItem(router)
	// }
	if (!routerList || routerList.length <= 0)  {
		console.log(1, to.path)
		// localStorage 里没有 去请求数据
		if (!getObjArr('router')) {
			routerData = await search();
			let menuList = changeRouterToMenu(routerData); // 转为菜单
			getRouterList(routerData); // 转为注册路由
			newRoutes[0].children = routerList;
			router.addRoutes(newRoutes)
			global.menuList = menuList //将路由数据传递给全局变量，做侧边栏菜单渲染工作
			saveObjArr('router', routerData) // 存储路由到localStorage
			next();
		}
		// 从localStorage拿到路由
		else {
			routerData = getObjArr('router') //拿到路由
			let menuList = changeRouterToMenu(routerData); // 转为菜单
			global.menuList = menuList //将路由数据传递给全局变量，做侧边栏菜单渲染工作
			getRouterList(routerData); // 转为注册路由
			newRoutes[0].children = routerList;
			router.addRoutes(newRoutes)
			router.replace(to.path)
			next();
		}
	}
	else {
		next()
	}
})

function getObjArr(name) {
	return JSON.parse(window.localStorage.getItem(name));
}
function saveObjArr(name, data) {
	localStorage.setItem(name, JSON.stringify(data))
}
// 将数据转为菜单
const changeRouterToMenu = (data) => {
	let item = [];
	data.map((list, i) => {
		let newData = {};
		newData.cnName = list.cnName;
		newData.path = list.url;
		newData.level= list.level,
		newData.seq = list.seq + ''
		newData.childList = list.childList  ? changeRouterToMenu(list.childList) : [];    //如果还有子集，就再次调用自己
		item.push(newData);
	});
	return item;
}
// 转为动态路由
const getRouterList = (data) => {
let temp = [];

	for (let i = 0; i < data.length; i++) {
		if (data[i] && data[i].childList && data[i].childList.length > 0) {
			temp = temp.concat(data[i].childList)
		} 
		else if (data[i]) {
			let newData = {};
			newData.name = data[i].enName;
			newData.path = data[i].url;
			newData.component = data[i].enName;
        	newData.component = _import(data[i].enName)
			newData.meta = {
				title: data[i].cnName,
				level: data[i].level,
				seq: data[i].seq
			}
			routerList.push(newData)
		}
	}
	if (temp.length >= 1) {
		getRouterList(temp, routerList)
	}
}
// 查功能树数据
async function search() {
	try {
		let res = await findMenuAllTree({bizLineId: 1});
		let routerData = res.data;
		return routerData
	}
	catch (e) {
	}
}
export default router