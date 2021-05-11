import { logInfo } from '../config/pino';
import Psychologist from '../models/psychologist';
import User from '../models/user';
import bcrypt from 'bcrypt';
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
		gender: body.gender,
		avatar,
	};
	const psychologist = await Psychologist.create(newPsychologist);

	const newUser = {
		name: body.name,
		role: 'psychologist',
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		avatar,
		psychologist,
	};

	const user = await User.create(newUser);

	return okResponse('psicologo creado');
};

const psychologistsService = {
	getAll,
	match,
	register,
};

export default Object.freeze(psychologistsService);
