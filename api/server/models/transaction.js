"use strict";

import { Schema, model } from "mongoose";

let transaction = new Schema(
  {
    psychologist: {
      type: Schema.Types.ObjectId,
      ref: "psychologist",
    },
    total: { type: Number },
    sessions: { type: Array },
  },
  { timestamps: true }
);

export default model("transaction", transaction);
