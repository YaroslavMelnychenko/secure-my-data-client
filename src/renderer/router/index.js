import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'landing-page',
			component: require('@/views/LandingPage').default
		},
		{
			path: '/no-connection',
			name: 'no-connection',
			component: require('@/views/NoConnection').default
		},
		{
			path: '/authentication',
			name: 'authentication',
			component: require('@/views/Authentication').default
		},
		{
			path: '/profile',
			name: 'profile',
			component: require('@/views/Profile').default
		},
		{
			path: '*',
			redirect: '/'
		}
	]
})
