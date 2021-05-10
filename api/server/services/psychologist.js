import { logInfo } from '../config/pino';
import Psychologist from '../models/psychologist';
import { okResponse } from '../utils/responses/functions';

const getAll = async () => {
	const psychologists = await Psychologist.find();
	logInfo('obtuvo todos los psicologos');
	return okResponse('psicologos obtenidos', { psychologists });
};

const match = async body => {
	const { payload } = body;
	const matchedPsychologists = await Psychologist.find({
		gender: payload.gender,
		specialties: { $all: payload.themes },
	});
	return okResponse('psicologos encontrados', { matchedPsychologists });
};

const psychologistsService = {
	getAll,
	match,
};

export default Object.freeze(psychologistsService);
