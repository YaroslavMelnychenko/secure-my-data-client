<template>
	<form action="#" class="sign-up" @submit.prevent="onSubmit">
		<md-field
			:class="$v.email.$error ? 'md-invalid' : ''"
		>
			<label for="sign_up_email">Email</label>
			<md-input name="sign_up_email" id="sign_up_email" 
				v-model.trim="email"
			/>
			<span class="md-error"
				v-if="!$v.email.required" 
			>вкажіть пошту</span>
			<span class="md-error"
				v-else-if="!$v.email.email"
			>невірний формат</span>
		</md-field>
		<md-field
			:class="$v.password.$error ? 'md-invalid' : ''"
		>
			<label for="sign_up_password">Пароль</label>
			<md-input name="sign_up_password" id="sign_up_password" type="password" 
				v-model.trim="password"
			/>
			<span class="md-error"
				v-if="!$v.password.required" 
			>вкажіть пароль</span>
			<span class="md-error"
				v-else-if="!$v.password.strongPassword" 
			>хоча б одна літера в обох регістрах, цифра та спецсимвол</span>
			<span class="md-error"
				v-else-if="!$v.password.minLength" 
			>довжина не менше {{ minPasswordLength }} символів</span>
		</md-field>
		<md-field
			:md-toggle-password="false"
			:class="$v.passwordVerify.$error ? 'md-invalid' : ''"
		>
			<label for="sign_up_password_verify">Повторіть пароль</label>
			<md-input name="sign_up_password_verify" id="sign_up_password_verify" type="password" 
				v-model.trim="passwordVerify"
			/>
			<span class="md-error"
				v-if="!$v.passwordVerify.required" 
			>повторіть пароль</span>
			<span class="md-error"
				v-else-if="!$v.passwordVerify.sameAsPassword" 
			>паролі не співпадають</span>
		</md-field>
		<md-button type="submit" class="md-raised md-primary">Зареєструватись</md-button>
	</form>
</template>

<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators';

export default {
	name: 'sign-up',
	data() {
		return {
			minPasswordLength: 10,

			email: '',
			password: '',
			passwordVerify: ''
		}
	},
	validations() {
		return {
			email: {
				required,
				email,
			},
			password: {
				required,
				minLength: minLength(this.minPasswordLength),
				strongPassword(password) {
					return (
						/[a-z]/.test(password) && 
						/[A-Z]/.test(password) &&
						/[0-9]/.test(password) && 
						/\W|_/.test(password)
					);
				}
			},
			passwordVerify: {
				required,
				sameAsPassword: sameAs('password')
			}
		}
	},
	methods: {
		onSubmit() {
			this.$v.$touch();

			if(!this.$v.$invalid) {
				
				this.checkEmail().then(() => {

					this.$emit('openRandomizer', {
						showDialog: true,
						userData: {
							email: this.email,
							password: this.password
						}
					});

					this.resetForm();

				}).catch(() => {
					App.createAlert('Помилка', 'Користувач з такою поштою вже зареєстрований');
				});

			}
		},

		checkEmail() {
			App.loaderState(true);
			
			return new Promise((resolve, reject) => {
				this.$api.checkEmail(this.email).then(response => {
					App.loaderState(false);
					if(!response.message.exists) resolve();
					else reject();
				});
			});
		},

		resetForm() {
			this.email = '';
			this.password = '';
			this.passwordVerify = '';
			this.$v.$reset();
		}
	}
}
</script>