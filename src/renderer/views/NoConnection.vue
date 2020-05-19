<template>
	<div class="no-connection card-view">
        <div class="no-connection__wrapper">
            <md-empty-state class="md-primary no-connection__message"
                md-icon="error"
                md-label="Помилка"
                md-description="Відсутнє з'єднання з сервером"
            >
            </md-empty-state>
        </div>
    </div>
</template>

<script>
export default {
	name: 'no-connection',
	data() {
		return {
			loop: null
		}
	},
	mounted() {
		this.loop = setInterval(() => {
			this.$api.status().then(data => {
				clearInterval(this.loop);
				this.$router.replace({ 'name': 'landing-page' });
			});
		}, 3000);
	}
}
</script>

<style lang="sass">
.no-connection
	background-color: gainsboro
	position: relative
	padding: 0 30px
	display: flex
	align-items: center
	justify-content: center
	min-height: 100vh

	&__wrapper
		background-color: #fff
		border-radius: 2px
		box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)

	&__message
		min-width: 400px

		&-button
			width: 100%
</style>