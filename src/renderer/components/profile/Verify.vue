<template>
	<md-dialog 
		:md-active.sync="shown"
		class="verify"
		:md-close-on-esc="false"
		:md-click-outside-to-close="false"
	>
		<md-dialog-title>Підтвердження пошти</md-dialog-title>
		<md-dialog-content>
			<h4 class="verify__text">На вашу пошту було надіслано код підтвердження, введіть його в поле нижче.</h4>
			<h4 class="verify__text">Якщо код вам не надійшов натисніть кнопку щоб надіслати ще раз.</h4>
			<md-button class="verify__button md-dense md-primary"
				@click="onCodeResend"
			>Надіслати код</md-button>
			<md-field
				:class="$v.code.$error ? 'md-invalid' : ''"
			>
				<label for="verify_code">Код підтвердження</label>
				<md-input name="verify_code" id="verify_code" 
					v-model.trim="code"
					md-counter="6"
				/>
				<span class="md-error"
					v-if="!$v.code.required" 
				>введіть код</span>
				<span class="md-error"
					v-else-if="!$v.code.numeric" 
				>тільки цифри</span>
				<span class="md-error"
					v-else-if="!$v.code.maxLength" 
				>максимальна довжина 6 цифр</span>
			</md-field>
		</md-dialog-content>
		<md-dialog-actions>
			<md-button class="md-primary" @click="onCancel">Відмінити</md-button>
			<md-button class="md-primary" @click="onSubmit">Відправити</md-button>
		</md-dialog-actions>
	</md-dialog>	
</template>

<script>
import { required, maxLength, numeric } from 'vuelidate/lib/validators';

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
				maxLength: maxLength(6)
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
				App.createAlert('Успішно', 'Код підтвердження надіслано повторно');
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