import { conflictResponse, okResponse } from '../utils/responses/functions';
import Coupon from '../models/coupons';
import { logInfo } from '../config/pino';
import moment from 'moment';

const newCoupon = async (user, payload) => {
	if (user.role !== 'superuser')
		return conflictResponse('No tienes poder aqui.');
	if (Coupon.exists({ code: payload.code }))
		return conflictResponse('Ya hay un cupon con ese codigo');

	const coupon = {
		code: payload.code,
		discount: payload.discount,
		discountType: payload.discountType,
		restrictions: payload.restrictions,
		expiration: payload.expiration,
	};

	await Coupon.create(coupon);
	logInfo(`${user.email} ha creado un cupon con el codigo ${payload.code}`);
	return okResponse('Cupon creado con exito');
};

const checkCoupon = async code => {
	const foundCoupon = Coupon.findOne({ code });
	if (!foundCoupon)
		return conflictResponse('No se ha encontrado un cupon con ese codigo');
	if (!moment().isBefore(foundCoupon.expiration))
		return conflictResponse('Este cupon ya ha expirado');

	return okResponse('el cupon es valido', { coupon: foundCoupon });
};

const couponService = {
	newCoupon,
	checkCoupon,
};

export default Object.freeze(couponService);
