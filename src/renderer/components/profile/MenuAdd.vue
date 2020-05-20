<template>
	<div>
		<md-speed-dial md-effect="scale" 
			:class="['menu-add', 'md-bottom-right', shownClass]"
			md-event="click"
		>
			<md-speed-dial-target class="md-primary">
				<md-icon>add</md-icon>
				<md-tooltip md-direction="left">Додати дані</md-tooltip>
			</md-speed-dial-target>

			<md-speed-dial-content>
				<md-button class="md-icon-button"
					@click="onPlainDataAddClicked"
				>
					<md-icon>subject</md-icon>
					<md-tooltip md-direction="left">Додати текст</md-tooltip>
				</md-button>

				<md-button class="md-icon-button"
					@click="onAttachmentAddClicked"
				>
					<md-icon>insert_drive_file</md-icon>
					<md-tooltip md-direction="left">Додати файл</md-tooltip>
				</md-button>
			</md-speed-dial-content>
		</md-speed-dial>
		<md-dialog 
			:md-active.sync="plainDialog.shown"
			class="menu-add__plain-data"
			:md-close-on-esc="false"
			:md-click-outside-to-close="false"
		>
      		<md-dialog-title>Додати текстові дані</md-dialog-title>
			<md-dialog-content>
				<md-field
					:class="$v.plainDialog.name.$error ? 'md-invalid' : ''"
				>
					<label for="plain_data_name">Ім'я</label>
					<md-input name="plain_data_name" id="plain_data_name" 
						v-model.trim="plainDialog.name"
						md-counter="255"
					/>
					<span class="md-error"
						v-if="!$v.plainDialog.name.required" 
					>введіть ім'я</span>
					<span class="md-error"
						v-else-if="!$v.plainDialog.name.maxLength" 
					>не більше 255 символів</span>
				</md-field>
				<md-field
					:class="$v.plainDialog.text.$error ? 'md-invalid' : ''"
				>
					<label for="plain_data_text">Текст</label>
					<md-textarea name="plain_data_text" id="plain_data_text"  
						v-model.trim="plainDialog.text"
						:md-counter="$store.getters.getApiSettings.rules.plain_data.max_size"
						class="md-scrollbar"
						style="resize: none;"
					/>
					<span class="md-error"
						v-if="!$v.plainDialog.text.required" 
					>введіть текст</span>
					<span class="md-error"
						v-else-if="!$v.plainDialog.text.maxLength" 
					>не більше {{ $store.getters.getApiSettings.rules.plain_data.max_size }} символів</span>
				</md-field>
			</md-dialog-content>
			<md-dialog-actions>
				<md-button class="md-primary" @click="cancelPlainDialog">Відмінити</md-button>
				<md-button class="md-primary" @click="submitPlainData">Зберегти</md-button>
			</md-dialog-actions>
		</md-dialog>
		<md-dialog 
			:md-active.sync="attachmentDialog.shown"
			class="menu-add__attachment"
			:md-close-on-esc="false"
			:md-click-outside-to-close="false"
		>
			<md-dialog-title>Додати файл</md-dialog-title>
			<md-dialog-content>
				<md-field
					:class="$v.attachmentDialog.file.$error ? 'md-invalid' : ''"
				>
					<label>Файл</label>
					<md-file 
						v-model="attachmentDialog.fileName"
						@change="onFileChange"
					/>
					<span class="md-error"
						v-if="!$v.attachmentDialog.file.required" 
					>оберіть файл</span>
				</md-field>
			</md-dialog-content>
			<md-dialog-actions>
				<md-button class="md-primary" @click="cancelAttachmentDialog">Відмінити</md-button>
				<md-button class="md-primary" @click="submitAttachmentDialog">Зберегти</md-button>
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
				App.createAlert('Помилка', 'Файл занадто великий, максимальний розмір: ' + this.humanSize(allowedSize * 1024));
			} else {
				var fileType = file.type || 'application/octet-stream';

				if(fileType.includes('image/') || fileType.includes('text/') || allowedMimes.indexOf(fileType) != -1) {
					this.attachmentDialog.file = file;
				} else {
					this.cancelAttachmentDialog();
					App.createAlert('Помилка', 'Файл не підтримується');
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
			var sizes = ['Байт', 'кБ', 'МБ', 'ГБ', 'ТБ'];

			if (bytes == 0) return '0 Байт';
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