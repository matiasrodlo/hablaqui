import { errorCallback } from '../utils/functions/errorCallback';
import mercadopago from 'mercadopago';
import { mercadopago_sandbox_key } from '../config/dotenv';
import { okResponse } from '../utils/responses/functions';

mercadopago.configurations.setAccessToken(mercadopago_sandbox_key);

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
			success: 'http://google.com',
			failure: 'http://google.com',
			pending: 'http://google.com',
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
