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
				<h1 class="md-title">{{ App.trans().profile.myData }}</h1>
				<md-field md-clearable class="md-toolbar-section-end">
					<md-input :placeholder="App.trans().profile.searchByName" v-model="search" @input="searchOnTable" />
				</md-field>
			</md-table-toolbar>

			<md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single" class="md-primary">
				<md-table-cell :md-label="App.trans().profile.name" md-sort-by="name">{{ fullName(item.name, item.ext) }}</md-table-cell>
				<md-table-cell :md-label="App.trans().profile.type" md-sort-by="type"> 
					<md-icon class="md-size-1x">{{ getType(item.mime_type) }}</md-icon>
				</md-table-cell>
				<md-table-cell :md-label="App.trans().profile.size" md-sort-by="size">{{ item.size | humanSize }}</md-table-cell>
				<md-table-cell :md-label="App.trans().profile.date" md-sort-by="date">{{ item.created_at | humanDate }}</md-table-cell>
			</md-table-row>

			<md-table-empty-state
				class="md-primary"
				md-icon="cloud_off"
				:md-label="App.trans().profile.noData"
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

			return new Intl.DateTimeFormat(App.trans().profile.dateFormat, options).format(date);
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