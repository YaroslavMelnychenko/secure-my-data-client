<template>
	<md-content class="md-scrollbar">
		<md-table 
			v-model="searched"  
			md-card 
			@md-selected="onSelect"
			:md-sort.sync="currentSort" 
			:md-sort-order.sync="currentSortOrder" 
			:md-sort-fn="customSort"
		>
			<md-table-toolbar>
				<h1 class="md-title">Мої дані</h1>
				<md-field md-clearable class="md-toolbar-section-end">
					<md-input placeholder="Пошук за ім'ям" v-model="search" @input="searchOnTable" />
				</md-field>
			</md-table-toolbar>

			<md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single" class="md-primary">
				<md-table-cell md-label="Ім'я" md-sort-by="name">{{ fullName(item.name, item.ext) }}</md-table-cell>
				<md-table-cell md-label="Тип" md-sort-by="type"> 
					<md-icon class="md-size-1x">{{ getType(item.mime_type) }}</md-icon>
				</md-table-cell>
				<md-table-cell md-label="Розмір" md-sort-by="size">{{ item.size | humanSize }}</md-table-cell>
				<md-table-cell md-label="Дата завантаження" md-sort-by="date">{{ item.created_at | humanDate }}</md-table-cell>
			</md-table-row>

			<md-table-empty-state
				class="md-primary"
				md-icon="cloud_off"
				md-label="Даних не знайдено"
			>
			</md-table-empty-state>
		</md-table>
	</md-content>
</template>

<script>
export default {
	name: 'data-table',
	props: {
		securedData: {
			type: Array,
			default: []
		}
	},
	data() {
		return {
			searched: [],

			currentSort: 'date',
			currentSortOrder: 'desc',

			search: null
		}
	},
	watch: {
		securedData(val) {
			this.searched = val.slice();
			this.customSort(this.searched);
		}
	},
	methods: {
		fullName(name, ext) {
			if(ext == null) return name;
			else return name + '.' + ext;
		},

		getType(mime_type) {
			if(mime_type == null) return 'subject';
			else return 'insert_drive_file';
		},

		searchOnTable () {
			this.searched = this.searchByName(this.securedData, this.search)
		},

		toLower(text) {
			return text.toString().toLowerCase();
		},

		searchByName(items, term) {
			if (term) {
				return items.filter(item => this.toLower(this.fullName(item.name, item.ext)).includes(this.toLower(term)));
			}

			return items;
		},

		onSelect (item) {
			this.$emit('selected', item);
		},

		customSort (value) {
			switch(this.currentSort) {
				case 'name':
					return value.sort((a, b) => {
						if (this.currentSortOrder === 'desc') {
							return a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'});
						}

						return b.name.localeCompare(a.name, undefined, {numeric: true, sensitivity: 'base'});
					});
					break;

				case 'date':
					return value.sort((a, b) => {
						if (this.currentSortOrder === 'desc') {
							return new Date(b.created_at) - new Date(a.created_at);
						}

						return new Date(a.created_at) - new Date(b.created_at);
					});
					break;

				case 'size':
					return value.sort((a, b) => {
						var a_size = 0;
						var b_size = 0;

						if(a.size != null) a_size = a.size;
						if(b.size != null) b_size = b.size;

						if (this.currentSortOrder === 'asc') {
							return a_size - b_size;
						}

						return b_size - a_size;
					});
					break;

				case 'type':
					return value.sort((a, b) => {
						var a_type = this.getType(a.mime_type);
						var b_type = this.getType(b.mime_type);

						if (this.currentSortOrder === 'asc') {
							return a_type.localeCompare(b_type);
						}

						return b_type.localeCompare(a_type);
					});
					break;
			}
		}
	},
	filters: {
		humanDate(rawDate) {
			var date = new Date(Date.parse(rawDate));

			var options = {
				year: 'numeric', 
				month: 'numeric', 
				day: 'numeric',
				hour: 'numeric', 
				minute: 'numeric', 
				second: 'numeric',
				hour12: false
			};			

			return new Intl.DateTimeFormat('uk', options).format(date);
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