import './config/config.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import passportConfig from './config/passport';
import path from 'path';
import routes from './routes/index';
import { logError, logger } from './config/pino';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
const app = express();
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // limit each IP to 1000 requests per windowMs
});
//limiter solve a brute attack problem in the api, every x time you're only allowed to send x quantity of requests
app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

passportConfig(passport);
app.use(passport.initialize());

routes(app);

mongoose
	.connect(process.env.URLDB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(logger.info('Data base online'))
	.catch(error => logError(error));
module.exports = app;
