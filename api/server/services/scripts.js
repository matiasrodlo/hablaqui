'use strict';

import { okResponse, conflictResponse } from '../utils/responses/functions';
import userModel from '../models/user';

const changeRole = async () => {
	const user = await userModel.find({ role: 'psychologist' });
	if (!user) return conflictResponse('No se encontro ningun usuario');
	await userModel.updateMany(
		{ role: 'psychologist' },
		{ role: 'specialist' }
	);
	return okResponse('Rol cambiado', { user });
};

const scriptsService = {
	changeRole,
};

export default Object.freeze(scriptsService);
