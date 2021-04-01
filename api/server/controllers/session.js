import sessionService from '../services/session'
import { restResponse } from '../utils/responses/functions';

const sessionController = {
    async create(req, res) {
        const { data, code } = await sessionService.create(req.body, res);

        return restResponse(data, code, res)
    }
}

export default Object.freeze(sessionController)