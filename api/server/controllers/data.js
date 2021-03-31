import dataService from '../services/data';
import { restResponse } from '../utils/responses/functions';

const dataController = {
    async uploadCsv(req, res) {
        const {data, code} = await dataService.uploadCsv(req, res)

        return restResponse(data, code, res)
    }
}

export default Object.freeze(dataController)