<template>
    <div :class="['preloader', show ? 'preloader--show' : '', active ? 'preloader--active' : '']">
        <div class="preloader__wrapper">
            <div class="preloader__grid">
                <div class="preloader__row">
                    <div class="preloader__cube preloader__cube--1"></div>
                    <div class="preloader__cube preloader__cube--2"></div>
                    <div class="preloader__cube preloader__cube--3"></div>
                </div>
                <div class="preloader__row">
                    <div class="preloader__cube preloader__cube--4"></div>
                    <div class="preloader__cube preloader__cube--5"></div>
                    <div class="preloader__cube preloader__cube--6"></div>
                </div>
                <div class="preloader__row">
                    <div class="preloader__cube preloader__cube--7"></div>
                    <div class="preloader__cube preloader__cube--8"></div>
                    <div class="preloader__cube preloader__cube--9"></div>
                </div>
            </div>
            <div class="preloader__text">Secure My Data</div>
            <div class="preloader__copyright">by Yaroslav Melnychenko</div>
            <div class="preloader__version">{{ $appVersion() }}</div>
        </div>
    </div>
</template>

<script>
export default {
	name: 'preloader',
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

<style lang="sass" scoped>
$spinkit-size: 30px
$delayRange: 0.3s

@keyframes sk-cube-grid-scale-delay 
	0%, 70%, 100% 
		transform: scale3D(1,1,1)
	
	35%           
		transform: scale3D(0,0,1)
	
.preloader
	position: fixed
	left: 0
	top: 0
	z-index: -1
	height: 100%
	width: 100%
	opacity: 0
	display: flex
	align-items: center
	justify-content: center
	background-color: ghostwhite
	transition: opacity .35s ease-in-out

	&--active
		opacity: 1

	&--show
		z-index: 10000

	&__wrapper
		display: flex
		flex-direction: column
		justify-content: center
		align-items: center
	
	&__grid
		display: block

	&__row
		display: block
		height: #{$spinkit-size}

	&__cube
		display: flex
		width: #{$spinkit-size}
		height: #{$spinkit-size}
		background-color: #448aff
		float: left
		animation: sk-cube-grid-scale-delay 1.3s infinite ease-in-out

		&--1
			animation-delay: ($delayRange * 0.50)

		&--2
			animation-delay: ($delayRange * 0.75)

		&--3
			animation-delay: $delayRange

		&--4
			animation-delay: ($delayRange * 0.25)

		&--5
			animation-delay: ($delayRange * 0.50)

		&--6
			animation-delay: ($delayRange * 0.75)

		&--7
			animation-delay: 0s

		&--8
			animation-delay: ($delayRange * 0.25)

		&--9 
			animation-delay: ($delayRange * 0.50)

	&__text
		font-family: 'Roboto'
		font-weight: 500
		color: #448aff
		margin-top: 15px
		font-size: 1.5rem

	&__copyright
		color: grey
		margin-top: 5px
		font-size: 14px

	&__version
		color: grey
		margin-top: 0
		font-size: 12px
</style>