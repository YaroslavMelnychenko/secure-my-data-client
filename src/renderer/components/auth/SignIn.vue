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
			>{{ App.trans().auth.specify.email }}</span>
			<span class="md-error"
				v-else-if="!$v.email.email"
			>{{ App.trans().auth.wrong.format }}</span>
		</md-field>
		<md-field
			:class="$v.password.$error ? 'md-invalid' : ''"
		>
			<label for="sign_in_password">{{ App.trans().auth.password }}</label>
			<md-input name="sign_in_password" id="sign_in_password" type="password" 
				v-model.trim="password"
			/>
			<span class="md-error"
				v-if="!$v.password.required" 
			>{{ App.trans().auth.specify.password }}</span>
			<span class="md-error"
				v-else-if="!$v.password.minLength" 
			>{{ App.trans().auth.length(minPasswordLength) }}</span>
		</md-field>
		<md-field
			:class="$v.key.$error ? 'md-invalid' : ''"
		>
			<label>{{ App.trans().auth.key }}</label>
			<md-file 
				v-model="keyName"
				@change="onKeyChange"
			/>
			<span class="md-error"
				v-if="!$v.key.required" 
			>{{ App.trans().auth.specify.key }}</span>
		</md-field>
		<md-button type="submit" class="md-raised md-primary">{{ App.trans().auth.signIn }}</md-button>
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
				App.createAlert(App.trans().error, App.trans().auth.tooLargeOrWrongFormat);
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