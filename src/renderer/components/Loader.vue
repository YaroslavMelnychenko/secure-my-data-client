<template>
	<div :class="['loader', show ? 'loader--show' : '', active ? 'loader--active' : '']">
		<md-progress-spinner class="loader__spinner"
			md-mode="indeterminate"
		></md-progress-spinner>
	</div>
</template>

<script>
export default {
	name: 'loader',
	props: {
		show: {
			type: Boolean,
			default: true
		},
		active: {
			type: Boolean,
			default: true
		}
	}	
}
</script>

<style lang="sass">
.loader
	position: fixed
	left: 0
	top: 0
	width: 100%
	height: 100%
	z-index: -1
	opacity: 0
	background-color: rgba(#000, .5)
	transition: opacity .35s ease-in-out

	&--active
		opacity: 1

	&--show
		z-index: 10000

	&__spinner
		position: absolute
		left: 50%
		top: 50%
		margin-left: -30px
		margin-top: -30px
</style>