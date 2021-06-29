import { okResponse } from '../utils/responses/functions';
import { frontend_url } from '../config/dotenv';
import { google } from 'googleapis';
import User from '../models/user';
import moment from 'moment';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const oAuth2Client = new google.auth.OAuth2(
	'1086967845709-nli3fg4d8nsjq34kk96j609ac57q3f2i.apps.googleusercontent.com',
	'Jw1CJ__C-XKfJnmnf7GuVBrn',
	`${frontend_url.split('#')[0]}google-calendar/success`
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

const calendarService = {
	getEvents,
	createEvent,
	getOauthUrl,
	getToken,
};

export default Object.freeze(calendarService);
