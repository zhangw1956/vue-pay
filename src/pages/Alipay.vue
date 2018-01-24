<template>
	<CashierDesk v-on:cashierDeskClick="submitOrder"></CashierDesk>
</template>

<script>
import { Toast, Indicator } from 'mint-ui'
import CashierDesk from '../components/CashierDesk'
import request from '../utils/request'

export default {
	name: 'Alipay',
	data () {
		return {
			userId: '',
			codeId: ''
		}
	},
	components: {
		CashierDesk
	},
	created () {
		this.userId = this.$route.params.userId
		this.codeId = this.$route.params.codeId
	},
	methods: {
		submitOrder (amount) {
			const returnUrlPage = window.location.href.split('#')[0] + '/complete'
			let vm = this
			Indicator.open()
			// 向服务端发起支付请求下单，returnUrlPage 为 支付宝支付完成的回调地址，需要前端控制路由参数 需要服务端向支付宝系统下单时候 加上交易金额
			request()
				.post('', {
					returnURLPage: returnUrlPage,
					authCode: vm.userId,
					transAmount: amount,
					shopId: vm.codeId
				})
				.then(res => {
					if (res && res.code.toString() === '0000') {
						if (!res.response) {
							Toast('支付宝支付订单提交失败,系统未响应')
							return
						} else {
							vm._toPay(res.response.payInfo)
						}
					} else {
						Toast({
							message: res.msg || '支付宝支付订单提交失败,失败信息未知',
							position: 'bottom'
						})
					}
					Indicator.close()
				})
				.catch(err => {
					Indicator.close()
					Toast({
						message: err.message,
						position: 'bottom'
					})
				})
		},
		_toPay (payInfo) {
			if (payInfo) {
				const div = document.createElement('div') // 创建div
				div.innerHTML = payInfo // 将返回的form 放入div
				document.body.appendChild(div)
				// 向支付发起支付
				document.forms[0].submit()
			} else {
				Toast({
					message: '支付宝发起支付失败,订单信息不存在',
					position: 'bottom'
				})
			}
		}
	}
}
</script>

<style>
</style>
