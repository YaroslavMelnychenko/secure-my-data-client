<template>
	<div id="app">
		<preloader
            :active="preloader.active"
            :show="preloader.show"
        />
		<loader 
			:active="loader.active"
            :show="loader.show"
		/>
		<progress-loader
			:active="progressLoader.active"
			:show="progressLoader.show"
			:amount="progressLoader.amount"
		></progress-loader>
		<md-dialog class="app__alert"
            :md-active.sync="alert.show"
			:md-close-on-esc="false"
			:md-click-outside-to-close="false"
        >
            <md-dialog-title v-html="alert.title"></md-dialog-title>
            <md-dialog-content v-html="alert.content"></md-dialog-content>
            <md-dialog-actions>
                <md-button class="md-primary" 
					@click="alert.confirm.callback"
				>{{ alert.confirm.button }}</md-button>
            </md-dialog-actions>
        </md-dialog>
		<router-view></router-view>
	</div>
</template>

<script>
import Preloader from './components/Preloader'
import Loader from './components/Loader'
import ProgressLoader from './components/ProgressLoader'

export default {
	name: "smd-client",
	components: {
		Preloader,
		Loader,
		ProgressLoader
	},
	data() {
		return {
			preloader: {
				show: true,
				active: true
			},

			loader: {
				show: false,
				active: false
			},

			progressLoader: {
				show: false,
				active: false,
				amount: 0
			},

			alert: {
				show: false,
				title: '',
				content: '',

				confirm: {
					callback: () => {
						this.alert.show = false;
					},

					button: 'OK'
				}
			}
		}
	},
	methods: {
		preloaderState(state) {
			if(!state) {
				this.preloader.active = false;

				setTimeout(() => {
					this.preloader.show = false;
				}, 400);
			} else {
				this.preloader.show = true;

				setTimeout(() => {
					this.preloader.active = true;
				}, 50);
			}
		},

		loaderState(state) {
			if(!state) {
				this.loader.active = false;

				setTimeout(() => {
					this.loader.show = false;
				}, 400);
			} else {
				this.loader.show = true;

				setTimeout(() => {
					this.loader.active = true;
				}, 50);
			}
		},

		progressLoaderState(state) {
			if(!state) {
				this.progressLoader.active = false;

				setTimeout(() => {
					this.progressLoader.show = false;
					this.progressLoader.amount = 0;
				}, 400);
			} else {
				this.progressLoader.show = true;

				setTimeout(() => {
					this.progressLoader.active = true;
				}, 50);
			}
		},

		progressLoaderSet(amount) {
			this.progressLoader.amount = amount;
		},

		createAlert(title, content, confirm) {
			this.alert.title = title;
			this.alert.content = content;
			this.alert.show = true;

			if(confirm === undefined) {

				this.alert.confirm = {
					callback: () => {
						this.alert.show = false;
					},

					button: 'OK'
				}

			} else {

				if(confirm.callback !== undefined) this.alert.confirm.callback = confirm.callback;
				else this.alert.confirm.callback = () => {
					this.alert.show = false;
				};

				if(confirm.button !== undefined) this.alert.confirm.button = confirm.button;
				else this.alert.confirm.button = 'OK';

			}
		},

		getLanguage() {
			return this.$store.getters.getLanguage;
		},

		setLanguage(language) {
			this.$store.dispatch('setLanguage', language);
		},

		trans() {
			var currentLanguage = this.getLanguage();
			
			return this.$lang[currentLanguage];
		}
	},
	mounted() {
		setTimeout(() => {
			this.preloaderState(false);
		}, 1200);
	}
};
</script>

<style lang="sass">
@import './fonts'
@import './smart-grid'
@import '../../node_modules/vue-material/dist/vue-material.min.css'
@import '../../node_modules/vue-material/dist/theme/default.css'

+reset()

body
	font-size: 14px
	font-family: 'Roboto'

.md-dialog /deep/ .md-dialog-container
	transform: none
</style>