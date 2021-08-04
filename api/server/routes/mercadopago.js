import { Router } from 'express';
import mercadopagoController from '../controllers/mercadopago';

const mercadopagoRouter = Router();

mercadopagoRouter.post(
	'/mercadopago/create-preference',
	mercadopagoController.createPreference
);

mercadopagoRouter.get(
	'/mercadopago/success-pay/:psyId/:userId/:sessionId',
	mercadopagoController.successPay
);

mercadopagoRouter.post(
	'/mercadopago/psychologist-preference',
	mercadopagoController.createPsychologistPreference
);

mercadopagoRouter.get(
	'/mercadopago/psychologist-pay/:psychologistId/:price',
	mercadopagoController.psychologistPay
);

export default mercadopagoRouter;
