<template>
	<CashierDesk v-on:cashierDeskClick="submitOrder"></CashierDesk>
</template>

<script>
import { Toast, Indicator } from 'mint-ui'
import CashierDesk from '../components/CashierDesk'
import request from '../utils/request'

export default {
	name: 'Wxpay',
	data () {
		return {
			openId: '',
			codeId: ''
		}
	},
	components: {
		CashierDesk
	},
	created () {
		this.openId = this.$route.params.openId
		this.codeId = this.$route.params.codeId
	},
	methods: {
		submitOrder (amount) {
			let vm = this
			Indicator.open()

			// 开始向服务端发起支付请求下单 amount 是用户输入的交易金额
			request()
				.post('', {
					openId: vm.openId,
					transAmount: amount,
					codeId: vm.codeId
				})
				.then(res => {
					if (res && res.code.toString() === '0000') {
						if (!res.response) {
							Toast('微信支付订单提交失败,系统未响应')
							return
						} else {
							vm._toWxpay(res.response.payInfo, res.response.orderId, amount)
						}
					} else {
						Toast({
							message: res.msg || '微信支付订单提交失败,失败信息未知',
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
		_toWxpay (payInfo, orderId, amount) {
			const onBridgeReady = () => {
				window.WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						'appId': payInfo.appId,
						// 公众号名称,由商户传入
						'timeStamp': payInfo.timeStamp,
						// 时间戳,自1970年以来的秒数
						'nonceStr': payInfo.nonceStr,
						// 随机串
						'package': payInfo.package,
						'signType': payInfo.signType,
						// 微信签名方式：
						'paySign': payInfo.paySign
						// 微信签名
					},
					res => {
						if (res.err_msg === 'get_brand_wcpay_request:ok') {
							this.$router.push({
								path: `/complete/${amount}`
							})
						}
						// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
					})
			}
			if (typeof WeixinJSBridge === 'undefined') {
				if (document.addEventListener) {
					document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
				} else if (document.attachEvent) {
					document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
					document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
				}
			} else {
				onBridgeReady()
			}
		}
	}
}
</script>

<style>
</style>
