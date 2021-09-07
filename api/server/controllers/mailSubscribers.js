import MailSubscribers from '../models/mailSubscribers';
import { okResponse, restResponse } from '../utils/responses/functions';

const mailSubscribersController = {
	addMail(req, res) {
		const { email } = req.params;
		MailSubscribers.create({
			email,
		});
		const { data, code } = okResponse('Agregado con exito');
		return restResponse(data, code, res);
	},

	async removeMail(req, res) {
		const { email } = req.body;
		await MailSubscribers.findOneAndDelete({
			email,
		});
		const { data, code } = okResponse('Eliminado con exito');
		return restResponse(data, code, res);
	},
};

export default Object.freeze(mailSubscribersController);
