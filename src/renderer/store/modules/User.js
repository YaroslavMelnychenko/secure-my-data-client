const state = {
	apiSettings: {},
	accessToken: null,
	refreshToken: null,
	language: 'ua'
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
	},

	SET_LANGUAGE(state, language) {
		state.language = language;
	}
}
  
const actions = {
	setApiSettings ({ commit }, settings) {
		commit('SET_API_SETTINGS', settings);
	},

	setTokens ({ commit, state, dispatch }, tokens) {
		commit('SET_ACCESS_TOKEN', tokens.accessToken);
		commit('SET_REFRESH_TOKEN', tokens.refreshToken);

		var sessionLifetime = Number(state.apiSettings.session_lifetime) * 60000 * 0.75;
		sessionLifetime = Math.trunc(sessionLifetime);
		console.log(sessionLifetime);

		window.sessionRefreshLoop = setInterval(() => {
			dispatch('refreshSession');
		}, sessionLifetime);
	},

	refreshSession ({ commit, getters }) {
		App.$api.refresh(getters.getRefreshToken).then(response => {
			commit('SET_ACCESS_TOKEN', response.message.access_token);
			commit('SET_REFRESH_TOKEN', response.message.refresh_token);
		});
	},

	setLanguage ({ commit }, language) {
		commit('SET_LANGUAGE', language);
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
	},

	getLanguage: state => {
		return state.language;
	}
}
  
export default {
	state,
	mutations,
	actions,
	getters
}