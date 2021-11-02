'use strict';

import mercadopagoService from '../services/mercadopago';
import { errorCallback } from '../utils/functions/errorCallback';
import { restResponse } from '../utils/responses/functions';
import { landing_url } from '../config/dotenv';

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
			await mercadopagoService.successPay(params);
			return res.redirect(`${landing_url}/dashboard/chat`);
		} catch (e) {
			errorCallback(e, res, 'Error al aprobar pago.');
		}
	},
	async createPsychologistPreference(req, res) {
		try {
			const { body } = req;
			const {
				data,
				code,
			} = await mercadopagoService.createPsychologistPreference(
				body,
				res
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error procesando el servicio');
		}
	},
	async psychologistPay(req, res) {
		try {
			const { params, query } = req;
			await mercadopagoService.psychologistPay(params, query);
			return res.redirect(`${landing_url}/psicologos/jaja`);
		} catch (e) {
			errorCallback(e, res, 'Error al aprobar pago.');
		}
	},
};

export default Object.freeze(mercadopagoController);
