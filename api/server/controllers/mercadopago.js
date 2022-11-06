'use strict';

import mercadopagoService from '../services/mercadopago';
import { errorCallback } from '../utils/functions/errorCallback';
import { restResponse } from '../utils/responses/functions';
import { landing_url } from '../config/dotenv';

const mercadopagoController = {
	async successPay(req, res) {
		try {
			const { params } = req;
			const { data, code } = await mercadopagoService.successPay(params);
			return restResponse(data, code, res);
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
			} = await mercadopagoService.createPsychologistPreference(body);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error procesando el servicio');
		}
	},
	async psychologistPay(req, res) {
		try {
			const { params, query } = req;
			await mercadopagoService.psychologistPay(params, query);
			return res.redirect(
				`${process.env.VUE_APP_LANDING}/dashboard/perfil`
			);
		} catch (e) {
			errorCallback(e, res, 'Error al aprobar pago.');
		}
	},
	async recruitedPay(req, res) {
		try {
			const { params, query } = req;
			await mercadopagoService.recruitedPay(params, query);
			return res.redirect(
				`${process.env.VUE_APP_LANDING}/dashboard/perfil`
			);
		} catch (e) {
			errorCallback(e, res, 'Error al aprobar pago.');
		}
	},
	async createCustomSessionPreference(req, res) {
		try {
			const { userId, psyId, planId } = req.params;
			const {
				data,
				code,
			} = await mercadopagoService.createCustomSessionPreference(
				userId,
				psyId,
				planId
			);
			return restResponse(data, code, res);
		} catch (e) {
			errorCallback(e, res, 'error procesando el servicio');
		}
	},
	async customSessionPay(req, res) {
		try {
			const { params } = req;
			await mercadopagoService.customSessionPay(params);
			return res.redirect(`${landing_url}dashboard/chat`);
		} catch (e) {
			errorCallback(e, res, 'Error al aprobar pago.');
		}
	},
};

export default Object.freeze(mercadopagoController);
