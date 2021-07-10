import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../../models/user';
import { logError } from '../../config/winston';

/*strategyConfig specified because we need to disable the session use*/
const strategyConfig = {
	usernameField: 'email',
	passwordField: 'password',
	session: false,
};
const onStrategyError = (err, done) => {
	logError(err);
	return done(null, false);
};
/*this is our local strategy, the callback is going to find if the user exist and the password is valid*/
/*if we want to finish the callback, we call the done() function*/
/*done(null, user) if the login is valid and done(null, false) if the login is invalid*/
const strategy = new LocalStrategy(strategyConfig, async function(email, password, done) {
	try {
		const foundUser = await User.findOne({ email: email.toLowerCase() });
		if (!foundUser) return done(null, false);
		if (!bcrypt.compareSync(password, foundUser.password)) return done(null, false);
		return done(null, foundUser);
	} catch (e) {
		onStrategyError(e, done);
	}
});

export default strategy;
