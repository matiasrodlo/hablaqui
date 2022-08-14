'use strict';

import couponService from '../services/coupon';
import { errorCallback } from '../utils/functions/errorCallback';
import { restResponse } from '../utils/responses/functions';

const couponController = {
	async newCoupon(req, res) {
		try {
			const { user } = req;
			const { payload } = req.body;
			const { data, code } = await couponService.newCoupon(user, payload);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res);
		}
	},

	async checkCoupon(req, res) {
		try {
			const { coupon } = req.body;
			const { user } = req;
			const { data, code } = await couponService.checkCoupon(
				coupon,
				user
			);
			return restResponse(data, code, res);
		} catch (e) {
			return errorCallback(e, res);
		}
	},
};

export default Object.freeze(couponController);
