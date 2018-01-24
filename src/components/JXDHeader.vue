<template>
	<mt-header :title="titleText">
		<mt-button icon="back" slot="left" @click="goBackBtn" v-show="isShow===1">返回</mt-button>
	</mt-header>
</template>

<script>
import Vue from 'vue/dist/vue.min.js'
import { Header } from 'mint-ui'

Vue.component(Header.name, Header)

/**
 *  头部导航组件,默认显示返回按钮
 */
export default {
	name: 'JXDHeader',
	props: {
		isShow: {
			default: 1
		},
		titleText: {
			required: true
		}
	},
	methods: {
		goBackBtn () {
			// 返回上一页 同时 将当前页面标记为返回
			this.$router.currentRoute.meta.isBack = true
			this.$router.go(-1)
		}
	}
}
</script>

<style scoped>
	.mint-header {
		background-color: #fff;
		color: #000;
		height: 44px;
		font-size: 16px;
	}
	.mint-header-title {
		font-size: 1.2em;
	}
</style>
