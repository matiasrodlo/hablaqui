'use strict';

import { okResponse, conflictResponse } from '../utils/responses/functions';
import userModel from '../models/user';
import specModel from '../models/specialist';
import recruitmentsModel from '../models/recruitment';

const changeRole = async () => {
	// Se buca a todos los usuarios con el rol de especialista
	const user = await userModel.find({ role: 'specialist' });
	if (!user) return conflictResponse('No se encontro ningun usuario');
	// Se cambia el rol de especialista a especialista
	await userModel.updateMany({ role: 'specialist' }, { role: 'specialist' });
	return okResponse('Rol cambiado', { user });
};

const addProfesion = async () => {
	// Se busca a todos los usuarios con el rol de especialista que no tengan el atributo profesion
	const users = await userModel.find({
		role: 'specialist',
		profession: { $exists: false },
	});
	const specialists = await specModel.find({
		profession: { $exists: false },
	});
	const recruitments = await recruitmentsModel.find({
		profession: { $exists: false },
	});
	if (!users) return conflictResponse('No se encontro ningun usuario');
	if (!specialists)
		return conflictResponse('No se encontro ningun especialista');
	if (!recruitments)
		return conflictResponse('No se encontro ningun reclutamiento');
	// Se obtienen los id de los usuarios y especialistas
	const spec = specialists.map(spec => spec._id);
	const user = users.map(user => user._id);
	const recruitment = recruitments.map(recruitment => recruitment._id);
	// Se agrega la profesion a los especialistas
	await specModel.updateMany(
		{ _id: { $in: spec } },
		{ $set: { profession: 'specialist' } }
	);
	await userModel.updateMany(
		{ _id: { $in: user } },
		{ $set: { profession: 'specialist' } }
	);
	await recruitmentsModel.updateMany(
		{ _id: { $in: recruitment } },
		{ $set: { profession: 'specialist' } }
	);
	return okResponse('Profesion agregada', { user });
};

const removeProfesion = async () => {
	// Se busca a todos los usuarios con el rol de especialista que no tengan el atributo profesion
	const users = await userModel.find({
		role: 'specialist',
		profession: { $exists: true },
	});
	const specialists = await specModel.find({
		profession: { $exists: true },
	});
	const recruitments = await recruitmentsModel.find({
		profession: { $exists: true },
	});
	if (!users) return conflictResponse('No se encontro ningun usuario');
	if (!specialists)
		return conflictResponse('No se encontro ningun especialista');
	if (!recruitments)
		return conflictResponse('No se encontro ningun reclutamiento');
	// Se obtienen los id de los usuarios y especialistas
	const spec = specialists.map(spec => spec._id);
	const user = users.map(user => user._id);
	const recruitment = recruitments.map(recruitment => recruitment._id);
	// Se agrega la profesion a los especialistas
	await specModel.updateMany(
		{ _id: { $in: spec } },
		{ $unset: { profession: '' } }
	);
	await userModel.updateMany(
		{ _id: { $in: user } },
		{ $unset: { profession: '' } }
	);
	await recruitmentsModel.updateMany(
		{ _id: { $in: recruitment } },
		{ $unset: { profession: '' } }
	);
	return okResponse('Profesion eliminada', { user });
};

const removeRole = async () => {
	// Se buca a todos los usuarios con el rol de especialista
	const user = await userModel.find({ role: 'specialist' });
	if (!user) return conflictResponse('No se encontro ningun usuario');
	// Se cambia el rol de especialista a especialista
	await userModel.updateMany({ role: 'specialist' }, { role: 'specialist' });
	return okResponse('Rol cambiado', { user });
};

const scriptsService = {
	changeRole,
	addProfesion,
	removeProfesion,
	removeRole,
};

export default Object.freeze(scriptsService);
