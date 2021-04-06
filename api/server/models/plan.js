import { model, plugin, Schema } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

let plan = new Schema({
    name: {
        type: String,
    },
    value: {
        type: Number,
    },
})

plan.plugin(mongooseUniqueValidator, { message: '{PATH} debe ser unico'})
export default model('plan', plan);