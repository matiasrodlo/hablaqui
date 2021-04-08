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
		if (req.file.originalname === 'psychologists.csv') {
			let data = await csvtojson().fromFile(req.file.path);

			data = data.map(item => ({
				...item,
				specialties: item.specialties.split(';'),
			}));

			await Psychologist.insertMany(data);

			return okResponse('psicologos subidos');
		}
	}

	if (req.file.originalname === 'appointments.csv') {
		const data = await csvtojson().fromFile(req.file.path);
		await Appointments.insertMany(data);
		return okResponse('consultas subidas', '');
	}

	return okResponse('no se pudo subir el archivo');
};

const dataService = {
	uploadCsv,
};

export default Object.freeze(dataService);
