<template>
	<div></div>
</template>

<script>
export default {
	name: 'landing-page',
	created() {
		this.checkApiStatus();
	},
	methods: {
		checkApiStatus() {
			this.$api.status().then(data => {
				console.log(data);
				this.$store.dispatch('setApiSettings', data.message);
				this.$router.replace({ name: 'authentication' });
			}).catch(error => {
				this.$router.replace({ name: 'no-connection' });
			});
		}
	}
}
</script>