import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../../models/user';

/*strategyConfig specified because we need to disable the session use*/
const strategyConfig = {
	usernameField: 'email',
	passwordField: 'password',
	session: false,
};
/*this is our local strategy, the callback is going to find if the user exist and the password is valid*/
/*if we want to finish the callback, we call the done() function*/
/*done(null, user) if the login is valid and done(null, false) if the login is invalid*/
const strategy = new LocalStrategy(strategyConfig, function(
	email,
	password,
	done
) {
	User.findOne({ email: email.toLowerCase() })
		.then(data => {
			if (!data || !bcrypt.compareSync(password, data.password)) {
				return done(null, false);
			}
			return done(null, data);
		})
		.catch(err => done(err));
});

export default strategy;
