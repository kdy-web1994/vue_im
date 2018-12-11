import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/views/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component:()=>import(/* webpackChunkName: "HelloWorld" */ '@/views/HelloWorld')
    },
    {
      path: '/Im',
      name: 'Im',
      component:()=>import(/* webpackChunkName: "Im" */ '@/views/Im')
    }
  ]
})
