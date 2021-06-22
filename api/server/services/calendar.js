import { conflictResponse, okResponse } from '../utils/responses/functions';
import { api_url } from '../config/dotenv';
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const oAuth2Client = new google.auth.OAuth2(
	'1086967845709-nli3fg4d8nsjq34kk96j609ac57q3f2i.apps.googleusercontent.com',
	'Jw1CJ__C-XKfJnmnf7GuVBrn',
	`${api_url}api/v1/calendar/success`
);

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 function authorize(credentials, callback) {
	 const { client_secret, client_id, redirect_uris } = credentials;
	 const oAuth2Client = new google.auth.OAuth2(
		 client_id,
		 client_secret,
		 redirect_uris[0]
		 );
		 
		 getAccessToken(oAuth2Client, callback);
		}
		*/

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 function getAccessToken(oAuth2Client, callback) {
	 const authUrl = oAuth2Client.generateAuthUrl({
		 access_type: 'offline',
		 scope: SCOPES,
		});
		console.log('Authorize this app by visiting this url:', authUrl);
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
		rl.question('Enter the code from that page here: ', code => {
			rl.close();
			oAuth2Client.getToken(code, (err, token) => {
				if (err) return console.error('Error retrieving access token', err);
				oAuth2Client.setCredentials(token);
				// Store the token to disk for later program executions
				callback(oAuth2Client);
			});
		});
	}
	*/
/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 *
 */
function listEvents(auth) {
	const calendar = google.calendar({ version: 'v3', auth });
	calendar.events.list(
		{
			calendarId: 'primary',
			timeMin: new Date().toISOString(),
			maxResults: 10,
			singleEvents: true,
			orderBy: 'startTime',
		},
		(err, res) => {
			if (err) return console.log('The API returned an error: ' + err);
			const events = res.data.items;
			if (events.length) {
				console.log(events.filter(event => event));
				return events.filter(event =>
					event.summary.startsWith('[Hablaqui]')
				);
			} else {
				console.log('No upcoming events found.');
			}
		}
	);
}
const getEvents = token => {
	oAuth2Client.setCredentials(token);
	listEvents(oAuth2Client);
};

function gCreateEvents(auth) {
	const calendar = google.calendar({ version: 'v3', auth });
	calendar.events.insert(
		{
			calendarId: 'primary',
			resource: {
				summary: '[Hablaqui] - Sesion',
				location: '800 Howard St., San Francisco, CA 94103',
				description:
					"A chance to hear more about Google's developer products.",
				start: {
					dateTime: '2021-06-18T09:00:00-07:00',
					timeZone: 'America/Los_Angeles',
				},
				end: {
					dateTime: '2021-06-18T17:00:00-07:00',
					timeZone: 'America/Los_Angeles',
				},
			},
		},
		(err, res) => {
			if (err) return conflictResponse(err);
			return okResponse('Creado con exito');
		}
	);
}

/*
 * @param {google.auth.OAuth2}
 */
const createEvent = token => {
	oAuth2Client.setCredentials(token);
	gCreateEvents(oAuth2Client);
};

const getOauthUrl = () => {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});

	return okResponse('URL generada', { url: authUrl });
};

const getToken = async google_code => {
	const google_token = await oAuth2Client.getToken(
		google_code,
		(err, token) => {
			if (err)
				return conflictResponse('Error retrieving access token', err);
			oAuth2Client.setCredentials(token);
			return token;
		}
	);
	return okResponse('Token generado exitosamente', { google_token });
};

const calendarService = {
	getEvents,
	createEvent,
	getOauthUrl,
	getToken,
};

export default Object.freeze(calendarService);
