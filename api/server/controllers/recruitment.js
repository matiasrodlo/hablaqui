import recruitmentService from "../services/recruitment";
import { restResponse } from '../utils/responses/functions';
import { errorCallback } from '../utils/functions/errorCallback';

const recruitmentController = {
    async registerPsychologist(req, res) {
        try {
            const { body } = req;
            const { data, code } = await recruitmentService.registerPsychologist(
                body
            );
            restResponse(data, code, res);
        } catch (e) {
            errorCallback(e, res, 'Error registrando el psicologo');
        }
    }
};

export default Object.freeze(recruitmentController);

