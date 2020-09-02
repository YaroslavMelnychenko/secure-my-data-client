<template>
	<div class="profile">
		<md-toolbar class="md-primary profile__header">
			<h3 class="md-title">{{ userEmail }}</h3>
		</md-toolbar>
		<md-content class="md-accent profile__not-verified"
			v-if="!verified"
		>
			{{ App.trans().profile.mailUnverified }}
			<md-button class="md-dense md-raised md-primary" @click="onVerifyOpen">{{ App.trans().profile.verify }}</md-button>
		</md-content>
		<data-table
			class="profile__content"
			:securedData="securedData"
			@selected="onSelected"
		></data-table>
		<menu-add
			:shown="verified"
			@updateData="onDataUpdate"
		></menu-add>
		<menu-edit
			:shown="selected != null"
			:item="selected"
			@updateData="onDataUpdate"
		></menu-edit>
		<verify
			:shown="verifyShown"
			@closeVerification="onVerificationClose"
			@updateUserData="onUserDataUpdate"
		></verify>
	</div>
</template>

<script>
import DataTable from '../components/profile/DataTable';
import MenuAdd from '../components/profile/MenuAdd';
import MenuEdit from '../components/profile/MenuEdit';
import Verify from '../components/profile/Verify';

export default {
	name: 'profile',
	components: {
		DataTable,
		MenuAdd,
		MenuEdit,
		Verify
	},
	data() {
		return {
			userData: null,
			securedData: [],

			selected: null,
			verifyShown: false
		}
	},
	beforeMount() {
		this.getUserDetails().then(() => {
			if(this.userData.verified == 1) {
				this.getSecuredData();
			}
		});
	},
	methods: {
		onUserDataUpdate() {
			this.getUserDetails().then(() => {
				App.createAlert(App.trans().success, App.trans().profile.verified);
			});
		},

		onVerifyOpen() {
			this.verifyShown = true;
		},

		onVerificationClose() {
			this.verifyShown = false;
		},

		getUserDetails() {
			return new Promise((resolve, reject) => {
				this.$api.userDetails().then(response => {
					App.loaderState(false);
					this.userData = response.message;
					resolve();
				});
			});
		},

		getSecuredData() {
			this.$api.userSecureData().then(response => {
				this.securedData = response.message;
				this.searched = this.securedData;
				App.loaderState(false);
			})
		},

		onSelected(payload) {
			this.selected = payload;
		},

		onDataUpdate() {
			this.getSecuredData();
		}
	},
	computed: {
		verified() {
			if(this.userData == null) return true;
			if(this.userData.verified == 1) return true;
			else return false;
		},

		userEmail() {
			if(this.userData == null) return ' ';
			else return this.userData.email;
		}
	}
}
</script>

<style lang="sass">
.profile
	background-color: gainsboro
	min-height: 100vh

	&__content
		background-color: gainsboro !important
		padding: 30px
		max-height: calc(100vh - 64px)
		overflow: auto

	&__not-verified
		padding: 10px 25px
		display: flex
		align-items: center

	.md-card.md-table
		max-width: 1000px
		margin: 0 auto

	.md-table-row.md-selected-single
		font-weight: inherit

		.md-icon
			color: #fff

	.md-empty-state-icon
		width: 100px
		min-width: 100px
		height: 100px
		font-size: 100px !important
</style>