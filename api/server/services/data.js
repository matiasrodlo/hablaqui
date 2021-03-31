import csvtojson from "csvtojson"
import { logInfo } from "../config/pino"
import Appointments from "../models/appointments";
import Psychologist from "../models/psychologist";
import { errorCallback } from "../utils/functions/errorCallback";
import { okResponse } from "../utils/responses/functions"

const uploadCsv = async(req, res) => {
    try{
        // validates file type
        if (req.file.mimetype !== 'text/csv'){
            return res.status(401).send('only .csv accepted')
        }

        if (req.file.originalname === 'psychologists.csv') {
            csvtojson()
            .fromFile(req.file.path)
            .then(data => 
                Psychologist.insertMany(data)
                )

            return okResponse('psicologos subidos', '')
        }

        if (req.file.originalname === 'appointments.csv') {
            csvtojson()
            .fromFile(req.file.path)
            .then(data => 
                Appointments.insertMany(data)
                )
            return okResponse('consultas subidas', '')
        }

        return okResponse('no se pudo subir el archivo', '')
    } catch (e) {
        errorCallback(e, res, 'Error subiendo el archivo');
    }
}

const dataService = {
    uploadCsv
};

export default Object.freeze(dataService);