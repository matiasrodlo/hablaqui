import { logInfo } from '../config/pino';
import Psychologist from '../models/psychologist';
import { errorCallback } from '../utils/functions/errorCallback';
import { infoMessages } from '../utils/logger/infoMessages';
import { okResponse } from '../utils/responses/functions';

const getAll = async () => {
    try{
        logInfo(infoMessages('obtuvo todos los psicologos'));
        const psychologists = await Psychologist.find();
        return okResponse('true', psychologists)
    } catch (e) {
        errorCallback(e, res, 'Error consiguiendo los psicologos');
    }
}

const psychologistsService = {
    getAll
};

export default Object.freeze(psychologistsService)
