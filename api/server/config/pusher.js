import Pusher from 'pusher';
import {
	pusher_app_id,
	pusher_key,
	pusher_secret,
	pusher_cluster,
} from './dotenv';
import { pusherCallback } from '../utils/functions/pusherCallback';
import { logger } from './winston';

const pusher = new Pusher({
	appId: pusher_app_id,
	key: pusher_key,
	secret: pusher_secret,
	cluster: pusher_cluster,
	encrypted: true,
});

export const pusherTrigger = ({ channel = '', event = '', data = {} }) => {
	logger.info(
		`trigger de pusher realizado, canal: ${channel}  evento: ${event} data: ${JSON.stringify(
			data
		)}`
	);
	return pusher.trigger(channel, event, data, pusherCallback);
};
export default pusher;
