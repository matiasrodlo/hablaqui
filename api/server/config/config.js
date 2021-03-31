// ============================
// Enviroment development
// Establece las variables de entorno para el trabajo local
// ============================
import dotenv from 'dotenv';
dotenv.config();
process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// process.env.URLDB = process.env.URLDB || 'mongodb://localhost:27017/sochamar';

process.env.URLDB =
	process.env.URLDB ||
	'mongodb+srv://silvita:Perez123@hablaqui-staging.awvck.mongodb.net/hablaqui';

process.env.FRONTEND_URL =
	process.env.FRONTEND_URL || 'http://localhost:8080/#';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'sochamar12345';
process.env.JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256';
process.env.JWT_EXPIRATION = process.env.JWT_EXPIRATION || '30d';
process.env.PASSWORD_RECOVERY_JWT_EXPIRATION =
	process.env.PASSWORD_RECOVERY_JWT_EXPIRATION || '4m';
process.env.API_URL = process.env.API_URL || 'http://localhost:3000/';
process.env.GOOGLE_CLIENT_ID =
	process.env.GOOGLE_CLIENT_ID ||
	'326428183768-n5t9r18fekpb722933s3sv07q3sd6n0a.apps.googleusercontent.com';
process.env.GOOGLE_CLIENT_SECRET =
	process.env.GOOGLE_CLIENT_SECRET || 'sUkgN-R-0vIYMKhaOhOD0WVh';
process.env.GOOGLE_STRATEGY_CALLBACK =
	process.env.GOOGLE_STRATEGY_CALLBACK ||
	'http://localhost:3000/api/v1/auth/google/callback';
process.env.BUCKETNAME = process.env.BUCKETNAME || 'plhain-staging-bucket';
process.env.MERCADOPAGO_SANDBOX_KEY =
	process.env.MERCADOPAGO_SANDBOX_KEY ||
	'TEST-282590749164606-042715-9739497e10049c77fda1560dd2c89780-16097895';
process.env.MERCADOPAGO_PRODUCTION_KEY =
	process.env.MERCADOPAGO_PRODUCTION_KEY || '';
process.env.MERCADOPAGO_SUCCESS_URL =
	process.env.MERCADOPAGO_SUCCESS_URL ||
	'http://localhost:8080/#/billing?transaction=success';
process.env.MERCADOPAGO_FAILURE_URL =
	process.env.MERCADOPAGO_FAILURE_URL ||
	'http://localhost:8080/#/billing?transaction=failure';
process.env.MERCADOPAGO_PENDING_URL =
	process.env.MERCADOPAGO_PENDING_URL ||
	'http://localhost:8080/#/billing?transaction=pending';
process.env.MERCADOPAGO_NOTIFICATION_URL =
	process.env.MERCADOPAGO_NOTIFICATION_URL ||
	'https://api-dot-plhain-staging.rj.r.appspot.com/api/v1/transactions/mercadopago/notifications';

process.env.TWILIO_PROD_ACCOUNTSID =
	process.env.TWILIO_PROD_ACCOUNTSID || 'AC67899c3ed7cba76e23be9660a586f7ff';

process.env.TWILIO_PROD_AUTHTOKEN =
	process.env.TWILIO_PROD_AUTHTOKEN || '9009e4a8030a4a9a2189ddb447da5b43';

process.env.TWILIO_PROD_LODGING_VALIDATIONS_NUMBER = process.env.TWILIO_PROD_LODGING_VALIDATIONS_NUMBER =
	process.env.TWILIO_PROD_LODGING_VALIDATIONS_NUMBER || '+19143025205';
