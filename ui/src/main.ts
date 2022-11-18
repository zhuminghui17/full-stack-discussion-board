import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App.vue'
import CustomerScreen from '@/views/CustomerScreen.vue'
import OperatorScreen from '@/views/OperatorScreen.vue'
import StatusScreen from '@/views/StatusScreen.vue'

import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue"

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/customer/:customerId",
      component: CustomerScreen,
      props: ({ params: { customerId }}) => ({ customerId }),
    },
    {
      path: "/operator/:operatorId",
      component: OperatorScreen,
      props: ({ params: { operatorId }}) => ({ operatorId }),
    },
    {
      path: "/",
      component: StatusScreen,
    }
  ],
})

Vue.config.productionTip = false
Vue.config.devtools = true

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  render: h => h(App),
})
