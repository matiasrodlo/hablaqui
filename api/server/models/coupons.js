"use strict";

import { Schema, model } from "mongoose";

/* Restrictions example
/ firstTimeOnly: boolean,
/ maxUses: number,
*/

let coupon = new Schema({
  code: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  discountType: {
    type: String,
    enum: ["percentage", "static"],
    required: true,
  },
  restrictions: {
    type: Object,
  },
  expiration: {
    type: String,
  },
});

export default model("coupon", coupon);
