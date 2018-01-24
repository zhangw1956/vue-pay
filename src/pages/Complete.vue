<template>
	<div class="jxd-complete">
		<JXDHeader titleText="支付完成"></JXDHeader>
		<div class="jxd-top">
			<div class="img">
				<img src="../assets/rechargeS.png" />
			</div>
			<div class="tip">
				支付成功
			</div>
			<div class="num">
				- {{ amount }}
			</div>
		</div>
	</div>
</template>

<script>
import JXDHeader from '../components/JXDHeader'
import SubmitBtn from '../components/SubmitBtn'

export default {
	name: 'Complete',
	components: {
		JXDHeader,
		SubmitBtn
	},
	data () {
		return {
			amount: '**'
		}
	},
	created () {
		// 获取路由参数
		this.amount = this.$route.params.amount
		this.orderId = this.$route.params.orderId
		this.userId = this.$route.params.userId
	}
}
</script>

<style scoped>
	.jxd-complete .jxd-top {
		background-color: #fff;
		padding-top: 25px;
		padding-bottom: 50px;
	}
	.jxd-complete .jxd-top .img {
		text-align: center;
		height: 100px;
	}
	.jxd-complete .jxd-top .img img {
		width: 70px;
		height: 70px;
	}
	.jxd-complete .tip {
		text-align: center;
		font-size: 16px;
		margin-bottom: 10px;
	}
	.jxd-complete .jxd-top .num {
		text-align: center;
		font-size: 25px;
	}
	.jxd-complete .jxd-bottom {
		background-color: #fff;
		margin-top: 10px;
	}
	.jxd-complete .jxd-bottom .title {
		padding: 15px;
		border-bottom: 1px solid rgb(239, 239, 244);
	}
	.jxd-complete .jxd-bottom .content {
		padding: 15px;
	}
	.jxd-complete .jxd-bottom .img {
		margin: 10px 0;
	}
	.jxd-complete .jxd-bottom .img img {
		width: 100%;
	}
</style>
