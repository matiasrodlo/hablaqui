import psychologistsService from '../services/psychologist';
import { okResponse } from '../utils/responses/functions';

const psychologistsController = {
    async getAll(req, res) {
        const psychogists = await psychologistsService.getAll();

        return okResponse()
    }
}

export default Object.freeze(psychologistsController)