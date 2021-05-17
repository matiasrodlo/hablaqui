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
	const matchedPsychologists = await Psychologist.find({
		gender: payload.gender || { $in: ['male', 'female', 'non-binary'] },
		models: payload.model,
		specialties: { $in: payload.themes },
	});
	return okResponse('psicologos encontrados', { matchedPsychologists });
};

const createSession = async body => {
	const { payload } = body;
	const sessions = {
		start: payload.start,
		end: payload.end,
		user: payload.user._id,
		statePayments: 'pending',
	};
	const savedSession = await Psychologist.findOneAndUpdate(
		{ _id: payload.psychologist._id },
		{
			$push: { sessions },
		},
		{ upsert: true, returnOriginal: false }
	);
	logInfo('creo una nueva cita');
	return okResponse('sesion creada', {
		id: savedSession.sessions[savedSession.sessions.length - 1]._id,
	});
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
