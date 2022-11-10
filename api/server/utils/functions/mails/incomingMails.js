import axios from 'axios';
import { keyApiTestMails, namespaceTestMails } from '../../../config/dotenv';
import { logInfo } from '../../../config/pino.js';
import { okResponse, conflictResponse } from '../../responses/functions';

const verifyIncomingMails = async user => {
	// Se establece la url de la API JSON de testMails
	const url = `https://api.testmail.app/api/json?apikey=${keyApiTestMails}&namespace=${namespaceTestMails}`;

	// Se obtiene el tag del usuario
	let tag = user.email.split('@')[0].replace(namespaceTestMails + '.', '');

	// Se obtiene la hora actual para filtrar los correos anteriores.
	const startTimestamp = Date.now();

	// Hace la petición a la API de testMails
	try {
		let { data } = await axios.get(
			`${url}&tag=${tag}&timestamp_from=${startTimestamp}&livequery=true`
		);
		let lastEmail = data.emails.shift();
		logInfo(
			`El usuario ${user.email} obtuvo el último correo de ${lastEmail.from}`
		);
		return okResponse('Se obtuvo el correo', { correo: lastEmail });
	} catch (error) {
		logInfo('No se pudo obtener el correo');
		return conflictResponse('No se pudo obtener el correo');
	}
};

export default verifyIncomingMails;
