import { errorCallback } from '../utils/functions/errorCallback';
import mercadopago from 'mercadopago';
import { okResponse } from '../utils/responses/functions';

const FRONTEND_URL = process.env.FRONTEND_URL;
const MERCADOPAGO_KEY = process.env.MERCADOPAGO_KEY;

mercadopago.configurations.setAccessToken(MERCADOPAGO_KEY);

const createPreference = async (body, res) => {
	let newPreference = {
		items: [
			{
				title: body.description,
				currency_id: 'CLP',
				unit_price: Number(body.price),
				quantity: Number(body.quantity),
			},
		],
		back_urls: {
			success: `${FRONTEND_URL}/pago/success-pay`,
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
			bodyId = res.body.id;
		})
		.catch(e => {
			error = e;
		});

	if (error != '') {
		return errorCallback(error, res, 'error creando la preferencia');
	}
	return okResponse('preference created', { id: bodyId });
};

const mercadopagoService = {
	createPreference,
};

export default Object.freeze(mercadopagoService);
