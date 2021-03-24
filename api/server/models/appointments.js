import UniqueValidator from "mongoose-unique-validator";
import { Schema, model } from 'moongoose';

let appointment = new Schema({
    nombre: {
        type: String,
    }
});

appointment.plugin(UniqueValidator, { message: '{PATH} debe ser unico'});
export default model('appointment', appointment)