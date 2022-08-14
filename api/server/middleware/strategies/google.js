import { logError } from '../../config/pino';
import User from '../../models/user';
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
const strategy = new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: process.env.GOOGLE_STRATEGY_CALLBACK,
	},
	async function(accessToken, refreshToken, profile, done) {
		/*Si algun error ocurre con mongoose, necesitamos retornar un done y ademas hacer log del error*/
		const onStrategyError = (err, done) => {
			logError(err);
			return done(null, false);
		};

		const googleEmail = profile.emails[0].value;

		const createOneUser = async profile => {
			const newUser = new User({
				name: profile.name.givenName,
				lastName: profile.name.familyName,
				email: googleEmail,
				img: profile.photos[0].value,
				analyst: false,
				googleId: profile.id,
			});
			return await newUser.save();
		};

		const updateOneUser = async (user, profile) => {
			user.img = profile.photos[0].value;
			user.googleId = profile.id;
			return await user.save();
		};

		const findOneWIthGoogleEmail = async email => {
			return User.findOne({ email: email });
		};

		const findOneWithGoogleId = async googleId => {
			return User.findOne({ googleId: googleId });
		};
		//Importante. Es posible que el correo exista en la db entonces nosotros buscamos si existe
		//en caso de encontrar un usuario, actualizamos sus datos y añadimos la id de google profile
		const userFromEmail = await findOneWIthGoogleEmail(
			googleEmail
		).catch(err => onStrategyError(err, done));
		if (userFromEmail) {
			try {
				const updatedUser = await updateOneUser(userFromEmail, profile);
				return done(null, updatedUser);
			} catch (e) {
				logError(e);
				return done(null, false);
			}
		} else {
			try {
				const userFromId = await findOneWithGoogleId(profile.id);
				if (userFromId) {
					const updatedUser = await updateOneUser(
						userFromId,
						profile
					);
					return done(null, updatedUser);
				} else {
					const newUser = await createOneUser(profile);
					return done(null, newUser);
				}
			} catch (e) {
				return onStrategyError(e, done);
			}
		}
	}
);

export default strategy;
