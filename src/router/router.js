import Vue from 'vue'
import Router from 'vue-router'
import login from '../views/login.vue'
import home from '../views/home.vue'
import bizline from '../views/bizline.vue'
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
window.bizline = bizline;
console.log(window.bizline)
Vue.use(Router)
let RouterList;
const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
	  component: home,
	  redirect: '/login',
      meta: {
        title: '首页'
      },
    },
  ]
})

router.beforeEach((to, from, next) => {
	if (!RouterList) {
		// localStorage 里没有 去请求数据
		if (!getObjArr('router')) {
			search();
		}
		// 从localStorage拿到路由
		else {
			RouterList = getObjArr('router') //拿到路由
			// routerGo(to, next)
		}
	}
	else {
		next()
	}
	console.log(to)
})

function getObjArr(name) {
	return JSON.parse(window.localStorage.getItem(name));
}
function saveObjArr(name, data) {
	localStorage.setItem(name, JSON.stringify(data))
}
// 将数据转为动态路由
const changeRouterToDynamic = (data) => {
	let item = [];
	data.map((list, i) => {
		let newData = {};
		newData.name = list.enName;
		newData.title = list.cnName;
		newData.component = list.enName;
		newData['component'] = resolve => require([`@/views/${enName}`], resolve)
		// newData['component'] = window[list.enName];

		newData.meta = {
			title: list.cnName,
			level: list.level,
			seq: list.seq
		}
		newData.childList = list.childList  ? changeRouterToDynamic(list.childList) : [];    //如果还有子集，就再次调用自己
		item.push(newData);
	});
	return item;
}
let routerList = [];
const getRouterList = (data) => {
let temp = [];
	for (let i = 0; i < data.length; i++) {
		console.log(data[i])
		if (data[i].childList && data[i].childList.length > 0) {
			temp = temp.concat(data[i].children)
		} 
		else {
			let newData = {};
			newData.name = list.enName;
			newData.title = list.cnName;
			newData.component = list.enName;
			newData['component'] = resolve => require([`@/views/${enName}`], resolve)
			// newData['component'] = window[list.enName];

			newData.meta = {
				title: list.cnName,
				level: list.level,
				seq: list.seq
			}
			routerList.push(newData)
		}
	}
	if (temp.length >= 1) {
		getRouterList(temp, routerList)
	}
	// data.map((list, i) => {
	// 	let newData = {};
	// 	newData.name = list.enName;
	// 	newData.title = list.cnName;
	// 	newData.component = list.enName;
	// 	newData['component'] = resolve => require([`@/views/${enName}`], resolve)
	// 	// newData['component'] = window[list.enName];
	// 	newData.meta = {
	// 		title: list.cnName,
	// 		level: list.level,
	// 		seq: list.seq
	// 	}
	// 	newData.childList = list.childList  ? changeRouterToDynamic(list.childList) : [];    //如果还有子集，就再次调用自己
	// 	temp.push(newData);
	// });
}
function routerGo(to, next) {
	getRouter = filterAsyncRouter(getRouter) //过滤路由
	router.addRoutes(getRouter) //动态添加路由
	global.antRouter = getRouter //将路由数据传递给全局变量，做侧边栏菜单渲染工作
	next({ ...to, replace: true })
  }
// component: null,
				// name: menuList[i].name,
				// meta: {
				// // icon: menuList[i].icon,
				// // index: menuList[i].id
				// }
				// cnName: menuList[i].cnName,
				// url: menuList[i].url,
				// level: menuList[i].level,
				// seq: menuList[i].seq


// 查功能树数据
async function search() {
	try {
		let res = await findMenuAllTree({bizLineId: 1});
		let routerData = res.data;
		// saveObjArr('router', routerData) // 存储路由到localStorage
		let menuList = changeRouterToDynamic(routerData);
		getRouterList(routerData);
		console.log(menuList, routerList)
	}
	catch (e) {
		console.log(e)
	}
}
export default router