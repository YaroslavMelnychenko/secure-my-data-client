const state = {
	apiSettings: {},
	accessToken: null,
	refreshToken: null
}
  
const mutations = {
	SET_API_SETTINGS(state, settings) {
		state.apiSettings = settings;
	},

	SET_ACCESS_TOKEN(state, accessToken) {
		state.accessToken = accessToken;
	},

	SET_REFRESH_TOKEN(state, refreshToken) {
		state.refreshToken = refreshToken;
	}
}
  
const actions = {
	setApiSettings ({ commit }, settings) {
		commit('SET_API_SETTINGS', settings);
	},

	setTokens ({ commit }, tokens) {
		commit('SET_ACCESS_TOKEN', tokens.accessToken);
		commit('SET_REFRESH_TOKEN', tokens.refreshToken);
	}
}

const getters = {
	getApiSettings: state => {
		return state.apiSettings;
	},

	getAccessToken: state => {
		return state.accessToken;
	},

	getRefreshToken: state => {
		return state.refreshToken;
	}
}
  
export default {
	state,
	mutations,
	actions,
	getters
}