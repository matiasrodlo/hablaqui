"use strict";

import { model, Schema } from "mongoose";

const article = new Schema(
  {
    title: {
      type: String,
    },
    shortDescription: {
      type: String,
    },
    rating: {
      type: Object,
    },
    thumbnail: {
      type: String,
    },
    HTMLbody: {
      type: String,
    },
    notOriginal: {
      type: Boolean,
    },
    originalAuthor: {
      type: String,
    },
    originalSource: {
      type: String,
    },
    categories: {
      type: String,
    },
    slug: {
      type: String,
    },
    author: {
      type: String,
    },
    authorDescription: {
      type: String,
    },
    authorAvatar: {
      type: String,
    },
  },
  { timestamps: true }
);
export default model("article", article);
