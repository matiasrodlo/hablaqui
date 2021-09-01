import Recruitment from '../models/recruitment';
import User from '../models/user';
import { logInfo } from '../config/winston';
import { conflictResponse, okResponse } from '../utils/responses/functions';
import { actionInfo } from '../utils/logger/infoMessages';
import bcrypt from 'bcrypt';

const recruitmentService = {
    async registerPsychologist(body) {
        if (await Recruitment.exists({rut: body.rut})) {
            return conflictResponse('Este psicologo ya está registrado');
        }
        if (await Recruitment.exists({username: body.username})) {
            return conflictResponse('Este username ya está registrado');
        }
        const recruitedPsy = await Recruitment.create(body);
        const newUser = {
            name: body.name,
            rut: body.rut,
            role: 'psychologist',
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            psychologist: recruitedPsy._id,
        };
        User.create(newUser);
        logInfo(actionInfo(recruitedPsy.email, 'se registró como psicologo'));
        return okResponse('Registrado exitosamente');
    }
}

export default recruitmentService;

