'use strict';

import { Schema, model } from 'mongoose';

let appointment = new Schema({
	name: {
		type: String,
	},
});

export default model('appointment', appointment);
