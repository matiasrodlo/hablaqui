'use strict';

import { Router } from 'express';
import mercadopagoController from '../controllers/mercadopago';

const mercadopagoRouter = Router();

/**
 * MERCADOPAGO SESIONES GENERAL
 * @description Ruta para crear una preferencia (URL de pago) de un plan de usuario
 * @param {Object} body - Objeto con los parametros necesarios
 * @param {String} body.descritipn - Titulo del objeto de pago
 * @param {Integer} body.price - Precio a pagar (en CLP)
 * @param {String} body.plan - ObjectId del plan creado previamente
 * @returns: Preferencia, pero lo importante es el init_point (la URL para redireccionar a mercadopago)

 */
/*mercadopagoRouter.post(
	'/mercadopago/create-preference',
	mercadopagoController.createPreference
);*/

/**
 * @description Esta ruta no debe ser usada por frontend, solo es back_url de la preferencia.
 * @param {String} params.sessionsId - Identificador de la colección de "sessions"
 * @param {String} params.planId - Identificador del objeto plan
 */
mercadopagoRouter.get(
	'/mercadopago/success-pay/:sessionsId/:planId',
	mercadopagoController.successPay
);

/**
 * @description crear preferencias para generar ruta de pago
 * @returns {String} URL para pagar
 */
mercadopagoRouter.post(
	'/mercadopago/psychologist-preference',
	mercadopagoController.createPsychologistPreference
);

/**
 * @description Pasa una plan de postulante a pagado.
 * @param {string} params.recruitedId el id del postulante
 * @query {string} planId el periodo de pago (mensual, anual)
 */
mercadopagoRouter.get(
	'/mercadopago/recruited-pay/:recruitedId',
	mercadopagoController.recruitedPay
);

/*
 * @description: Esta ruta no debe ser usada por frontend, solo es back_url de la preferencia.
 */

/**
 * @description Pasa una plan de postulante a pagado.
 * @param {String} params.psychologistId el id del psicólogo
 * @query {string} planId el periodo de pago (mensual, anual)
 */
mercadopagoRouter.get(
	'/mercadopago/psychologist-pay/:psychologistId',
	mercadopagoController.psychologistPay
);

/**
 * MERCADOPAGO SESIONES CUSTOM
 * @description Crea las preferencias para la pasarela de mercadopago
 * @param {String} params.userId - Id del usuario asociado al plan
 * @param {String} params.psyId - Id del psicólogo asociado al plan
 * @param {String} params.planId - Id del plan
 * @return init_point
 */
mercadopagoRouter.get(
	'/mercadopago/custom-session/:userId/:psyId/:planId',
	mercadopagoController.createCustomSessionPreference
);

/**
 * @description Actualiza el plan custom a pagado
 * @param {String} params.userId - Id del usuario asociado al plan
 * @param {String} params.psyId - Id del psicólogo asociado al plan
 * @param {String} params.planId - Id del plan
 * @retrun Objeto con el plan actualizado
 */
mercadopagoRouter.get(
	'/mercadopago/custom-session-pay/:userId/:psyId/:planId',
	mercadopagoController.customSessionPay
);

export default mercadopagoRouter;
