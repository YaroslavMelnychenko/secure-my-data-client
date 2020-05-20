<template>
	<div class="authentication">
		<div class="authentication__wrapper">
			<md-card class="authentication-form__card">
				<md-card-header class="authentication-form__card-header">
					<div class="md-title">Увійдіть або зареєструйтесь</div>
				</md-card-header>
				<md-card-content class="authentication-form__card-content">
					<md-tabs class="authentication-form__card-tabs"
						:md-active-tab="activeTab"
					>
						<md-tab id="tab_sign_in" md-label="Увійти">
							<sign-in class="authentication-form__form"></sign-in>
						</md-tab>
						<md-tab id="tab_sign_up" md-label="Зареєструватись">
							<sign-up class="authentication-form__form"
								@openRandomizer="onRandomizerOpen"
							></sign-up>
						</md-tab>
					</md-tabs>
				</md-card-content>
			</md-card>
		</div>
		<randomizer 
			:showDialog="showDialog"
            :userData="userData"
			@closeRandomizer="onRandomizerClose"
		/>
	</div>
</template>

<script>
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';
import Randomizer from '../components/auth/Randomizer';

export default {
	name: 'authentication',
	components: {
		SignIn,
		SignUp,
		Randomizer
	},
	data() {
		return {
			activeTab: 'tab_sign_in',
			showDialog: false,
			userData: {},
		}
	},
	methods: {
		onRandomizerOpen(payload) {
			this.showDialog = payload.showDialog;
			this.userData = payload.userData;
		},

		onRandomizerClose() {
			this.showDialog = false;
			this.activeTab = 'tab_sign_in';
			App.createAlert('Успішно', 'Ви зареєстровані в системі. На вашу електронну пошту було надіслано лист для підтвердження. Щоб почати користуватись сервісом використовуйте отриманий ключ та пароль.<br><br>Не передавайте ключ стороннім особам та не повідомляйте ваш пароль, інакше ваші дані опиняться в небезпеці.');
		},

		redirectToProfile() {
			this.$router.replace({ name: 'profile' });
		}
	}
}
</script>

<style lang="sass">
@import '../smart-grid'

.authentication
	background-color: gainsboro
	position: relative
	padding: 0 30px
	
	&__wrapper
		+wrapper()
		display: flex
		justify-content: center
		align-items: center
		height: 100vh
		padding-top: 30px
		padding-bottom: 30px

.authentication-form
	&__card
		width: 400px

		&-header
			text-align: center

		&-content:last-of-type
			padding-bottom: 0

		&-tabs
			margin-left: -16px
			margin-right: -16px

			.md-tabs-navigation
				display: flex

				button
					width: 50%
	&__form
		button[type="submit"]
			margin: 0
			margin-top: 10px
			width: 100%

		.md-field:first-child
			margin-top: 0
</style>