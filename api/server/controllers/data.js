'use strict';

import dataService from '../services/data';
import { errorCallback } from '../utils/functions/errorCallback';
import { restResponse } from '../utils/responses/functions';

const dataController = {
	async uploadCsv(req, res) {
		try {
			const { data, code } = await dataService.uploadCsv(req.file);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error subiendo el archvio');
		}
	},
};

export default Object.freeze(dataController);
