'use strict';

import { Router } from 'express';
import mercadopagoController from '../controllers/mercadopago';
import mercadopago from '../services/mercadopago';

const mercadopagoRouter = Router();

/**
 * MERCADOPAGO SESIONES GENERAL
 * @description: Ruta para crear una preferencia (URL de pago) de un plan de usuario
 * @param {Object} body - Objeto con los parametros necesarios
 * @param {String} body.descritipn - Titulo del objeto de pago
 * @param {Integer} body.price - Precio a pagar (en CLP)
 * @param {String} body.plan - ObjectId del plan creado previamente
 * @returns: Preferencia, pero lo importante es el init_point (la URL para redireccionar a mercadopago)

 */
mercadopagoRouter.post(
	'/mercadopago/create-preference',
	mercadopagoController.createPreference
);

/**
 * @description: Esta ruta no debe ser usada por frontend, solo es back_url de la preferencia.
 */
mercadopagoRouter.get(
	'/mercadopago/success-pay/:planId',
	mercadopagoController.successPay
);

/**

 * MERCADOPAGO PLANES DE PSICOLOGO

 * @description: Ruta para crear una preferencia (URL de pago) de un plan de psicologo
 * @param {Object} body - Objeto con los parametros necesarios
 * @param {String} body.descritipn - Titulo del objeto de pago
 * @param {Integer} body.price - Precio a pagar (en CLP)
 * @param {String} body.psychologistToUpdate - ObjectId del psicologo que ha pagado
 * @returns: Preferencia, pero lo importante es el init_point (la URL para redireccionar a mercadopago)

 */
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

/*
 * @description: Esta ruta no debe ser usada por frontend, solo es back_url de la preferencia.
 */
mercadopagoRouter.get(
	'/mercadopago/psychologist-pay/:psychologistId',
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
