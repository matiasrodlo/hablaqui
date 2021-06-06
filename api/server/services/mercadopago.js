import { errorCallback } from '../utils/functions/errorCallback';
import mercadopago from 'mercadopago';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import Psychologist from '../models/psychologist';
import { logInfo } from '../config/pino';
import { api_url } from '../config/dotenv';

const FRONTEND_URL = process.env.FRONTEND_URL;
const MERCADOPAGO_KEY = process.env.MERCADOPAGO_KEY;

mercadopago.configure({
	access_token: MERCADOPAGO_KEY,
});

const createPreference = async (body, res) => {
	let newPreference = {
		items: [
			{
				title: body.description,
				currency_id: 'CLP',
				unit_price: Number(body.price),
				quantity: 1,
			},
		],
		back_urls: {
			success: `${api_url}api/v1/mercadopago/success-pay/${body.psychologistToUpdate}/${body.userToUpdate}/${body.sessionToUpdate}`,
			failure: `${FRONTEND_URL}/pago/failure-pay`,
			pending: `${FRONTEND_URL}/pago/pending-pay`,
		},
		auto_return: 'approved',
	};

	let bodyId = '';
	let error = '';
	await mercadopago.preferences
		.create(newPreference)
		.then(res => {
			bodyId = res.body;
		})
		.catch(e => {
			error = e;
		});

	if (error != '') {
		return errorCallback(error, res, 'error creando la preferencia');
	}
	if (bodyId != '') return okResponse('preference created', { body: bodyId });

	return conflictResponse('Ha ocurrido un error');
};

const successPay = async params => {
	const { psyId, userId, sessionId } = params;
	const foundPsychologist = await Psychologist.updateOne(
		{
			_id: psyId,
			sessions: { $elemMatch: { _id: sessionId } },
		},
		{ $set: { 'sessions.$.statePayments': 'successful' } }
	);
	logInfo('Se ha actualizado una sesion');
	return okResponse('sesion actualizada');
};
const mercadopagoService = {
	createPreference,
	successPay,
};

export default Object.freeze(mercadopagoService);
