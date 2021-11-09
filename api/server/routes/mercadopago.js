'use strict';

import { Router } from 'express';
import mercadopagoController from '../controllers/mercadopago';

const mercadopagoRouter = Router();

/**
 * MERCADOPAGO SESIONES GENERAL
 */
mercadopagoRouter.post(
	'/mercadopago/create-preference',
	mercadopagoController.createPreference
);

mercadopagoRouter.get(
	'/mercadopago/success-pay/:planId',
	mercadopagoController.successPay
);

/**
 * MERCADOPAGO PLANES DE PSICOLOGO
 */
mercadopagoRouter.post(
	'/mercadopago/psychologist-preference',
	mercadopagoController.createPsychologistPreference
);

mercadopagoRouter.get(
	'/mercadopago/psychologist-pay/:psychologistId/:price',
	mercadopagoController.psychologistPay
);

/**
 * MERCADOPAGO SESIONES CUSTOM
 */

mercadopagoRouter.get(
	'/mercadopago/custom-session/:userId/:psyId/:planId',
	mercadopagoController.createCustomSessionPreference
);

mercadopagoRouter.get(
	'/mercadopago/custom-session-pay/:id',
	mercadopagoController.customSessionPay
);

export default mercadopagoRouter;
