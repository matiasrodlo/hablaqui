import { errorCallback } from '../utils/functions/errorCallback';
import mercadopago from 'mercadopago';
import { conflictResponse, okResponse } from '../utils/responses/functions';

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
			bodyId = res.body;
		})
		.catch(e => {
			error = e;
		});

	if (error != '') {
		return errorCallback(error, res, 'error creando la preferencia');
	}
	if (bodyId != '') return okResponse('preference created', { body: bodyId });

	conflictResponse('Ha ocurrido un error :c');
};

const mercadopagoService = {
	createPreference,
};

export default Object.freeze(mercadopagoService);
