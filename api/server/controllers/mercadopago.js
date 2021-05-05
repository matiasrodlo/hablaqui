import mercadopagoService from '../services/mercadopago';
import { errorCallback } from '../utils/functions/errorCallback';
import { restResponse } from '../utils/responses/functions';

const mercadopagoController = {
	async createPreference(req, res) {
		try {
			const { body } = req;
			const { data, code } = await mercadopagoService.createPreference(
				body,
				res
			);
			console.log(data, 'data');
			return restResponse(data, code, res);
		} catch (e) {
			console.log(e);
			errorCallback(e, res, 'error procesando el servicio');
		}
	},
};

export default Object.freeze(mercadopagoController);
