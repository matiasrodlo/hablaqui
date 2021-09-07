import { Router } from 'express';
import mercadopagoController from '../controllers/mercadopago';

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
	'/mercadopago/success-pay/:psyId/:userId/:sessionId',
	mercadopagoController.successPay
);

export default mercadopagoRouter;
