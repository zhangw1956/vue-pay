<template>
	<div class="j-a">
		{{ errMsg }}
	</div>
</template>

<script>
import getUrlParam from '../utils/getUrlParam'
import userAgent from '../utils/userAgent'
import request from '../utils/request'

export default {
	name: 'Authorize',
	data () {
		return {
			errMsg: ''
		}
	},
	created () {
		// 检测浏览器环境,微信和支付宝的授权认证都需要放在公网调试
		const ua = userAgent()
		const currentUrl = window.location.href
		const codeId = getUrlParam('code_id')
		if (!codeId) {
			this.errMsg = '无效的二维码'
			return
		}
		if (ua === 'wx') {
			// 微信环境下获取code
			const code = getUrlParam('code')
			if (code) {
				// 向服务端获取微信用户的openId
				request()
					.post('', {
						code: code
					})
					.then(res => {
						if (res.code === '0000') {
							this.$router.replace({
								path: `/wxpay/${res.response.openId}/${codeId}`
							})
						} else {
							this.errMsg = res.msg
						}
					})
					.catch(err => {
						this.errMsg = err.message
					})
			} else {
				// 没有进行微信登录认证，需要进行微信授权认证,在进行微信授权时候有一点需要注意，提供给微信的授权回调URL只能带一个参数
				// process.env.WX_APP_ID 微信公众号的appid 保存在config 配置文件
				const authorizeUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + process.env.WX_APP_ID + '&redirect_uri=' + currentUrl + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect'
				location.replace(authorizeUrl)
			}
		} else {
			// 支付宝环境下与微信不同需要获取auth_code
			const authCode = getUrlParam('auth_code')
			if (authCode) {
				// 向服务端获取用户的userId
				request()
					.post('', {
						code: authCode
					})
					.then(res => {
						if (res.code === '0000') {
							this.$router.replace({
								path: `/alipay/${res.response.userId}/${codeId}`
							})
						} else {
							this.errMsg = res.msg
						}
					})
					.catch(err => {
						this.errMsg = err.message
					})
			} else {
				// 没有经过支付宝授权，需要进行支付宝授权
				const authorizeUrl = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=' + process.env.ALI_APP_ID + '&scope=auth_user&redirect_uri=' + encodeURI(currentUrl)
				location.replace(authorizeUrl)
			}
		}
	}
}
</script>

<style scoped>
	.j-a {
		padding: 50px 20px;
		text-align: center;
		font-size: 1.5em;
	}
</style>
