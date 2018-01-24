<template>
	<div class="jxd-cashier">
		<JXDHeader titleText="支 付" isShow="0"></JXDHeader>
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
		</div>
	</div>
</template>

<script>
import JXDHeader from './JXDHeader'
import { Toast } from 'mint-ui'

/**
 *  数字键盘组件,限制金额数值在9999 ~ 0.01 之间
 */
export default {
	name: 'CashierDesk',
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
			this.$emit('cashierDeskClick', amount)
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
