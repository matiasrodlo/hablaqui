'use strict';

import { Router } from 'express';
import mercadopagoController from '../controllers/mercadopago';
import mercadopago from '../services/mercadopago';

const mercadopagoRouter = Router();

/**
 * Crea una preferencia en mercadopago (sirve para extraer un link donde pagar)
 */
mercadopagoRouter.post(
	'/mercadopago/create-preference',
	mercadopagoController.createPreference
);

/**
 * Pasa una sesion a pagada.
 */
mercadopagoRouter.get(
	'/mercadopago/success-pay/:planId',
	mercadopagoController.successPay
);

mercadopagoRouter.post(
	'/mercadopago/psychologist-preference',
	mercadopagoController.createPsychologistPreference
);

mercadopagoRouter.post(
	'/mercadopago/recruited-preference',
	mercadopagoController.createRecruitedPreference
);

mercadopagoRouter.get(
	'/mercadopago/recruited-pay/:recruitedId',
	mercadopagoController.recruitedPay
);

mercadopagoRouter.get(
	'/mercadopago/psychologist-pay/:psychologistId',
	mercadopagoController.psychologistPay
);

export default mercadopagoRouter;
