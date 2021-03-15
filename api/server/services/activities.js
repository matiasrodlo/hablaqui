import Activities from '../models/activities';
import { logError, logInfo } from '../config/pino';
import { infoMessages } from '../utils/logger/infoMessages';

const getAll = async (user, res) => {
	try {
		const activities = await Activities.find(null);
		const length = await Activities.countDocuments(null);
		logInfo(infoMessages(user.email, 'obtuvo', 'todos los', 'activities'));
		res.json({
			status: true,
			activities: activities.reverse(),
			length,
		});
	} catch (error) {
		logError(error);
		return res.status(400).send({
			status: false,
			error: error.message,
		});
	}
};

const createOne = async (user, activity, res) => {
	try {
		let activities = new Activities(activity);
		const activitiesDB = await activities.save();
		logInfo(
			infoMessages(
				user.email,
				'registro',
				'un',
				'activities',
				activitiesDB
			)
		);
		res.json({
			status: true,
			activities: activitiesDB,
		});
	} catch (error) {
		logError(error);
		return res.status(400).send({
			status: false,
			error: error.message,
		});
	}
};

const deleteAll = async (user, res) => {
	try {
		await Activities.deleteMany({});
		logInfo(infoMessages(user.email, 'elimino', 'todos los', 'activities'));
		res.json({
			status: true,
		});
	} catch (error) {
		logError(error);
		return res.status(400).send({
			status: false,
			error: error.message,
		});
	}
};

const activitiesService = {
	getAll,
	createOne,
	deleteAll,
};

export default Object.freeze(activitiesService);
