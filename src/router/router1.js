import Vue from 'vue'
import Router from 'vue-router'
import login from '../views/login.vue'
import home from '../views/home.vue'
import bizline from '../views/bizline.vue'
import user from '../views/user/index.vue'
import auth from '../views/auth/index.vue'
import func from '../views/func/index.vue'
import dictionary from '../views/dictionary'
import property from '../views/property.vue'
import bizentity from '../views/bizentity.vue'
import dimension from '../views/dimension/index.vue'
import strategy from '../views/strategy.vue'
import menu from '../views/menu/index.vue'
import notFound from '../views/notFound.vue'
import {findMenuAllTree} from '@/api/menu/index';
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
      children: [
        {
			path: '/system/bizline',
			name: 'bizline',
			component: bizline,
			meta: {
				title: '业务线管理'
			}
		},
		{
			path: '/system/dictionary',
			name: 'dictionary',
			component: dictionary,
			meta: {
				title: '字典管理'
			}
		},
		{
			path: '/system/property',
			name: 'property',
			component: property,
			meta: {
				title: '扩展属性'
			}
		},
        {
          path: '/user',
          name: 'user',
          component: user,
          meta: {
            title: '用户管理'
          }
        },
        {
          path: '/authorized/auth',
          name: 'auth',
          component: auth,
          meta: {
            title: '角色管理'
          }
        },
        {
          path: '/authorized/func',
          name: 'func',
          component: func,
          meta: {
            title: '功能管理'
          }
        },
        {
          path: '/authorized/menu',
          name: 'menu',
          component: menu,
          meta: {
            title: '菜单管理'
          }
        },
        {
          path: '/system/bizentity',
          name: 'bizentity',
          component: bizentity,
          meta: {
            title: '实体管理'
          }
        },
        {
          path: '/dimension',
          name: 'dimension',
          component: dimension,
          meta: {
            title: '维度管理'
          }
        },
        {
          path: '/authorized/strategy',
          name: 'strategy',
          component: strategy,
          meta: {
            title: '策略管理'
          }
        },
        {
          path: '*',
          name: 'notFound',
          component: notFound
        },
      ]
    },
  ]
})

// router.beforeEach((to, from, next) => {
// 	if (!RouterList) {
// 		// localStorage 里没有 去请求数据
// 		if (!getObjArr('router')) {
// 			search();
// 		}
// 		// 从localStorage拿到路由
// 		else {
// 			RouterList = getObjArr('router') //拿到路由
// 			// routerGo(to, next)
// 		}
// 	}
// 	else {
// 		next()
// 	}
// 	console.log(to)
// })

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
		newData.meta = {
			title: list.cnName
		}
		newData.children = list.children  ? changeRouterToDynamic(list.children) : [];    //如果还有子集，就再次调用自己
		item.push(newData);
	});
	return item;
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
		RouterList = res.data;
		console.log(RouterList)
		// saveObjArr('router', RouterList) // 存储路由到localStorage
		let menuList = changeRouterToDynamic(RouterList);
		console.log(menuList)
	}
	catch (e) {
		console.log(e)
	}
}
export default router