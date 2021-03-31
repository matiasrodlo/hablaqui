import { logError, logInfo } from "../config/pino"
import Session from "../models/session";
import { errorCallback } from "../utils/functions/errorCallback";
import { okResponse } from "../utils/responses/functions";

const create = async (req, res) => {
    const newSession = new Session({
        date: req.date,
        title: req.title,
        psychologist: req.psychologist,
        client: req.client, 
    });

    try {
        const results = await Session.find({ psychologist: req.psychologist, date: req.date });

        if (results.length !== 0) {
            logInfo('Ya hay una sesion creada en esa hora')
            return okResponse('error al crear la sesion', '')
        }
        const session = newSession.save();
        logInfo('creo una nueva cita');
        return okResponse('session creada', '')
    } catch (e) {
        logError(e);
        return errorCallback(e, res, 'error creando una cita')
    }
}

const sessionService = {
    create
};

export default Object.freeze(sessionService);