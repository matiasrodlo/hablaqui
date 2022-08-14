import { logError } from '../../config/winston';

export const pusherCallback = error => {
	if (error) logError(error);
};
