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

/**
 * Crea una preferencia de mercadopago para pago de plan de postulante
 * @param {string} planId
 * @body {string} datos de la preferencia (precio, periodo, id del postulante)
 */
mercadopagoRouter.post(
	'/mercadopago/recruited-preference',
	mercadopagoController.createRecruitedPreference
);

/**
 * Pasa una plan de postulante a pagado.
 * @param {string} recruitedId el id del postulante
 * @query {string} planId el periodo de pago (mensual, anual)
 */
mercadopagoRouter.get(
	'/mercadopago/recruited-pay/:recruitedId',
	mercadopagoController.recruitedPay
);

mercadopagoRouter.get(
	'/mercadopago/psychologist-pay/:psychologistId',
	mercadopagoController.psychologistPay
);

export default mercadopagoRouter;
