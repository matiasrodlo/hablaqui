import { Schema, model } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

let subscriber = new Schema(
	{
		email: { type: String },
		preferences: {
			type: Array,
			default: ['blog'],
		},
	},
	{ timestamps: true }
);

subscriber.plugin(mongooseUniqueValidator, {
	message: `{PATH} debe ser unico`,
});

export default model('emailSubscriber', subscriber);
