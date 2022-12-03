import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App.vue'

import studentScreen from "@/views/studentScreen.vue"
import professorScreen from "@/views/professorScreen.vue"
import homepage from "@/views/homepage.vue"
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
      path: "/student",
      component: studentScreen
    },
    {
      path: "/professor",
      component: professorScreen
    },
    {
      path: "/",
      component: homepage
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
