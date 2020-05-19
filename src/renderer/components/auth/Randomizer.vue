<template>
	<div class="randomizer">
		<md-dialog class="randomizer"
			:md-active.sync="showDialog" 
			:md-click-outside-to-close="false" 
			:md-close-on-esc="false"
		>
			<md-dialog-title>Генерація ключової пари</md-dialog-title>
			<md-dialog-content>
				<div class="randomizer__description">Для генерації відкритого та закритого ключа необхідно отримати випадкові дані. Для цього наведіть мишку на поле нижче та виконуйте випадкові рухи в межах цього поля, на основі яких і буде створена ключова пара</div>
				<div class="randomizer__progress">
					<div class="randomizer__progress-label">Прогрес: {{ progress }}%</div>
					<md-progress-bar :class="['randomizer__progress-bar', progress == 100 ? 'randomizer__progress-bar--finished' : '']" md-mode="determinate" :md-value="progress"></md-progress-bar>
				</div>
				<div id="randomizer_block" :class="['randomizer__block', startedRecord && !finishedRecord ? 'randomizer__block--active' : '']" @mousemove="onMouseMove">
					<div class="randomizer__block-text"
						v-if="startedRecord && !finishedRecord"
					>Рухайте мишкою тут</div>
					<md-button type="submit" class="md-primary randomizer__block-button"
						v-if="!startedRecord"
						@click="startedRecord = true"
					>Розпочати</md-button>
					<div class="randomizer__block-spinner"
						v-if="showSpinner"
					>
						<md-progress-spinner class="randomizer__block-spinner-element"
							md-mode="indeterminate" 
							:md-diameter="40"
							:md-stroke="3"
						></md-progress-spinner>
						<div class="randomizer__block-spinner-label">Генерація</div>
					</div>
					<md-button class="md-primary md-raised randomizer__ready"
						v-if="keyReady"
						@click="onKeyDownload"
					>
						<md-icon>cloud_download</md-icon>
						<span>завантажити ключ</span>
					</md-button>
					<canvas id="randomizer_canvas"
						:style="showDrawing ? 'opacity: 1' : ''"
					></canvas>
				</div>
			</md-dialog-content>
		</md-dialog>
	</div>
</template>

<script>
const { dialog, app } = require('electron').remote;
const fs = require('fs');

export default {
	name: 'randomizer',
	props: {
		showDialog: {
			type: Boolean,
			default: false
		},
		userData: {
			type: Object,
			default: {}
		}
	},
	data() {
		return {
			movementsCounter: 0,
			movementsMatrix: {
				x: [],
				y: []
			},
			randomizeProgress: 0,
			randomMatrixSize: 128,
			recordStep: 2,

			seed: null,
			
			startedRecord: false,
			finishedRecord: false,
			showDrawing: false,
			showSpinner: false,
			keyReady: false,

			key: {
				name: null,
				content: null
			}
		}
	},
	computed: {
		progress() {
			return Math.ceil(this.randomizeProgress / this.randomMatrixSize * 100);
		}
	},
	methods: {
		signUpRequest() {
			var user = {
				email: this.userData.email,
				password: this.userData.password,
				seed: this.seed
			}

			setTimeout(() => {
				this.showDrawing = false;
			}, 1500);

			setTimeout(() => {
				this.showSpinner = true;
			}, 2000);  

			this.$api.signUp(user).then(response => {
				var name = response.headers['content-disposition'].split('=')[1];

				this.key.content = response.data;
				this.key.name = name;

				setTimeout(() => {
					this.showSpinner = false;
				}, 3500);

				setTimeout(() => {
					this.keyReady = true;
				}, 3500);
			});
		},  

		drawMovements() {
			var block = document.getElementById('randomizer_block');
			var canvas = document.getElementById('randomizer_canvas');
			canvas.width = block.clientWidth;
			canvas.height = block.clientHeight;

			var ctx = canvas.getContext('2d');
			ctx.beginPath();
		
			for(var i = 0; i < this.randomMatrixSize; i++) {
				if(i == 0) ctx.moveTo(this.movementsMatrix.x[i], this.movementsMatrix.y[i]);
				else ctx.lineTo(this.movementsMatrix.x[i], this.movementsMatrix.y[i]);
			}

			ctx.stroke();
		},

		processMatrix() {
			var block = document.getElementById('randomizer_block');
			var hex = '';

			for(var i = 0; i < this.randomMatrixSize; i++) {
				var x = Math.ceil(this.movementsMatrix.x[i] / block.clientWidth * 100);
				var y = Math.ceil(this.movementsMatrix.y[i] / block.clientHeight * 100);

				x = Math.ceil(Math.pow(x, 3) * Math.random());
				y = Math.ceil(Math.pow(y, 3) * Math.random());

				var n = ((x * y) % 256).toString(16);
				n = "00".substr(n.length) + n;
				hex += n;
			}

			this.seed = hex;
		},

		onMouseMove($event) {
			if(this.startedRecord && !this.finishedRecord) {
				this.movementsCounter++;

				if(this.movementsCounter == this.recordStep) {

					if(this.randomizeProgress != this.randomMatrixSize) {
						this.movementsCounter = 0;

						this.movementsMatrix.x.push($event.offsetX);
						this.movementsMatrix.y.push($event.offsetY);

						this.randomizeProgress++;
					} else {

						this.finishedRecord = true;

						this.drawMovements();
						this.processMatrix();

						this.showDrawing = true;

						this.signUpRequest();

					}

				}
			}
		},

		saveKey() {
			dialog.showSaveDialog(null, {
				defaultPath: app.getPath('documents') + '/' + this.key.name
			}, (path) => {
				if(path === undefined) {
					this.saveKey();
				} else {
					
					fs.writeFile(path, this.key.content, (err) => {
						if(err){
							App.createAlert('Помилка збереження файлу', err.message);
							return;
						}
									
						this.$emit('closeRandomizer');
					});

				}
			});
		},
		
		onKeyDownload() {
			this.saveKey();
		}
	}
}
</script>

<style lang="sass">
.randomizer
	max-height: 100%
	max-width: 500px

	&__description
		font-size: 14px
		text-align: justify

	&__progress
		margin-top: 15px

		&-label
			color: grey

		&-bar
			margin-top: 5px

			&--finished
				.md-progress-bar-fill
					background-color: rgba(0, 0, 0, .14) !important

	&__block
		margin-top: 10px
		height: 300px
		background-color: rgba(0, 0, 0, .14)
		color: grey
		display: flex
		align-items: center
		justify-content: center
		position: relative

		&--active
			cursor: crosshair

		canvas
			position: absolute
			left: 0
			top: 0
			width: 100%
			height: 100%
			opacity: 0
			transition: opacity .3s ease-in-out

		&-spinner
			text-align: center

			&-label
				color: #448aff

	&__ready
		.md-button-content
			display: flex
			align-items: center

			span
				margin-left: 5px
</style>