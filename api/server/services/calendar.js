import { okResponse } from '../utils/responses/functions';
import {
	google_client_id,
	google_client_secret,
	google_client_redirect,
} from '../config/dotenv';
import { google } from 'googleapis';
import User from '../models/user';
import Psychologist from '../models/psychologist';
import moment from 'moment';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const oAuth2Client = new google.auth.OAuth2(
	google_client_id,
	google_client_secret,
	google_client_redirect
);

const getEvents = async token => {
	oAuth2Client.setCredentials(token);
	const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
	const events = await calendar.events.list({
		calendarId: 'primary',
		timeMin: new Date().toISOString(),
		maxResults: 10,
		singleEvents: true,
		orderBy: 'startTime',
	});
	return okResponse('Eventos conseguidos', { events: events.data.items });
};

/*
 * @param {google.auth.OAuth2}
 */
const createEvent = (token, payload) => {
	oAuth2Client.setCredentials(token);
	const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
	calendar.events.insert({
		calendarId: 'primary',
		resource: {
			summary: '[Hablaqui] - Sesion',
			location: 'http://hablaqui.cl',
			description: `Sesión con ${payload.psychologist}`,
			start: {
				dateTime: moment(payload.date),
				timeZone: 'America/Santiago',
			},
			end: {
				dateTime: moment(payload.date).add(45, 'm'),
				timeZone: 'America/Santiago',
			},
			reminders: {
				useDefault: false,
				overrides: [
					{ method: 'email', minutes: 24 * 60 },
					{ method: 'popup', minutes: 10 },
				],
			},
		},
	});
	return okResponse('Evento creado con exito');
};

const getOauthUrl = () => {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});

	return okResponse('URL generada', { url: authUrl });
};

const getToken = async (user, google_code) => {
	const { tokens } = await oAuth2Client.getToken(google_code);
	await User.findByIdAndUpdate(user._id, {
		googleCalendar: tokens,
	});

	return okResponse('Token generado exitosamente', {
		token: tokens,
	});
};

const busyEvents = async token => {
	oAuth2Client.setCredentials(token);
	const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
	let events = await calendar.events.list({
		calendarId: 'primary',
		timeMin: new Date().toISOString(),
		maxResults: 10,
		singleEvents: true,
		orderBy: 'startTime',
	});
	events = events.data.items.filter(
		event => !event.summary.startsWith('[Hablaquí]')
	);

	return events;
};

const addSession = async (_id, session) => {
	const foundPsychologist = await Psychologist.findById(_id);
	let validator = true;
	foundPsychologist.sessions.forEach(async item => {
		if (moment(item.date).isSame(session.date)) {
			validator = false;
		}
	});
	if (validator) {
		await Psychologist.updateOne(
			{ _id },
			{
				$push: {
					sessions: session,
				},
			}
		);
	}
};

const checkBusyTask = async () => {
	const psychologists = await User.find({ email: 'pruebadiego@gmail.com' });
	psychologists.forEach(async psychologist => {
		if (psychologist.googleCalendar) {
			const events = await busyEvents(psychologist.googleCalendar);
			if (events.length > 0) {
				events.forEach(async event => {
					let session = {
						date: event.start.dateTime,
						typeSession: 'personal',
					};
					await addSession(psychologist.psychologist, session);
				});
			}
		}
	});

	return okResponse('Horarios actualizados');
};

const calendarService = {
	getEvents,
	createEvent,
	getOauthUrl,
	getToken,
	checkBusyTask,
};

export default Object.freeze(calendarService);
