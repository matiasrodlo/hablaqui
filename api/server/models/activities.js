'use strict';

import uniqueValidator from 'mongoose-unique-validator';
import { Schema, model } from 'mongoose';

// let rolesValidos = {
//     values: ['COMPRA', 'VENTA'],
//     message: '{VALUE} no es un tipo válido'
// };

let toDo = new Schema({
	workPlace: {
		type: String,
	},
	whatWasDone: {
		type: Array,
	},
	ncamas: {
		type: Number,
		default: 0,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	state: {
		type: Boolean,
		default: false,
	},
});

toDo.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
export default model('toDo', toDo);
