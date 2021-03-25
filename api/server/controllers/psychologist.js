import psychologistsService from '../services/psychologist';
import { restResponse } from '../utils/responses/functions';

const psychologistsController = {
    async getAll(req, res) {
        const { data, code } = await psychologistsService.getAll();

        return restResponse(data, code, res)
    }
}

export default Object.freeze(psychologistsController)