<template>
	<form action="#" class="sign-in" @submit.prevent="onSubmit">
		<md-field
			:class="$v.email.$error ? 'md-invalid' : ''"
		>
			<label for="sign_in_email">Email</label>
			<md-input name="sign_in_email" id="sign_in_email" 
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
			<label for="sign_in_password">Пароль</label>
			<md-input name="sign_in_password" id="sign_in_password" type="password" 
				v-model.trim="password"
			/>
			<span class="md-error"
				v-if="!$v.password.required" 
			>вкажіть пароль</span>
			<span class="md-error"
				v-else-if="!$v.password.minLength" 
			>довжина не менше {{ minPasswordLength }} символів</span>
		</md-field>
		<md-field
			:class="$v.key.$error ? 'md-invalid' : ''"
		>
			<label>Ключ</label>
			<md-file 
				v-model="keyName"
				@change="onKeyChange"
			/>
			<span class="md-error"
				v-if="!$v.key.required" 
			>оберіть ключ</span>
		</md-field>
		<md-button type="submit" class="md-raised md-primary">Увійти</md-button>
	</form>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators';

export default {
	name: 'sign-in',
	data() {
		return {
			minPasswordLength: 10,

			email: '',
			password: '',

			key: null,
			keyName: ''
		}
	},
	validations() {
		return {
			email: {
				required,
				email
			},
			password: {
				required,
				minLength: minLength(this.minPasswordLength)
			},
			key: {
				required
			}
		}
	},
	methods: {
		onKeyChange(e) {
			var file = e.target.files[0];

			if(file.size > 1000 || file.type != "") {
				this.key = null;
				this.keyName = '';
				App.createAlert('Помилка', 'Файл занадто великий або невірного формату');
			} else {
				this.key = file
			}
		},

		onSubmit() {
			this.$v.$touch();

			if(!this.$v.$invalid) {
				App.loaderState(true);

				this.$api.signIn({
					email: this.email,
					password: this.password,
					private_key: this.key
				}).then(response => {
					this.saveTokens(response);
				}).catch(error => {
					App.loaderState(false);
				});
			} 
		},

		saveTokens(response) {
			var tokens = {
				accessToken: response.message.access_token,
				refreshToken: response.message.refresh_token
			};

			this.$store.dispatch('setTokens', tokens).then(() => {
				this.$router.replace({ name: 'profile' });
			});
		}
	}
}
</script>