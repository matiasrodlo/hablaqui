import { logInfo } from '../config/pino.js';
import Appointments from '../models/appointments.js';
import { infoMessages } from '../utils/logger/infoMessages.js';
import { okResponse } from '../utils/responses/functions.js';

const getAll = async () => {
	logInfo(infoMessages('obtuvo todas las consultas'));
	const appointments = await Appointments.find();
	return okResponse('consultas obtenidas', { appointments });
};

const appointmentsService = {
	getAll,
};

export default Object.freeze(appointmentsService);
