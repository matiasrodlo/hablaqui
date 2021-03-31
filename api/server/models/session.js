import { model, Schema } from "mongoose";
import UniqueValidator from "mongoose-unique-validator";

let session = new Schema({
    date: {
        type: Date,
    },
    title: {
        type: String,
    },
    psychologist: {
        type: String,
    },
    client: {
        type: String,
    },
});

session.plugin(UniqueValidator, { message: '{PATH} debe ser unico' });
export default model('session', session);