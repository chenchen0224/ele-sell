import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'

import '@common/css/reset.css'//可应用优化后的路径
import '@common/css/icon.css'

Vue.use(VueResource);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
