/**
 * Article Model
 * 
 * This module defines the Mongoose schema and model for articles in the Hablaquí system.
 * It specifies the structure and validation rules for article documents in MongoDB.
 * 
 * @module models/article
 */

'use strict'

import { model, Schema } from 'mongoose'

/**
 * Article Schema
 * Defines the structure and validation rules for article documents
 * 
 * @type {Schema}
 * @property {String} title - The title of the article
 * @property {String} shortDescription - A brief description of the article
 * @property {Object} rating - Article rating information
 * @property {String} thumbnail - URL to the article's thumbnail image
 * @property {String} HTMLbody - The main content of the article in HTML format
 * @property {Boolean} notOriginal - Flag indicating if the article is original content
 * @property {String} originalAuthor - Name of the original author if notOriginal is true
 * @property {String} originalSource - Source of the original content if notOriginal is true
 * @property {String} categories - Categories the article belongs to
 * @property {String} slug - URL-friendly version of the article title
 * @property {String} author - Name of the article author
 * @property {String} authorDescription - Brief description of the author
 * @property {String} authorAvatar - URL to the author's avatar image
 */
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
)
export default model('article', article)
