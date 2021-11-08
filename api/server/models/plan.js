'use strict';

import { model, Schema } from 'mongoose';

let plan = new Schema({
	name: {
		type: String,
	},
	value: {
		type: Number,
	},
});

export default model('plan', plan);
