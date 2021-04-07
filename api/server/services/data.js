import csvtojson from 'csvtojson';
import Appointments from '../models/appointments';
import Psychologist from '../models/psychologist';
import { okResponse } from '../utils/responses/functions';

const uploadCsv = async (req, res) => {
	// validates file type
	if (req.file.mimetype !== 'text/csv') {
		return res.status(401).send('only .csv accepted');
	}

	if (req.file.originalname === 'psychologists.csv') {
		csvtojson()
			.fromFile(req.file.path)
			.then(data => {
				data.forEach(data => {
					const newSpecialties = data.specialties.split(';');

					data.specialties = newSpecialties;
					const newData = new Psychologist(data);
					const save = newData.save();
				});
			});

		return okResponse('psicologos subidos', '');
	}

	if (req.file.originalname === 'appointments.csv') {
		csvtojson()
			.fromFile(req.file.path)
			.then(data => Appointments.insertMany(data));

		return okResponse('consultas subidas', '');
	}

	return okResponse('no se pudo subir el archivo', '');
};

const dataService = {
	uploadCsv,
};

export default Object.freeze(dataService);
