import axios from 'axios';
import {
	keyApiTestMails,
	namespaceTestMails,
	node_env,
} from '../../../config/dotenv';
import { logInfo } from '../../../config/pino.js';
import { okResponse, conflictResponse } from '../../responses/functions';
import dayjs from 'dayjs';
import fs from 'fs';

const writerLogs = async (user, mail) => {
	// Se obtiene el email del usuario y se obtiene el asunto, el cuerpo y el remitente del correo
	const { email } = user;
	const { from, subject, text } = mail;
	const date = dayjs().format('DD-MM-YYYY HH:mm:ss');

	// Se abre el archivo y se escribe en él para dejar un registro de los correos recibidos
	fs.open('./server/utils/functions/mails/logMails.txt', 'a', (e, idFile) => {
		fs.write(
			idFile,
			`${date} - ${email} - ${from} - ${subject}\n${text}\n\n`,
			null,
			'utf8',
			() => {
				fs.close(idFile);
			}
		);
	});
};

export const issuerChange = async addressMail => {
	if (node_env !== 'development') {
		return addressMail;
	}
	// Se comienza a establecer la dirección de correo del emisor
	const tag = addressMail.split('<')[1].split('@')[0];
	addressMail = `${tag} <${namespaceTestMails}.staging@inbox.testmail.app>`;
	return addressMail;
};

export const replyChange = async addressMail => {
	if (node_env !== 'development') {
		return addressMail;
	}
	// Se comienza a establecer la dirección de correo del emisor
	addressMail = `Soporte <${namespaceTestMails}.soporte@inbox.testmail.app>`;
	return addressMail;
};

export const verifyIncomingMails = async user => {
	let state;
	let lastEmail;
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
		lastEmail = data.emails.shift();
		logInfo(
			`El usuario ${user.email} obtuvo el último correo de ${lastEmail.from} con el asunto de ${lastEmail.subject}`
		);
		writerLogs(user, lastEmail);
		state = okResponse('Se obtuvo el correo', { correo: lastEmail });
	} catch (error) {
		logInfo('No se pudo obtener el correo');
		state = conflictResponse('No se pudo obtener el correo ', error);
	}
	return state;
};
