import { logInfo } from '../config/pino';
import Psychologist from '../models/psychologist';
import User from '../models/user';
import bcrypt from 'bcrypt';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import moment from 'moment';

const getAll = async () => {
	const psychologists = await Psychologist.find();
	logInfo('obtuvo todos los psicologos');
	return okResponse('psicologos obtenidos', { psychologists });
};

const match = async body => {
	const { payload } = body;
	let matchedPsychologists = [];
	if (payload.gender == 'transgender') {
		matchedPsychologists = await Psychologist.find({
			models: payload.model,
			isTrans: true,
			specialties: { $in: payload.themes },
		});
	} else {
		matchedPsychologists = await Psychologist.find({
			gender: payload.gender || {
				$in: ['male', 'female', 'transgender'],
			},
			models: payload.model,
			specialties: { $in: payload.themes },
		});
	}
	if (matchedPsychologists.length == 0) {
		let newMatchedPsychologists = [];
		if (payload.gender == 'transgender') {
			newMatchedPsychologists = await Psychologist.find({
				isTrans: true,
				specialties: { $in: payload.themes },
			});
		} else {
			newMatchedPsychologists = await Psychologist.find({
				gender: payload.gender || {
					$in: ['male', 'female', 'transgender'],
				},
				specialties: { $in: payload.themes },
			});
		}

		return okResponse('Psicologos encontrados', {
			matchedPsychologists: newMatchedPsychologists,
			perfectMatch: false,
		});
	} else {
		return okResponse('psicologos encontrados', {
			matchedPsychologists,
			perfectMatch: true,
		});
	}
};

const createSession = async body => {
	const { payload } = body;
	const sessions = {
		date: payload.date,
		user: payload.user._id,
		statePayments: 'pending',
	};
	// Check if available
	const foundPsychologist = await Psychologist.findById(
		payload.psychologist._id
	);
	let dateConflict = false;
	foundPsychologist.sessions.forEach(session => {
		if (moment(session.date).isSame(payload.date)) {
			dateConflict = true;
		}
	});
	if (dateConflict) return conflictResponse('Esta hora ya esta ocupada');
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
	if (await User.exists({ email: body.email })) {
		return conflictResponse('Este correo ya esta registrado');
	}

	let splittedExperience = body.experience.split(';');
	splittedExperience = splittedExperience.map(i => i.trim());

	let splittedFormation = body.formation.split(';');
	splittedFormation = splittedFormation.map(i => i.trim());

	const newPsychologist = {
		name: body.name,
		lastName: body.lastName,
		code: body.code,
		personalDescription: body.personalDescription,
		professionalDescription: body.professionalDescription,
		email: body.email,
		experience: splittedExperience,
		formation: splittedFormation,
		specialties: JSON.parse(body.specialties),
		models: JSON.parse(body.models),
		languages: JSON.parse(body.languages),
		gender: body.gender,
		isTrans: body.isTrans,
		avatar,
	};
	const psychologist = await Psychologist.create(newPsychologist);

	const newUser = {
		name: body.name,
		role: 'psychologist',
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		avatar,
		psychologist: psychologist._id,
	};

	User.create(newUser);

	return okResponse('psicologo creado');
};

const reschedule = async (user, id, newDate) => {
	let foundPsychologist = await Psychologist.findById(user.psychologist);
	let e = false;
	foundPsychologist.sessions.forEach(session => {
		if (session._id == id) {
			if (
				foundPsychologist.sessions.filter(item => item.date == newDate)
					.length == 0
			) {
				session.date = newDate;
			} else {
				e = true;
			}
		}
	});
	if (!e) {
		await foundPsychologist.save();
		return okResponse('Hora actualizada');
	}
	return conflictResponse('Esa hora esta ocupada');
};

const psychologistsService = {
	getAll,
	match,
	register,
	createSession,
	reschedule,
};

export default Object.freeze(psychologistsService);
