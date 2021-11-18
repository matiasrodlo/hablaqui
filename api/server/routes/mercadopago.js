'use strict';

import { Router } from 'express';
import mercadopagoController from '../controllers/mercadopago';

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
 * @body {Object} datos de la preferencia (precio, periodo, id del psicologo)
 * {
 * 		"title": "Premium mensual" o  "Premium anual",
 * 		"description": "Plan Premium de Hablaqui",
 * 		"price": "{PRECIO DEL PLAN}",
 * 		"period": "anual" o "mensual",
 * 		"psychologistId": "{ID DEL PSICOLOGO}",
 * }
 * @returns {String} URL para pagar 
 */
mercadopagoRouter.post(
	'/mercadopago/psychologist-preference',
	mercadopagoController.createPsychologistPreference
);

/**
 *
 * MERCADOPAGO PLANES DE POSTULANTE
 *
 * Crea una preferencia de mercadopago para pago de plan de postulante
 * @body {Object} datos de la preferencia (precio, periodo, id del postulante)
 * {
 * 		"title": "Premium mensual" o  "Premium anual",
 * 		"description": "Plan Premium de Hablaqui",
 * 		"price": "{PRECIO DEL PLAN}",
 * 		"period": "anual" o "mensual",
 * 		"recruitmentId": "{ID DEL POSTULANTE}",
 * }
 * @returns {String} URL para pagar
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
