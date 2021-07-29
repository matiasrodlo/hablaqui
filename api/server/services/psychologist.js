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

	const isoDate = moment(
		`${payload.date} ${payload.start}`,
		'DD/MM/YYYY HH:mm'
	).toISOString();

	let sessionQuantity = 0;
	if (payload.paymentPeriod == 'Pago semanal') sessionQuantity = 1;
	if (payload.paymentPeriod == 'Pago mensual') sessionQuantity = 4;
	if (payload.paymentPeriod == 'Pago cada tres meses') sessionQuantity = 12;

	const sessions = {
		date: isoDate,
		user: payload.user._id,
		plan: payload.title,
		statePayments: 'pending',
		price: payload.price / sessionQuantity,
		invitedByPsychologist:
			payload.psychologist.username == payload.user.inviteCode,
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

	// Save session
	const savedSession = await Psychologist.findOneAndUpdate(
		{ _id: payload.psychologist._id },
		{
			$push: { sessions },
		},
		{ upsert: true, returnOriginal: false }
	);

	let expirationDate = '';
	if (payload.paymentPeriod == 'Pago semanal')
		expirationDate = moment()
			.add({ weeks: 1 })
			.toISOString();
	if (payload.paymentPeriod == 'Pago mensual')
		expirationDate = moment()
			.add({ weeks: 4 })
			.toISOString();
	if (payload.paymentPeriod == 'Pago cada tres meses')
		expirationDate = moment()
			.add({ months: 3 })
			.toISOString();

	await User.findOneAndUpdate(
		{ _id: payload.user._id },
		{
			$push: {
				plan: {
					fullInfo: payload.fullInfo,
					title: payload.title,
					period: payload.paymentPeriod,
					price: payload.price,
					sessionPrice: payload.price / sessionQuantity,
					psychologist: payload.psychologist._id,
					expiration: expirationDate,
					invitedByPsychologist:
						payload.psychologist.username ==
						payload.user.inviteCode,
					usedCoupon: payload.discountCoupon
						? payload.discountCoupon
						: 'not used',
				},
			},
		}
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

	if (await Psychologist.exists({ username: body.username })) {
		return conflictResponse('Este nombre de usuario ya esta ocupado');
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
		username: body.username,
		experience: splittedExperience,
		formation: splittedFormation,
		specialties: JSON.parse(body.specialties),
		models: JSON.parse(body.models),
		languages: JSON.parse(body.languages),
		gender: body.gender,
		isTrans: body.isTrans,
		region: body.region,
		comuna: body.comuna,
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
					.length == 0 &&
				moment().isBefore(moment(session.date).subtract({ hours: 24 }))
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

const getByUsername = async username => {
	return okResponse('Psicologo encontrado', {
		psychologist: await Psychologist.findOne({ username }),
	});
};

const getById = async id => {
	return okResponse('Psicologo encontrado', {
		psychologist: await Psychologist.findOne({ _id: id }),
	});
};

const setSchedule = async (user, payload) => {
	let foundPsychologist = await Psychologist.findByIdAndUpdate(
		user.psychologist,
		{
			schedule: {
				monday: payload.monday,
				tuesday: payload.tuesday,
				wednesday: payload.wednesday,
				thursday: payload.thursday,
				friday: payload.friday,
				saturday: payload.saturday,
				sunday: payload.sunday,
			},
		}
	);

	return okResponse('Horario actualizado', {
		psychologist: foundPsychologist,
	});
};

const cancelSession = async (user, sessionId) => {
	let foundPsychologist = await Psychologist.findById(user.psychologist);
	foundPsychologist.sessions = foundPsychologist.sessions.filter(
		item => item._id != sessionId
	);
	await foundPsychologist.save();

	return okResponse('Sesion cancelada', { psychologist: foundPsychologist });
};

const updatePaymentMethod = async (user, payload) => {
	if (user.role !== 'psychologist')
		return conflictResponse('No eres un psicologo.');

	let foundPsychologist = await Psychologist.findById(
		foundPsychologist.psychologist
	);
	const newPaymentMethod = {
		bank: payload.bank || foundPsychologist.paymentMethod.bank,
		accountType:
			payload.accountType || foundPsychologist.paymentMethod.accountType,
		accountNumber:
			payload.accountNumber ||
			foundPsychologist.paymentMethod.accountNumber,
		rut: payload.rut || foundPsychologist.paymentMethod.rut,
		name: payload.name || foundPsychologist.paymentMethod.name,
		email: payload.email || foundPsychologist.paymentMethod.email,
	};
	foundPsychologist.paymentMethod = newPaymentMethod;
	await foundPsychologist.save();
	return okResponse('Metodo actualizado', {
		psychologist: foundPsychologist,
	});
};

const updatePsychologist = async (user, profile) => {
	if (user.role == 'user') return conflictResponse('No tienes poder.');
	const updated = await Psychologist.findByIdAndUpdate(
		user.psychologist,
		profile,
		{
			new: true,
			runValidators: true,
			context: 'query',
		}
	);

	logInfo(user.email, 'actualizo su perfil de psicologo');
	return okResponse('Actualizado exitosamente', { psychologist: updated });
};

const deleteOne = async (user, id) => {
	if (user.role != 'superadmin') return conflictResponse('No tienes poder');
	await Psychologist.deleteOne({ _id: id });
	return okResponse('Psicologo eliminado');
};

const setPrice = async (user, newPrice) => {
	newPrice = Number(newPrice);
	if (user.role != 'psychologist')
		return conflictResponse('No tienes permisos');
	let updatedPsychologist = await Psychologist.findByIdAndUpdate(
		user.psychologist,
		{
			sessionPrices: {
				text: newPrice * 0.75,
				video: newPrice,
				full: newPrice * 0.75,
			},
		},
		{ new: true }
	);
	return okResponse('Precios actualizados', {
		psychologist: updatedPsychologist,
	});
};

const addRating = async (user, newRating, comment, psychologist) => {
	if (user.psychologist != psychologist)
		return conflictResponse('Este no es tu psicologo');

	const rating = {
		author: user._id,
		comment,
		stars: newRating,
	};

	const updatedPsychologist = await Psychologist.findByIdAndUpdate(
		psychologist,
		{ $push: { ratings: rating } },
		{ new: true }
	);

	return okResponse('Rating actualizado', {
		psychologist: updatedPsychologist,
	});
};
const getRating = async psychologist => {
	const foundPsychologist = await Psychologist.findById(psychologist);
	if (!foundPsychologist.ratings || foundPsychologist.ratings.length == 0)
		return okResponse('El psicologo no tiene evaluaciones aun.');

	let total = 0;
	for (let i = 0; i < foundPsychologist.ratings.length; i++) {
		total += foundPsychologist.ratings[i].stars;
	}

	return okResponse('Rating conseguido', {
		rating: total / foundPsychologist.ratings.length,
	});
};

const checkPlanTask = async () => {
	let allUsers = await User.find();
	let planUsers = allUsers.filter(user => user.plan.length > 0);
	planUsers.forEach(async userWithPlan => {
		let foundUser = await User.findById(userWithPlan._id);
		foundUser.plan.forEach(plan => {
			if (moment().isAfter(plan.expiration)) {
				plan.stauts = 'expired';
			}
		});
		foundUser.save();
	});

	return okResponse('ok');
};

const psychologistsService = {
	getAll,
	match,
	register,
	createSession,
	reschedule,
	getByUsername,
	getById,
	setSchedule,
	cancelSession,
	updatePaymentMethod,
	updatePsychologist,
	deleteOne,
	setPrice,
	addRating,
	getRating,
	checkPlanTask,
};

export default Object.freeze(psychologistsService);
