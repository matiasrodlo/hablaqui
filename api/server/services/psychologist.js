import { logInfo } from '../config/pino';
import Psychologist from '../models/psychologist';
import { errorCallback } from '../utils/functions/errorCallback';
import { infoMessages } from '../utils/logger/infoMessages';
import { okResponse } from '../utils/responses/functions';
const csvtojson = require('csvtojson');

const getAll = async () => {
    try{
        logInfo(infoMessages('obtuvo todos los psicologos'));
        const psychologists = await Psychologist.find();
        return okResponse('psicologos obtenidos', { psychologists })
    } catch (e) {
        errorCallback(e, res, 'Error consiguiendo los psicologos');
    }
}

const uploadCsv = async(req, res) => {
    try{
        // validates file type
        if (req.file.mimetype !== 'text/csv'){
            return res.status(401).send('only .csv accepted')
        }

        // converts to json
        csvtojson()
        .fromFile(req.file.path)
        .then(data => 
            Psychologist.insertMany(data)
            )

        return okResponse('archivo subido', '')
    } catch (e) {
        errorCallback(e, res, 'Error subiendo el archivo');
    }
}

const psychologistsService = {
    getAll,
    uploadCsv
};

export default Object.freeze(psychologistsService)
