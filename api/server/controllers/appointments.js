import { restResponse } from "../utils/responses/functions";
import appointmentsService from '../services/appointments';

const appointmentsController = {
    async getAll(req, res) {
        const { data, code } = await appointmentsService.getAll();

        return restResponse(data, code, res)
    }
}

export default Object.freeze(appointmentsController)