import Vue from 'vue/dist/vue.min.js'
import VueRouter from 'vue-router'

import Authorize from '../pages/Authorize.vue'
import Alipay from '../pages/Alipay'
import Wxpay from '../pages/Wxpay'
import Complete from '../pages/Complete.vue'
import notFound from '../pages/404'

Vue.use(VueRouter)

/**
 *  路由表
 *  本项目的路由实现的是APP式返回无刷新路由功能，打开新页面则要重新组件组件，通过判断isBack以及应用路由的全局守卫钩子实现功能
 *  isBack 判断是返回还是打开新页面的变量
 */
const routes = [{
	path: '/',
	component: Authorize,
	alias: '/authorize',
	meta: {
		isBack: false,
		keepAlive: true
	}
},
{
	name: '/wxpay',
	path: '/wxpay/:openId/:codeId',
	component: Wxpay,
	meta: {
		isBack: false,
		keepAlive: true
	}
},
{
	name: '/alipay',
	path: '/alipay/:userId/:codeId',
	component: Alipay,
	meta: {
		isBack: false,
		keepAlive: true
	}
},
{
	name: '/complete',
	path: '/complete/:amount',
	component: Complete,
	meta: {
		isBack: false,
		keepAlive: true
	}
},
{
	path: '*',
	component: notFound
}]

const router = new VueRouter({
	base: '/',
	scrollBehavior (to, from, savedPosition) {
		return {
			x: 0,
			y: 0
		}
	},
	routes
})

// 全局前置守卫,打开新页面之前根据当前页面的isBack，决定是否缓存下一个页面
router.beforeEach((to, from, next) => {
	from.meta.isBack && (to.meta.keepAlive = false)
	next()
})

// 全局后置守卫，离开当前页面后根据当前页面的isBack 决定是否缓存下一个页面
router.afterEach((to, from) => {
	from.meta.isBack && (to.meta.keepAlive = true)
})

// 返回缓存的组件需结合 头部导航组件JXDHeader 使用
export default router
