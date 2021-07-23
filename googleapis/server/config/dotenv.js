// ============================
// Enviroment development
// ============================
import dotenv from 'dotenv';
dotenv.config();

export const cloud_project_name = process.env.CLOUD_PROJECT_NAME;
export const cloud_project_location = process.env.CLOUD_PROJECT_LOCATION;
export const send_sms_message_service_url = process.env.SEND_SMS_MESSAGE_SERVICE_URL;
export const send_sms_message_task_queue = process.env.SEND_SMS_MESSAGE_TASK_QUEUE;
export const frontend_url = process.env.FRONTEND_URL;
export const send_lodging_confirmation_sms_service_url =
	process.env.SEND_LODGING_CONFIRMATION_SMS_SERVICE_URL;
export const send_lodging_confirmation_sms_task_queue =
	process.env.SEND_LODGING_CONFIRMATION_SMS_TASK_QUEUE;
export const pusher_beams_instance = process.env.VUE_APP_PUSHER_BEAMS_INSTANCE;
export const pusher_beams_key = process.env.VUE_APP_PUSHER_BEAMS_KEY;
export const origin = process.env.ORIGIN;
export const port = process.env.PORT;
export const node_env = process.env.NODE_ENV;
export const url_db = process.env.URLDB;
export const twilio_prod_lodging_validations_number =
	process.env.TWILIO_PROD_LODGING_VALIDATIONS_NUMBER;
export const pusher_app_id = process.env.PUSHER_APP_ID;
export const pusher_secret = process.env.PUSHER_SECRET;
export const pusher_key = process.env.PUSHER_KEY;
export const pusher_cluster = process.env.PUSHER_CLUSTER;
export const jwt_secret = process.env.JWT_SECRET;
export const api_url = process.env.API_URL;
export const password_recovery_jwt_expiration = process.env.PASSWORD_RECOVERY_JWT_EXPIRATION;
export const mongo_logs = process.env.MONGO_LOGS;
export const push_person_verify_url = process.env.PUSH_PERSON_VERIFY_URL;
export const push_person_verify = process.env.PUSH_PERSON_VERIFY;
export const no_reply_email = process.env.NO_REPLY_EMAIL;
export const no_reply_password = process.env.NO_REPLY_PASSWORD;
export const send_person_and_document_noti_url = process.env.SEND_PERSON_AND_DOCUMENT_NOTI_URL;
export const send_person_and_document_noti_task_queue =
	process.env.SEND_PERSON_AND_DOCUMENT_NOTI_TASK_QUEUE;
export const google_client_id = process.env.GOOGLE_CLIENT_ID;
export const google_client_secret = process.env.GOOGLE_CLIENT_SECRET;
export const google_client_redirect = process.env.GOOGLE_CLIENT_REDIRECT;
