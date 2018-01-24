<template>
	<div>
		<mt-button type="primary" size="large">{{ msg }}</mt-button>
	</div>
</template>

<script>
import Vue from 'vue/dist/vue.min.js'
import { Button } from 'mint-ui'

Vue.component(Button.name, Button)

/**
 *  提交按钮
 */
export default {
	name: 'SubmitBtn',
	props: ['msg']
}
</script>

<style>
	.mint-button--primary{
		background-color: #ef4f4f;
	}
</style>
