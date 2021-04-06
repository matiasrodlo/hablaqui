import axios from 'axios';
import { api as baseURL } from '@/config/index.js';

export const api = axios.create({
	baseURL,
});

/**
 * Performs api calls sending the required authentication headers
 * @param {String} url
 * @param {Object} options
 */
const fetch = async (url, options) => {
	const headers = {};

	// if (loggedIn) {
	// 	headers['Authorization'] = `Bearer ${getToken()}`;
	// }

	const response = await api(url, {
		headers,
		...options,
	});
	const res = await _checkStatus(response);
	return res;
};

/**
 * checkstatus of the api response
 * @param {Object} response
 * @return {Object} response || error
 * @private
 */
const _checkStatus = response => {
	// raises an error in case response status is not a success
	if (response.status >= 200 && response.status < 300) {
		// Success status lies between 200 to 300
		return response;
	} else {
		throw response;
	}
};

export default fetch;
