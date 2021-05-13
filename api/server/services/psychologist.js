import { logInfo } from '../config/pino';
import Psychologist from '../models/psychologist';
import User from '../models/user';
import bcrypt from 'bcrypt';
import { okResponse, restResponse } from '../utils/responses/functions';

const getAll = async () => {
	const psychologists = await Psychologist.find();
	logInfo('obtuvo todos los psicologos');
	return okResponse('psicologos obtenidos', { psychologists });
};

const match = async body => {
	const { payload } = body;
	console.log(payload);
	const matchedPsychologists = await Psychologist.find({
		gender: payload.gender || { $in: ['male', 'female', 'non-binary'] },
		models: { $in: payload.model } || {
			$in: [
				'cognitivo',
				'psicoanalisis',
				'humanista',
				'sistemico',
				'contextual',
			],
		},
		specialties: { $in: payload.themes },
	});
	return okResponse('psicologos encontrados', { matchedPsychologists });
};

const createSession = async body => {
	const { session } = body;
	Psychologist.findOneAndUpdate(
		{ _id: body.psychologistId },
		{
			$push: { session },
		},
		{ upsert: true }
	);
	logInfo('creo una nueva cita');
	return okResponse('sesion creada');
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

	User.create(newUser);

	return okResponse('psicologo creado');
};

const psychologistsService = {
	getAll,
	match,
	register,
	createSession,
};

export default Object.freeze(psychologistsService);
