import { logInfo } from '../config/pino';
import Psychologist from '../models/psychologist';
import { infoMessages } from '../utils/logger/infoMessages';
import { okResponse } from '../utils/responses/functions';

const getAll = async () => {
	const psychologists = await Psychologist.find();
	logInfo(infoMessages('obtuvo todos los psicologos'));
	return okResponse('psicologos obtenidos', { psychologists });
};

const psychologistsService = {
	getAll,
};

export default Object.freeze(psychologistsService);
