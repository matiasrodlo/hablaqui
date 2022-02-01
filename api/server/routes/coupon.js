'use strict';

import { Router } from 'express';
import passport from 'passport';
import couponController from '../controllers/coupon';
import permission from '../middleware/permission';
import cors from 'cors';

const { corsApi } = permission;

const couponRouter = Router();

/**
 * Crea un nuevo cupon
 * NECESITA AUTENTICACION Y ROL SUPERUSUARIO.
 * req.body = { payload: {
 * 			code: string,
			discount: integer,
			discountType: 'static' || 'percent',
			restrictions: object, * OPCIONAL
			expiration: string (fecha),
		}
	}
 */
couponRouter.post(
	'/coupons/new-coupon',
	[cors(corsApi), passport.authenticate('jwt', { session: true })],
	couponController.newCoupon
);

/**
 * Revisa la validez de un cupon.
 * req.body = { coupon: string }
 */
couponRouter.post(
	'/coupons/check-coupon',
	[cors(corsApi), passport.authenticate('jwt', { session: true })],
	couponController.checkCoupon
);

export default couponRouter;
