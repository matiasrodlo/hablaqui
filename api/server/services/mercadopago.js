import { errorCallback } from '../utils/functions/errorCallback';
import mercadopago from 'mercadopago';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import Psychologist from '../models/psychologist';
import { logInfo } from '../config/pino';
import { api_url, landing_url, mercadopago_key } from '../config/dotenv';
import mailer from './mailer';
import User from '../models/user';

mercadopago.configure({
	access_token: mercadopago_key,
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
			failure: `${landing_url}/pago/failure-pay`,
			pending: `${landing_url}/pago/pending-pay`,
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
	const foundUser = await User.findById(userId);
	mailer.sendPurchaseInformation(foundUser.email);
	return okResponse('sesion actualizada');
};
const mercadopagoService = {
	createPreference,
	successPay,
};

export default Object.freeze(mercadopagoService);
