// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'      //router
import FastClick from 'fastclick'
import store from './store/store'  //vuex
import Api from './Api/api.js'

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
      FastClick.attach(document.body);
  }, false);
}

import './plugins/Toast/toast.css'; //自己写的插件css样式
import(/* webpackChunkName: "Toast" */ './plugins/Toast/toast').then((_)=>{  //引入插件
  Vue.use(_)
})

Vue.prototype.$Api = Api;


Vue.config.productionTip = false

import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
  'App':() => import('./App')
  },
  template: '<App/>'
})
