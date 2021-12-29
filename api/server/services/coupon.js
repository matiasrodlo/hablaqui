"use strict";

import { conflictResponse, okResponse } from "../utils/responses/functions";
import Coupon from "../models/coupons";
import { logInfo } from "../config/pino";
import moment from "moment";

const newCoupon = async (user, payload) => {
  if (user.role !== "superuser") {
    return conflictResponse("No tienes poder aqui.");
  }
  if (await Coupon.exists({ code: payload.code })) {
    return conflictResponse("Ya hay un cupon con ese codigo");
  }

  const coupon = {
    code: payload.code,
    discount: payload.discount,
    discountType: payload.discountType,
    restrictions: payload.restrictions,
    expiration: moment(payload.expiration).toISOString(),
  };

  await Coupon.create(coupon);
  logInfo(`${user.email} ha creado un cupon con el codigo ${payload.code}`);
  return okResponse("Cupon creado con exito");
};

const checkCoupon = async (code, user) => {
  const foundCoupon = await Coupon.findOne({ code });
  if (!foundCoupon) {
    return conflictResponse("No se ha encontrado un cupon con ese codigo");
  }
  if (moment().isAfter(foundCoupon.expiration)) {
    return conflictResponse("Este cupon ya ha expirado");
  }
  if (foundCoupon.restrictions.firstTimeOnly && user.hasPaid) {
    return conflictResponse("Este usuario ya ha comprado alguna vez");
  }
  return okResponse("el cupon es valido", { coupon: foundCoupon });
};

const couponService = {
  newCoupon,
  checkCoupon,
};

export default Object.freeze(couponService);
