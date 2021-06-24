import axios from 'axios';

export const api = axios.create({
	baseURL: process.env.VUE_APP_URL ? process.env.VUE_APP_URL : 'http://localhost:3000/api/v1',
});

/**
 * Performs api calls sending the required authentication headers
 * @param {String} url
 * @param {Object} options
 */
const fetch = async (url, options) => {
	const headers = {};
	const vuex = JSON.parse(localStorage.getItem('vuex'));
	if (vuex)
		if (vuex.User !== null && vuex.User.token) {
			headers.Authorization = `Bearer ${vuex.User.token}`;
		}

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
