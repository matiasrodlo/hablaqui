import { okResponse } from "../utils/responses/functions";
import appointmentsService from '../services/appointments';

const appointmentsController = {
    async getAll(req, res) {
        const appointments = await appointmentsService.getAll();

        return okResponse()
    }
}

export default Object.freeze(appointmentsController)