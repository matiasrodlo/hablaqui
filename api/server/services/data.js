'use strict';

import csvtojson from 'csvtojson';
import Appointments from '../models/appointments';
import Psychologist from '../models/psychologist';
import { okResponse, conflictResponse } from '../utils/responses/functions';

const uploadCsv = async file => {
	// validates file type
	if (file.mimetype !== 'text/csv')
		return conflictResponse('only .csv accepted');

	if (file.originalname === 'psychologists.csv') {
		if (file.originalname === 'psychologists.csv') {
			let data = await csvtojson().fromString(file.buffer.toString());

			data = data.map(item => ({
				...item,
				models: item.model.split(';'),
				specialties: item.specialties.split(';'),
			}));

			//await Psychologist.insertMany(data);

			let allSpecialties = [];
			data.forEach(item => {
				if (item.specialties) {
					item.specialties.forEach(specialtie => {
						allSpecialties.push(specialtie);
					});
				}
			});
			let foundAppointments = await Appointments.find();
			foundAppointments = foundAppointments.map(
				appointment => appointment.name
			);
			let specialtiesToSave = [];
			allSpecialties.forEach(item => {
				// trim
				if (item[0] === ' ') {
					item = item.slice(1);
				}
				if (!foundAppointments.includes(item)) {
					specialtiesToSave.push({ name: item });
				}
			});

			Appointments.insertMany(specialtiesToSave);
			return okResponse('psicologos subidos');
		}
	}

	if (file.originalname === 'appointments.csv') {
		const data = await csvtojson().fromFile(file.path);
		await Appointments.insertMany(data);
		return okResponse('consultas subidas', '');
	}

	return okResponse('no se pudo subir el archivo');
};

const dataService = {
	uploadCsv,
};

export default Object.freeze(dataService);
