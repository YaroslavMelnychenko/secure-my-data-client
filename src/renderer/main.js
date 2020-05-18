import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

var version = require('../../package.json').version

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.appVersion = Vue.prototype.$appVersion = () => {
	return 'v' + version;
}

/* eslint-disable no-new */
var Root = new Vue({
	components: { App },
	router,
	store,
	template: '<App/>'
}).$mount('#app')

window.App = Root.$children[0];
