import axios from 'axios';
import Vue from 'vue';

var errors = require('./errors');
var request = require('request');

Vue.http = Vue.prototype.$http = axios;

var ApiServer = 'https://safest.pp.ua/api';

var mapError = error => {
	var err = window.App.trans().apiErrors.texts[error];

	if(err === undefined) return error;
	else return err;
}

/**
 * 'SUCCESS' => 200,
 * 'BAD_REQUEST' => 400,
 * 'UNAUTHORIZED' => 401,
 * 'ALREADY_EXISTS' => 403,
 * 'NOT_FOUND' => 404,
 * 'METHOD_NOT_ALLOWED' => 405,
 * 'VALIDATION_ERROR' => 422,
 * 'INTERNAL_ERROR' => 500, 
 * 'TOO_MANY_ATTEMPTS' => 503
 */
var parseError = error => {
	if(error.response !== undefined) {
		var message = error.response.data.message;
	} else {
		return false;
	}

	switch(error.response.status) {
		case 422:
			window.App.createAlert(window.App.trans().apiErrors.validation, message);
			break;
		
		case 400:
			window.App.createAlert(window.App.trans().apiErrors.basic, mapError(message));
			break;

		case 401:
			window.App.createAlert(window.App.trans().apiErrors.auth, mapError(message));
			break;

		case 403:
			window.App.createAlert(window.App.trans().apiErrors.restricted, message)
			break;

		case 404:
			window.App.createAlert(window.App.trans().apiErrors.basic, window.App.trans().apiErrors.notFound);
			break;

		case 405:
			window.App.createAlert(window.App.trans().apiErrors.method, message);
			break;

		case 500:
			window.App.createAlert(window.App.trans().apiErrors.server, window.App.trans().apiErrors.console);
			break;

		case 503:
			window.App.createAlert(window.App.trans().apiErrors.basic, window.App.trans().apiErrors.tryLater);
			break;

		default: 
			window.App.createAlert(window.App.trans().apiErrors.unknown, error.message);
			break;
	}
};

var getToken = () => {
	return window.App.$store.getters.getAccessToken;
}

export default {
	status: () => {
		return new Promise((resolve, reject) => {
			Vue.http.get(ApiServer).then(response => {
				resolve(response.data);
			}).catch(error => {
				parseError(error);
				reject(error);
			});
		});
	},

	checkEmail: (email) => {
		return new Promise((resolve, reject) => {
			Vue.http.get(ApiServer + '/users', {
				params: {
					email
				}
			}).then(response => {
				resolve(response.data);
			}).catch(error => {
				parseError(error);
				reject(error);
			});
		});
	},

	signUp: (userData) => {
		return new Promise((resolve, reject) => {
			Vue.http.post(ApiServer + '/auth/register', userData).then(response => {
				resolve(response);
			}).catch(error => {
				parseError(error);
				reject(error);
			});
		});
	},

	signIn: (userData) => {
		return new Promise((resolve, reject) => {
			var formData = new FormData();

			for(var key in userData) {
				formData.append(key, userData[key]);
			}

			Vue.http.post(ApiServer + '/auth/login', formData, {
				'content-type': 'multipart/form-data'
			}).then(response => {
				resolve(response.data);
			}).catch(error => {
				parseError(error);
				reject(error);
			})
		});
	},

	refresh: (refreshToken) => {
		return new Promise((resolve, reject) => {
			Vue.http.post(ApiServer + '/auth/refresh', {
				refresh_token: refreshToken
			}).then(response => {
				console.log(response.data);
				resolve(response.data);
			}).catch(error => {
				parseError(error);
				reject(error);
			});
		});
	},

	userDetails: () => {
		return new Promise((resolve, reject) => {
			var token = getToken();

			Vue.http.get(ApiServer + '/users/details', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			}).then(response => {
				resolve(response.data);
			}).catch(error => {
				parseError(error);
				reject(error);
			});
		});
	},

	userSecureData: () => {
		return new Promise((resolve, reject) => {
			var token = getToken();

			Vue.http.get(ApiServer + '/users/data', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			}).then(response => {
				console.log(response.data);
				resolve(response.data);
			}).catch(error => {
				parseError(error);
				reject(error);
			});
		});
	},

	downloadData: (dataId) => {
		var token = getToken();

		return request({
			method: 'GET',
			uri: ApiServer + `/users/data/${dataId}`,
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
	},

	getData: (dataId) => {
		return new Promise((resolve, reject) => {
			var token = getToken();

			Vue.http.get(ApiServer + `/users/data/${dataId}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			}).then(response => {
				resolve(response.data);
			}).catch(error => {
				parseError(error);
				reject(error);
			});
		});
	},

	deleteData: (dataId) => {
		return new Promise((resolve, reject) => {
			var token = getToken();

			Vue.http.delete(ApiServer + `/users/data/${dataId}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			}).then(response => {
				resolve(response.data);
			}).catch(error => {
				parseError(error);
				reject(error);
			});
		});
	},

	editData: (dataId, newData) => {
		return new Promise((resolve, reject) => {
			var token = getToken();

			Vue.http.put(ApiServer + `/users/data/${dataId}`, newData, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			}).then(response => {
				resolve(response.data);
			}).catch(error => {
				parseError(error);
				reject(error);
			});
		});
	},

	storePlainData: (data) => {
		return new Promise((resolve, reject) => {
			var token = getToken();

			Vue.http.post(ApiServer + '/users/data', data, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			}).then(response => {
				resolve(response.data);
			}).catch(error => {
				parseError(error);
				reject(error);
			});
		});
	},

	storeAttachment: (attachment) => {
		return new Promise((resolve, reject) => {
			var token = getToken();

			var formData = new FormData();
			formData.append('attachment', attachment);

			Vue.http.post(ApiServer + '/users/data', formData, {
				headers: {
					'Authorization': `Bearer ${token}`,
					'content-type': 'multipart/form-data'
				}
			}).then(response => {
				resolve(response.data);
			}).catch(error => {
				parseError(error);
				reject(error);
			});
		});
	},

	resendVerificationCode: () => {
		return new Promise((resolve, reject) => {
			var token = getToken();

			Vue.http.get(ApiServer + '/users/verify/resend', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			}).then(response => {
				resolve(response.data);
			}).catch(error => {
				parseError(error);
				reject(error);
			});
		});
	},

	verifyEmail: (code) => {
		return new Promise((resolve, reject) => {
			var token = getToken();

			Vue.http.post(ApiServer + '/users/verify', {
				code
			}, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			}).then(response => {
				resolve(response.data);
			}).catch(error => {
				parseError(error);
				reject(error);
			});
		});
	}
}