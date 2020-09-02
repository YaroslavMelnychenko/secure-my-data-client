<template>
	<div>
		<md-speed-dial md-effect="scale" 
			:class="['menu-add', 'md-bottom-right', shownClass]"
			md-event="click"
		>
			<md-speed-dial-target class="md-primary">
				<md-icon>add</md-icon>
				<md-tooltip md-direction="left">{{ App.trans().profile.addData }}</md-tooltip>
			</md-speed-dial-target>

			<md-speed-dial-content>
				<md-button class="md-icon-button"
					@click="onPlainDataAddClicked"
				>
					<md-icon>subject</md-icon>
					<md-tooltip md-direction="left">{{ App.trans().profile.addPlain }}</md-tooltip>
				</md-button>

				<md-button class="md-icon-button"
					@click="onAttachmentAddClicked"
				>
					<md-icon>insert_drive_file</md-icon>
					<md-tooltip md-direction="left">{{ App.trans().profile.addFile }}</md-tooltip>
				</md-button>
			</md-speed-dial-content>
		</md-speed-dial>
		<md-dialog 
			:md-active.sync="plainDialog.shown"
			class="menu-add__plain-data"
			:md-close-on-esc="false"
			:md-click-outside-to-close="false"
		>
      		<md-dialog-title>{{ App.trans().profile.addPlainData }}</md-dialog-title>
			<md-dialog-content>
				<md-field
					:class="$v.plainDialog.name.$error ? 'md-invalid' : ''"
				>
					<label for="plain_data_name">{{ App.trans().profile.name }}</label>
					<md-input name="plain_data_name" id="plain_data_name" 
						v-model.trim="plainDialog.name"
						md-counter="255"
					/>
					<span class="md-error"
						v-if="!$v.plainDialog.name.required" 
					>{{ App.trans().profile.insertName }}</span>
					<span class="md-error"
						v-else-if="!$v.plainDialog.name.maxLength" 
					>{{ App.trans().profile.charLimit }}</span>
				</md-field>
				<md-field
					:class="$v.plainDialog.text.$error ? 'md-invalid' : ''"
				>
					<label for="plain_data_text">{{ App.trans().profile.plainData }}</label>
					<md-textarea name="plain_data_text" id="plain_data_text"  
						v-model.trim="plainDialog.text"
						:md-counter="$store.getters.getApiSettings.rules.plain_data.max_size"
						class="md-scrollbar"
						style="resize: none;"
					/>
					<span class="md-error"
						v-if="!$v.plainDialog.text.required" 
					>{{ App.trans().profile.insertPlainData }}</span>
					<span class="md-error"
						v-else-if="!$v.plainDialog.text.maxLength" 
					>{{ App.trans().profile.plainDataLimit($store.getters.getApiSettings.rules.plain_data.max_size) }}</span>
				</md-field>
			</md-dialog-content>
			<md-dialog-actions>
				<md-button class="md-primary" @click="cancelPlainDialog">{{ App.trans().profile.cancel }}</md-button>
				<md-button class="md-primary" @click="submitPlainData">{{ App.trans().profile.save }}</md-button>
			</md-dialog-actions>
		</md-dialog>
		<md-dialog 
			:md-active.sync="attachmentDialog.shown"
			class="menu-add__attachment"
			:md-close-on-esc="false"
			:md-click-outside-to-close="false"
		>
			<md-dialog-title>{{ App.trans().profile.addFile }}</md-dialog-title>
			<md-dialog-content>
				<md-field
					:class="$v.attachmentDialog.file.$error ? 'md-invalid' : ''"
				>
					<label>{{ App.trans().profile.file }}</label>
					<md-file 
						v-model="attachmentDialog.fileName"
						@change="onFileChange"
					/>
					<span class="md-error"
						v-if="!$v.attachmentDialog.file.required" 
					>{{ App.trans().profile.chooseFile }}</span>
				</md-field>
			</md-dialog-content>
			<md-dialog-actions>
				<md-button class="md-primary" @click="cancelAttachmentDialog">{{ App.trans().profile.cancel }}</md-button>
				<md-button class="md-primary" @click="submitAttachmentDialog">{{ App.trans().profile.save }}</md-button>
			</md-dialog-actions>
		</md-dialog>
	</div>
</template>

<script>
import { required, maxLength } from 'vuelidate/lib/validators';

export default {
	name: 'menu-add',
	props: {
		shown: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			plainDialog: {
				shown: false,
				name: '',
				text: ''
			},
			attachmentDialog: {
				shown: false,
				file: null,
				fileName: ''
			}
		}
	},
	validations() {
		return {
			plainDialog: {
				name: {
					required,
					maxLength: maxLength(255)
				},
				text: {
					required,
					maxLength: maxLength(this.$store.getters.getApiSettings.rules.plain_data.max_size)
				}
			},
			attachmentDialog: {
				file: {
					required
				}
			}
		}
	},
	computed: {
		shownClass() {
			if(this.shown) return 'menu-add--shown';
			else return 'menu-add--hidden';
		}
	},
	methods: {
		submitAttachmentDialog() {
			this.$v.attachmentDialog.$touch();

			if(!this.$v.attachmentDialog.$invalid) {
				this.attachmentDialog.shown = false;
				App.loaderState(true);

				this.$api.storeAttachment(this.attachmentDialog.file).then(response => {
					this.clearAttachmentDialog();
					this.$emit('updateData');
				});
			}
		},

		cancelAttachmentDialog() {
			this.attachmentDialog.shown = false;
			this.clearAttachmentDialog();
		},

		clearAttachmentDialog() {
			this.attachmentDialog.file = null;
			this.attachmentDialog.fileName = '';
			this.$v.attachmentDialog.$reset();
		},

		onFileChange(e) {
			var allowedMimes = this.$store.getters.getApiSettings.rules.attachment.mime_types;
			var allowedSize = this.$store.getters.getApiSettings.rules.attachment.max_size;

			var file = e.target.files[0];

			if(file.size > allowedSize * 1024) {
				this.cancelAttachmentDialog();
				App.createAlert(App.trans().error, App.trans().profile.tooLargeFile(this.humanSize(allowedSize * 1024)));
			} else {
				var fileType = file.type || 'application/octet-stream';

				if(fileType.includes('image/') || fileType.includes('text/') || allowedMimes.indexOf(fileType) != -1) {
					this.attachmentDialog.file = file;
				} else {
					this.cancelAttachmentDialog();
					App.createAlert(App.trans().error, App.trans().profile.notSupported);
				}
			}			
		},

		onAttachmentAddClicked() {
			this.attachmentDialog.shown = true;
		},

		onPlainDataAddClicked() {
			this.plainDialog.shown = true;
		},

		cancelPlainDialog() {
			this.plainDialog.shown = false;
			this.clearPlainDialog();
		},

		clearPlainDialog() {
			this.plainDialog.name = '';
			this.plainDialog.text = '';
			this.$v.plainDialog.$reset();
		},

		submitPlainData() {
			this.$v.plainDialog.$touch();

			if(!this.$v.plainDialog.$invalid) {
				this.plainDialog.shown = false;
				App.loaderState(true);

				this.$api.storePlainData({
					plain_name: this.plainDialog.name,
					plain_data: this.plainDialog.text
				}).then(response => {
					this.clearPlainDialog();
					this.$emit('updateData');
				});
			}
		},

		humanSize(bytes) {
			var sizes = App.trans().profile.sizes;

			if (bytes == 0) return App.trans().profile.nullSize;
			if (bytes == null) return ' ';

			var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

			return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
		}
	}
}
</script>

<style lang="sass">
.menu-add,
	transition: opacity .3s ease-in-out
	z-index: 60

	&--shown
		opacity: 1

	&--hidden
		opacity: 0

	&__plain-data,
	&__attachment
		max-width: 400px
		width: 400px
</style>