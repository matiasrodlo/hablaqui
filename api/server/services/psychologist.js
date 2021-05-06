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

const register = async (body, avatar) => {
	const newPsychologist = {
		name: body.name,
		code: body.code,
		description: body.description,
		email: body.email,
		experience: body.experience,
		formation: body.formation,
		specialties: JSON.parse(body.specialties),
		models: JSON.parse(body.models),
		avatar,
	};
	const psychologist = await Psychologist.create(newPsychologist);
	console.log(psychologist, avatar, 'service');
	return okResponse('psicologo creado');
};

const psychologistsService = {
	getAll,
	match,
	register,
};

export default Object.freeze(psychologistsService);
