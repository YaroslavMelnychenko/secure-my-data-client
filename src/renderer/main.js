import Vue from 'vue'
import axios from 'axios'

import VueMaterial from 'vue-material'
import Vuelidate from 'vuelidate'

import App from './App'
import router from './router'
import store from './store'
import api from './api'

var version = require('../../package.json').version

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.config.productionTip = false

Vue.appVersion = Vue.prototype.$appVersion = () => {
	return 'v' + version;
}

Vue.api = Vue.prototype.$api = api

Vue.use(VueMaterial)
Vue.use(Vuelidate)

/* eslint-disable no-new */
var Root = new Vue({
	components: { App },
	router,
	store,
	template: '<App/>'
}).$mount('#app')

window.App = Root.$children[0];
window.App.$router.replace('/');