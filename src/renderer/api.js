import axios from 'axios';
import Vue from 'vue';

var errors = require('./errors');

Vue.http = Vue.prototype.$http = axios;

var ApiServer = 'https://safest.pp.ua/api';

var mapError = error => {
	var err = errors[error];

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
	var message = error.response.data.message;

	switch(error.response.status) {
		case 422:
			App.createAlert('Помилка валідації', message);
			break;
		
		case 401:
			App.createAlert('Помилка авторизації', mapError(message));
			break;

		case 403:
			App.createAlert('Помилка: заборонено', message)
			break;

		case 404:
			App.createAlert('Помилка', 'Не знайдено');
			break;

		case 405:
			App.createAlert('Помилка: невірний метод', message);
			break;

		case 500:
			App.createAlert('Помилка серверу', 'Подробиці в консолі');
			break;

		case 503:
			App.createAlert('Помилка', 'Забагато запитів. Спробуйте пізніше');
			break;

		default: 
			App.createAlert('Невідома помилка', error.message);
			break;
	}
};

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
		//
	}
}