import UniqueValidator from 'mongoose-unique-validator';
import { Schema, model } from 'mongoose';

let appointment = new Schema({
	name: {
		type: String,
	},
});

appointment.plugin(UniqueValidator, { message: '{PATH} debe ser unico' });
export default model('appointment', appointment);
