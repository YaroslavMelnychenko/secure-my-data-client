<template>
	<md-dialog 
		:md-active.sync="shown"
		class="verify"
		:md-close-on-esc="false"
		:md-click-outside-to-close="false"
	>
		<md-dialog-title>{{ App.trans().profile.emailConfirmation }}</md-dialog-title>
		<md-dialog-content>
			<h4 class="verify__text">{{ App.trans().profile.emailConfirmationTexts[0] }}</h4>
			<h4 class="verify__text">{{ App.trans().profile.emailConfirmationTexts[1] }}</h4>
			<md-button class="verify__button md-dense md-primary"
				@click="onCodeResend"
			>{{ App.trans().profile.sendCode }}</md-button>
			<md-field
				:class="$v.code.$error ? 'md-invalid' : ''"
			>
				<label for="verify_code">{{ App.trans().profile.confirmationCode }}</label>
				<md-input name="verify_code" id="verify_code" 
					v-model.trim="code"
					md-counter="6"
				/>
				<span class="md-error"
					v-if="!$v.code.required" 
				>{{ App.trans().profile.enterCode }}</span>
				<span class="md-error"
					v-else-if="!$v.code.numeric" 
				>{{ App.trans().profile.onlyNumbers }}</span>
				<span class="md-error"
					v-else-if="!$v.code.maxLength" 
				>{{ App.trans().profile.maxCodeLength }}</span>
				<span class="md-error"
					v-else-if="!$v.code.minLength" 
				>{{ App.trans().profile.minCodeLength }}</span>
			</md-field>
		</md-dialog-content>
		<md-dialog-actions>
			<md-button class="md-primary" @click="onCancel">{{ App.trans().profile.cancel }}</md-button>
			<md-button class="md-primary" @click="onSubmit">{{ App.trans().profile.send }}</md-button>
		</md-dialog-actions>
	</md-dialog>	
</template>

<script>
import { required, maxLength, minLength, numeric } from 'vuelidate/lib/validators';

export default {
	name: 'verify',
	props: {
		shown: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			code: ''
		}
	},
	validations() {
		return {
			code: {
				required,
				numeric,
				maxLength: maxLength(6),
				minLength: minLength(6)
			}
		}
	},
	methods: {
		onCancel() {
			this.$emit('closeVerification');
			this.clear();
		},

		onSubmit() {
			this.$v.$touch();

			if(!this.$v.$invalid) {
				this.$emit('closeVerification');
				App.loaderState(true);

				this.$api.verifyEmail(this.code).then(response => {
					this.$emit('updateUserData');
				}).catch(error => {
					App.loaderState(false);
				}).finally(() => {
					this.clear();
				});
			}
		},

		clear() {
			this.code = '';
			this.$v.$reset();
		},

		onCodeResend() {
			App.loaderState(true);

			this.$api.resendVerificationCode().then(response => {
				App.loaderState(false);
				App.createAlert(App.trans().success, App.trans().profile.resended);
			});
		}
	}
}
</script>

<style lang="sass">
.verify
	max-width: 400px
	width: 400px
	z-index: 6

	&__button
		width: 100%
		margin-left: 0
		margin-right: 0

	&__text
		margin-bottom: 15px
</style>