import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
const mongoose = require('mongoose');
const { Model, Schema } = mongoose;

let userSharingSchema = new Schema({
	email: {
		type: String,
	},
});

const userNotifications = new Schema({
	_id: { type: String },
	date: { type: Date },
	// NOTA:
	// Al cambiar el valor de state actualizar el store front/src/store/modules/lodging/state
	// 0 initial state
	// 1 accepted
	// 2 denied
	// 3 pending
	// 4 registered
	// 5
	state: { type: Number, default: 0 },
	retryCount: { type: Number, default: 0 },
	//sms
	//gps
	//previous_day
	type: { type: String },
});

let userSchema = new Schema({
	name: {
		type: String,
		lowercase: true,
		trim: true,
	},
	email: {
		type: String,
		lowercase: true,
		trim: true,
		unique: true,
	},
	password: {
		type: String,
	},
	lastName: {
		type: String,
		lowercase: true,
		trim: true,
		default: '',
	},
	googleId: {
		type: String,
	},
	phone: {
		type: String,
		trim: true,
	},
	img: {
		type: String,
		required: false,
	},
	state: {
		type: Boolean,
		default: true,
	},
	google: {
		type: Boolean,
		default: false,
	},
	analyst: {
		type: Boolean,
		default: false,
	},
	role: {
		type: String,
		default: 'admin',
		enum: ['person', 'admin', 'superUser'],
	},
	company: {
		type: String,
		default: '',
	},
	idPerson: {
		type: String,
		required: false,
	},
	adminNotifyTime: {
		type: String,
		default: '19:00',
	},
	notifications: [userNotifications],
	sharingWithUsers: [userSharingSchema],
	sharingWithMe: [userSharingSchema],
	numberWorkOrders: { type: Array },
	workOrdersName: { type: Array },
});

userSchema.methods.toJSON = function() {
	let user = this;
	let userObject = user.toObject();
	delete userObject.password;

	return userObject;
};

userSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

class User extends Model {
	/**
	 *  Used in register user from geolocation and covert user person
	 * @param {Object} personData data person
	 */
	static async createOneWithPersonData(personData) {
		const password = personData.password
			? personData.password
			: personData.email;
		const newUser = new User({
			name: personData.firstName,
			lastName: personData.lastName,
			email: personData.email.toLowerCase(),
			img: personData.avatar,
			analyst: false,
			role: 'person',
			password: bcrypt.hashSync(password, 10),
			idPerson: personData._id,
		});
		return await newUser.save();
	}
	static async createOneWithGoogleData(profile, googleEmail, randomPassword) {
		const newUser = new User({
			name: profile.name.givenName,
			lastName: profile.name.familyName,
			email: googleEmail,
			img: profile.photos[0].value,
			analyst: false,
			googleId: profile.id,
			password: bcrypt.hashSync(randomPassword, 10),
		});
		return await newUser.save();
	}
	static async updateOneWithGoogleData(user, profile) {
		user.img = profile.photos[0].value;
		user.googleId = profile.id;
		return await user.save();
	}
	static async findOneWIthGoogleEmail(email) {
		return this.findOne({ email: email });
	}
	static async findOneWithGoogleId(googleId) {
		return this.findOne({ googleId: googleId });
	}
	static async removeUserFromSharingUsers(user, invitedUserEmail) {
		const foundInvitedUser = user.sharingWithUsers.find(
			f => f.email === invitedUserEmail
		);
		user.sharingWithUsers.id(foundInvitedUser._id).remove();
		await user.save();
	}
	static async pushSharingWithUsers(ownerUser, invitedUserEmail) {
		ownerUser.sharingWithUsers.push({ email: invitedUserEmail });
		await ownerUser.save();
	}
	static async pushSharingWithMe(invitedUser, ownerUserEmail) {
		invitedUser.sharingWithMe.push({ email: ownerUserEmail });
		await invitedUser.save();
	}
	static async findOneByEmail(email) {
		return this.findOne({ email: email.toLowerCase() });
	}
	static async findOneByPersonId(personId) {
		return this.findOne({ idPerson: personId });
	}
}
export default mongoose.model(User, userSchema, 'users');
