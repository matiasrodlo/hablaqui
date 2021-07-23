import { logError } from '../../config/winston';
import { errorResponse } from '../responses/functions';

export const errorCallback = (err, res, description) => {
	if (err.code === 'uniqueValidation') return res.status(409).json({ message: err.message });
	logError(err);
	if (description) {
		err.description = description;
	}
	errorResponse(err, res);
};
