import Vue from 'vue'
import Router from 'vue-router'
import login from './views/login.vue'
import home from './views/home.vue'
import bizline from './views/bizline.vue'
import user from './views/user.vue'
import auth from './views/auth.vue'
import manage from './views/manage.vue'
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
      children: [
        {
          path: '/bizline',
          name: 'bizline',
          component: bizline
        },
        {
          path: '/user',
          name: 'user',
          component: user
        },
        {
          path: '/auth',
          name: 'auth',
          component: auth
        },
        {
          path: '/manage',
          name: 'manage',
          component: manage
        },
        {
          path: '/dictionary',
          name: 'dictionary',
          component: dictionary
        },
        {
          path: '/property',
          name: 'property',
          component: property
        },
        {
          path: '/bizentity',
          name: 'bizentity',
          component: bizentity
        },
        {
          path: '/dimension',
          name: 'dimension',
          component: dimension
        },
      ]
    },
  ]
})
