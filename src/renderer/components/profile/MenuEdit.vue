<template>
	<div>
		<md-speed-dial md-effect="scale" 
			:class="['menu-edit', 'md-bottom-left', shownClass]"
			md-event="click"
		>
			<md-speed-dial-target class="md-accent">
				<md-icon>menu</md-icon>
				<md-tooltip md-direction="right">Меню дій</md-tooltip>
			</md-speed-dial-target>

			<md-speed-dial-content>
				<md-button class="md-icon-button"
					@click="onEditClicked"
				>
					<md-icon>create</md-icon>
					<md-tooltip md-direction="left">Змінити ім'я</md-tooltip>
				</md-button>

				<md-button class="md-icon-button"
					@click="onDownloadClicked"
				>
					<md-icon>get_app</md-icon>
					<md-tooltip md-direction="left">Завантажити</md-tooltip>
				</md-button>

				<md-button class="md-icon-button"
					@click="onDeleteClicked"
				>
					<md-icon>delete</md-icon>
					<md-tooltip md-direction="left">Видалити</md-tooltip>
				</md-button>
			</md-speed-dial-content>
		</md-speed-dial>
		<md-dialog-confirm
			:md-active.sync="showConfirm"
			md-title="Підтвердження"
			md-content="Ви впевнені що хочете видалити обрані дані?"
			md-confirm-text="Так"
			md-cancel-text="Ні"
			@md-cancel="showConfirm = false"
			@md-confirm="onDeleteConfirm" 
			:md-close-on-esc="false"
			:md-click-outside-to-close="false"
		/>
		<md-dialog-prompt
			class="menu-edit__prompt"
			:md-active.sync="showPrompt"
			v-model="promptValue"
			md-title="Введіть нове ім'я"
			:md-input-maxlength="255"
			md-input-placeholder="Нове ім'я"
			md-confirm-text="Зберегти"
			md-cancel-text="Відмінити" 
			:md-close-on-esc="false"
			:md-click-outside-to-close="false"
		/>
	</div>
</template>

<script>
const { dialog, app } = require('electron').remote;
var fs = require('fs');

export default {
	name: 'menu-edit',
	props: {
		shown: {
			type: Boolean,
			default: false
		},
		item: {
			type: Object,
			default: null
		}
	},
	data() {
		return {
			showConfirm: false,
			showPrompt: false,
			promptValue: null
		}
	},
	watch: {
		promptValue(value) {
			if(value != '' & value != null) {
				App.loaderState(true);

				this.$api.editData(this.item.id, {
					name: value
				}).then(response => {
					this.promptValue = null;
					this.$emit('updateData');
				});
			}
		}
	},
	computed: {
		shownClass() {
			if(this.shown) return 'menu-edit--shown';
			else return 'menu-edit--hidden';
		}
	},
	methods: {
		fullName(name, ext) {
			if(ext == null) return name;
			else return name + '.' + ext;
		},

		onEditClicked() {
			this.showPrompt = true;
		},

		onDeleteClicked() {
			this.showConfirm = true;
		},

		onDeleteConfirm() {
			App.loaderState(true);

			this.$api.deleteData(this.item.id).then(response => {
				this.$emit('updateData');
			});
		},

		onDownloadClicked() {
			if(this.item.mime_type !== null) {

				dialog.showSaveDialog(null, {
					defaultPath: app.getPath('documents') + '/' + this.fullName(this.item.name, this.item.ext)
				}, (path) => {
					if(path !== undefined) {
						this.downloadFile(path)
					}
				});

			} else {

				App.loaderState(true);

				this.$api.getData(this.item.id).then(response => {
					App.createAlert('Успішно', response.message);
				}).finally(() => {
					App.loaderState(false);
				});

			}
		},

		downloadFile(filePath) {
			App.progressLoaderState(true);

			var received_bytes = 0;
			var total_bytes = this.item.size;
			
			var req = this.$api.downloadData(this.item.id);

			var out = fs.createWriteStream(filePath);
			req.pipe(out);

			req.on('data', function(chunk) {
				received_bytes += chunk.length;
				App.progressLoaderSet(Math.trunc(received_bytes / total_bytes * 100));
				console.log(Math.trunc(received_bytes / total_bytes * 100));
			});

			req.on('end', function() {
				App.progressLoaderState(false);
				App.createAlert('Успішно', 'Файл успішно розшифровано, завантажено та збережено');
			});
		}
	}
}
</script>

<style lang="sass">
.menu-edit,
	transition: opacity .3s ease-in-out
	z-index: 60

	&--shown
		opacity: 1

	&--hidden
		opacity: 0

	&__prompt
		max-width: 400px
		width: 400px
</style>