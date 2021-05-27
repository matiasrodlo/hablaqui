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
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error procesando el servicio');
		}
	},
	async successPay(req, res) {
		try {
			const { params } = req;
			const { data, code } = await mercadopagoService.successPay(params);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'Error al aprobar pago.');
		}
	},
};

export default Object.freeze(mercadopagoController);
