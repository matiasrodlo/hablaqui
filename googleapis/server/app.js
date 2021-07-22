import './config/dotenv.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import { logError, logger } from './config/winston';
import moment from 'moment';
import passportConfig from './config/passport';
import passport from 'passport';
import { url_db, origin, node_env, mongo_logs } from './config/dotenv';
import routerConfig from './routes';
moment.locale('es');

const app = express();
var corsOptions = {
	origin,
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
passportConfig(passport);
app.use(passport.initialize());
routerConfig(app);
//for mongose queries logging in devleopment env
if (mongo_logs) mongoose.set('debug', true);
const mongooseConfig = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
};
mongoose
	.connect(url_db, mongooseConfig)
	.then(logger.info('Base de datos en linea'))
	.catch(error => logError(error));
module.exports = app;
