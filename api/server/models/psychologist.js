import uniqueValidator from 'mongoose-unique-validator';
import { Schema, model } from 'mongoose';

// ToDo: Agregar validacion de RUT

let psychologist = new Schema({
    code: {
        type: String,
    },
    email: {
        type: String,
    },
    name: {
        type: String,
    },
    experience: {
        type: String,
    },
    specialties: {
        type: Array,
    },
    formation: {
        type: String,
    },
    description: {
        type: String,
    },
});

psychologist.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
export default model('psychologist', psychologist);