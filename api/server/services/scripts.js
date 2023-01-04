'use strict';

import { okResponse, conflictResponse } from '../utils/responses/functions';
import userModel from '../models/user';
import psyModel from '../models/psychologist';

const changeRole = async () => {
	// Se buca a todos los usuarios con el rol de psicologo
	const user = await userModel.find({ role: 'psychologist' });
	if (!user) return conflictResponse('No se encontro ningun usuario');
	// Se cambia el rol de psicologo a especialista
	await userModel.updateMany(
		{ role: 'psychologist' },
		{ role: 'specialist' }
	);
	return okResponse('Rol cambiado', { user });
};

const addProfesion = async () => {
	// Se busca a todos los usuarios con el rol de psicologo que no tengan el atributo profesion
	const users = await userModel.find({
		role: 'psychologist',
		profession: { $exists: false },
	});
	const psychologists = await psyModel.find({
		profession: { $exists: false },
	});
	if (!users) return conflictResponse('No se encontro ningun usuario');
	if (!psychologists)
		return conflictResponse('No se encontro ningun psicologo');
	// Se obtienen los id de los usuarios y psicologos
	const psy = psychologists.map(psy => psy._id);
	const user = users.map(user => user._id);
	// Se agrega la profesion a los psicologos
	await psyModel.updateMany(
		{ _id: { $in: psy } },
		{ $set: { profession: 'psychologist' } }
	);
	await userModel.updateMany(
		{ _id: { $in: user } },
		{ $set: { profession: 'psychologist' } }
	);
	return okResponse('Profesion agregada', { user });
};

const removeProfesion = async () => {
	// Se busca a todos los usuarios con el rol de psicologo que no tengan el atributo profesion
	const users = await userModel.find({
		role: 'psychologist',
		profession: { $exists: true },
	});
	const psychologists = await psyModel.find({
		profession: { $exists: true },
	});
	if (!users) return conflictResponse('No se encontro ningun usuario');
	if (!psychologists)
		return conflictResponse('No se encontro ningun psicologo');
	// Se obtienen los id de los usuarios y psicologos
	const psy = psychologists.map(psy => psy._id);
	const user = users.map(user => user._id);
	// Se agrega la profesion a los psicologos
	await psyModel.updateMany(
		{ _id: { $in: psy } },
		{ $unset: { profession: '' } }
	);
	await userModel.updateMany(
		{ _id: { $in: user } },
		{ $unset: { profession: '' } }
	);
	return okResponse('Profesion eliminada', { user });
};

const removeRole = async () => {
	// Se buca a todos los usuarios con el rol de psicologo
	const user = await userModel.find({ role: 'specialist' });
	if (!user) return conflictResponse('No se encontro ningun usuario');
	// Se cambia el rol de psicologo a especialista
	await userModel.updateMany(
		{ role: 'specialist' },
		{ role: 'psychologist' }
	);
	return okResponse('Rol cambiado', { user });
};

const scriptsService = {
	changeRole,
	addProfesion,
	removeProfesion,
	removeRole,
};

export default Object.freeze(scriptsService);
