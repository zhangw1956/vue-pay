<template>
	<div class="jxd-cashier">
		<JXDHeader titleText="支 付"></JXDHeader>
		<div class="jxd-content">
			<div class="jxd-input">
				<p class="jxd-input-title">
					请输入金额
				</p>
				<div class="jxd-text">
					<span>￥</span>
					<span>
						{{ result }}
					</span>
				</div>
			</div>

			<div class="jxd-key-box">
				<div class="jxd-key">
					<div class="num">
						<div class="col">
							<div class="item" id="7" @click="inputNumber">7</div>
							<div class="item" id="4" @click="inputNumber">4</div>
							<div class="item" id="1" @click="inputNumber">1</div>
							<div class="item" id="." @click="inputNumber">.</div>
						</div>
						<div class="col">
							<div class="item" id="8" @click="inputNumber">8</div>
							<div class="item" id="5" @click="inputNumber">5</div>
							<div class="item" id="2" @click="inputNumber">2</div>
							<div class="item" id="0" @click="inputNumber">0</div>
						</div>
						<div class="col">
							<div class="item" id="9" @click="inputNumber">9</div>
							<div class="item" id="6" @click="inputNumber">6</div>
							<div class="item" id='3' @click="inputNumber">3</div>
							<div class="item" id="00" @click="inputNumber">00</div>
						</div>
					</div>
					<div class="mark">
						<div class="item" id="del" @click="inputNumber">删除</div>
						<div class="item" id="c" @click="inputNumber">确定</div>
					</div>
				</div>
			</div>
			<!--			
			<SubmitBtn msg="确 认" @clicked="doConfirm"/>-->
		</div>
	</div>
</template>

<script>
import JXDHeader from '../components/JXDHeader'
import { Toast, Indicator } from 'mint-ui'
import request from '../utils/request'

export default {
	name: 'Cashier',
	components: {
		JXDHeader
	},
	computed: {
		result () {
			return this.numbers.join('')
		}
	},
	data () {
		return {
			numbers: [],
			alipayForm: ''
		}
	},
	methods: {
		inputNumber () {
			const value = event.target.id
			if (value === 'del') {
				this.numbers.pop()
			} else if (value === 'c') {
				this._doConfirm()
			} else {
				const result = this.result
				if (result.length === 0) {
					this.numbers.push(value === '0' || value === '00' || value === '.' ? '0.' : value)
				} else {
					if (result.indexOf('.') > -1) {
						result.split('.')[1].length < 2 && value !== '.' && this.numbers.push(value === '00' ? '0' : value)
					} else {
						if (result.length > 4) {
							Toast({
								message: '交易金额过大',
								position: 'bottom',
								duration: 5000
							})
						} else {
							this.numbers.push(value)
						}
					}
				}
			}
		},
		_wxOrder (amount, openId, objectId) {
			// this.$router.push({path: '/complete/123/1231312/123213123/1'})
			let vm = this
			Indicator.open()
			request()
				.post('/jxd_apps/shop/mercentConsumeAppOutWx', {
					openId: openId,
					transAmount: amount,
					shopId: objectId
				})
				.then(res => {
					if (res && res.code.toString() === '0000') {
						if (!res.response) {
							Toast('微信支付订单提交失败,系统未响应')
							return
						} else {
							vm._wxPay(res.response.payInfo || {}, res.response.orderId || '', amount, res.response.isShow || '0', openId)
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
		_wxPay (payInfo, orderId, amount, isShow, openId) {
			const onBridgeReady = (payInfo) => {
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
								path: `/complete/${amount}/${orderId}/${openId}/${isShow}`
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
				onBridgeReady(payInfo)
			}
		},
		_aliOrder (amount, openId, objectId) {
			const returnUrlPage = 'http://www.jingxiduo.net/jxd-vis/src/index.html#/complete'
			let vm = this
			Indicator.open()
			request()
			.post('/jxd_apps/shop/mercentConsumeAppOutZfb', {
				returnURLPage: returnUrlPage,
				authCode: openId,
				transAmount: amount,
				shopId: objectId
			})
			.then(res => {
				if (res && res.code.toString() === '0000') {
					if (!res.response) {
						Toast('支付宝支付订单提交失败,系统未响应')
						return
					} else {
						vm._aliPay(res.response.payInfo || '')
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
		_aliPay (payInfo) {
			if (payInfo) {
				const div = document.createElement('div') // 创建div
				div.innerHTML = payInfo // 将返回的form 放入div
				document.body.appendChild(div)
				document.forms[0].submit()
			} else {
				Toast({
					message: '支付宝发起支付失败,订单信息不存在',
					position: 'bottom'
				})
			}
		},
		_doConfirm () {
			// 下单
			let amount = this.result
			if (!amount.split('.')[1]) {
				amount = amount.split('.')[0]
			}
			if (!amount || parseFloat(amount) === 0) {
				Toast({
					message: '请输入金额',
					position: 'bottom',
					duration: 5000
				})
				return
			}
			const payId = this.$route.params.payId
			const openId = this.$route.params.openId
			const objectId = this.$route.params.objectId
			switch (payId) {
			case 'wx':
				this._wxOrder(amount, openId, objectId)
				break
			case 'ali':
				this._aliOrder(amount, openId, objectId)
				break
			}
		}
	}
}
</script>

<style scoped>
	.jxd-cashier {
		overflow: hidden;
	}
	
	.jxd-cashier .jxd-content {
		padding: 10px;
	}
	
	.jxd-cashier .jxd-input {
		background-color: #fff;
		padding: 20px;
	}
	
	.jxd-cashier .jxd-text {
		font-size: 2em;
	}
	
	.jxd-cashier .jxd-input-title {
		color: gray;
		margin-bottom: 10px;
	}
	
	.jxd-cashier .jxd-key-box {
		overflow: hidden;
		position: relative;
		margin-top: 10px;
	}
	
	.jxd-cashier .jxd-key-box:after {
		display: block;
		content: '';
		padding-top: 100%;
	}
	
	.jxd-cashier .jxd-key {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
	}
	
	.jxd-cashier .jxd-key .num {
		flex: 3;
		display: flex;
	}
	
	.jxd-cashier .jxd-key .num .col {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	
	.jxd-cashier .jxd-key .num .col .item {
		display: flex;
		flex: 1;
		justify-content: center;
		align-items: center;
		font-size: 2em;
	}
	
	.jxd-cashier .jxd-key .mark {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	
	.jxd-cashier .jxd-key .mark .item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.5em;
	}
	
	.jxd-cashier .jxd-key .item {
		border: 1px solid #e5e5e5;
		border-radius: 3px;
		background-color: #fff;
	}
	
	.jxd-cashier .jxd-key .item:active {
		background-color: #C8C8CD;
	}
</style>
