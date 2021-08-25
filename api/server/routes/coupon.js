import { Router } from 'express';
import passport from 'passport';
import couponController from '../controllers/coupon';

const couponRouter = Router();

couponRouter.post(
	'/coupons/new-coupon',
	[passport.authenticate('jwt', { session: true })],
	couponController.newCoupon
);

couponRouter.post('/coupons/check-coupon', couponController.checkCoupon);

export default couponRouter;
