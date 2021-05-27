import { Router } from 'express';
import mercadopagoController from '../controllers/mercadopago';

const mercadopagoRouter = Router();

mercadopagoRouter.post(
	'/mercadopago/create-preference',
	mercadopagoController.createPreference
);

mercadopagoRouter.post(
	'/mercadopago/success-pay/:psyId/:userId/:sessionId',
	mercadopagoController.successPay
);

export default mercadopagoRouter;
