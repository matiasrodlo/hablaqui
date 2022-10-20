'use strict';

import { conflictResponse, okResponse } from '../utils/responses/functions';
import Coupon from '../models/coupons';
import { logInfo } from '../config/pino';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Santiago');

const newCoupon = async (user, payload) => {
	if (user.role !== 'superuser')
		return conflictResponse('No tienes poder aqui.');
	if (await Coupon.exists({ code: payload.code }))
		return conflictResponse('Ya hay un cupon con ese codigo');

	const coupon = {
		code: payload.code,
		discount: payload.discount,
		discountType: payload.discountType,
		restrictions: payload.restrictions,
		expiration: dayjs(payload.expiration).toISOString(),
	};

	await Coupon.create(coupon);
	logInfo(`${user.email} ha creado un cupon con el codigo ${payload.code}`);
	return okResponse('Cupon creado con exito');
};

const checkCoupon = async (code, user) => {
	const foundCoupon = await Coupon.findOne({ code });
	if (!foundCoupon)
		return conflictResponse('No se ha encontrado un cupon con ese codigo');
	if (dayjs().isAfter(foundCoupon.expiration))
		return conflictResponse('Este cupon ya ha expirado');
	if (foundCoupon.discountType === 'static' && foundCoupon.discount === 0)
		return conflictResponse('Cupón con saldo 0');
	if (foundCoupon.restrictions) {
		if (foundCoupon.restrictions.firstTimeOnly && user.hasPaid)
			return conflictResponse('Este usuario ya ha comprado alguna vez');
		if (
			foundCoupon.restrictions.user &&
			foundCoupon.restrictions.user.toString() !== user._id.toString()
		)
			return conflictResponse('Usuario no habilitado para este cupón');
	}

	logInfo('aplicado');
	return okResponse('el cupon es valido', { coupon: foundCoupon });
};

const couponService = {
	newCoupon,
	checkCoupon,
};

export default Object.freeze(couponService);
