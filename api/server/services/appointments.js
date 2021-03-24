import { logInfo } from '../config/pino.js'
import Appointments from '../models/appointments.js'
import { errorCallback } from '../utils/functions/errorCallback.js';
import { infoMessages } from '../utils/logger/infoMessages.js'
import { okResponse } from '../utils/responses/functions.js';

const getAll = async () => {
    try {
        logInfo(infoMessages('obtuvo todas las consultas'));
        const appointments = await Appointments.find();
        return okResponse('true', appointments)
    } catch (e) {
        errorCallback(e, res, 'Error consiguiendo las consultas')
    }
}

const appointmentsService = {
    getAll
};

export default Object.freeze(appointmentsService);