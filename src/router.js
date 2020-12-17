import Vue from 'vue'
import Router from 'vue-router'
import login from './views/login.vue'
import home from './views/home.vue'
import bizline from './views/bizline.vue'
import user from './views/user.vue'
import auth from './views/auth.vue'
import func from './views/func.vue'
import dictionary from './views/dictionary.vue'
import property from './views/property.vue'
import bizentity from './views/bizentity.vue'
import dimension from './views/dimension.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/',
      component: home,
      meta: {
        title: '首页'
      },
      children: [
        {
          path: '/bizline',
          name: 'bizline',
          component: bizline,
          meta: {
            title: '业务线管理'
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
          path: '/auth',
          name: 'auth',
          component: auth,
          meta: {
            title: '角色管理'
          }
        },
        {
          path: '/func',
          name: 'func',
          component: func,
          meta: {
            title: '功能管理'
          }
        },
        {
          path: '/dictionary',
          name: 'dictionary',
          component: dictionary,
          meta: {
            title: '字典管理'
          }
        },
        {
          path: '/property',
          name: 'property',
          component: property,
          meta: {
            title: '扩展属性'
          }
        },
        {
          path: '/bizentity',
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
      ]
    },
  ]
})
