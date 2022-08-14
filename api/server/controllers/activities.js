'use strict';
import activitiesService from '../services/activities';

const activitiesController = {
	getAll(req, res) {
		const { user } = req;
		activitiesService.getAll(user, res);
	},
	create(req, res) {
		const { user } = req;
		const place = req.body;
		activitiesService.createOne(user, place, res);
	},
	deleteAll(req, res) {
		const { user } = req;
		activitiesService.deleteAll(user, res);
	},
};

export default Object.freeze(activitiesController);
