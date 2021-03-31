import sessionService from '../services/session'
import { restResponse } from '../utils/responses/functions';

const sessionController = {
    async create(req, res) {
        const { data, code } = sessionService.create(req.body, res);

        return restResponse(data, 500, res)
    }
}

export default Object.freeze(sessionController)