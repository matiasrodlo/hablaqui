import { Router } from 'express';
import mercadopagoController from '../controllers/mercadopago';

const mercadopagoRouter = Router();

mercadopagoRouter.post(
	'/mercadopago/create-preference',
	mercadopagoController.createPreference
);

export default mercadopagoRouter;
