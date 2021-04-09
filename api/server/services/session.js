import { logInfo } from '../config/pino';
import Session from '../models/session';
import { conflictResponse, okResponse } from '../utils/responses/functions';

const create = async req => {
	const newSession = new Session({
		date: req.date,
		title: req.title,
		psychologist: req.psychologist,
		client: req.client,
	});

	const results = await Session.find({
		psychologist: req.psychologist,
		date: req.date,
	});
	if (results.length !== 0) {
		logInfo('Ya hay una sesion creada en esa hora');
		return conflictResponse('ya hay una sesion creada en esa hora');
	}

	newSession.save();
	logInfo('creo una nueva cita');
	return okResponse('sesion creada');
};

const sessionService = {
	create,
};

export default Object.freeze(sessionService);
