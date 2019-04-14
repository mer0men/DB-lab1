import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import PrettyCheckbox from 'pretty-checkbox-vue'
import BootstrapVue from 'bootstrap-vue'
import VAnimateCss from 'v-animate-css'
import VeeValidate from 'vee-validate'
import 'pretty-checkbox/dist/pretty-checkbox.min.css'
import 'vue-good-table/dist/vue-good-table.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './plugins/element.js'

export const eventBus = new Vue()

Vue.use(VAnimateCss)
Vue.use(BootstrapVue)
Vue.use(PrettyCheckbox)
Vue.use(VueAxios, axios)
Vue.use(VeeValidate, { inject: true })

Vue.config.productionTip = true

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
