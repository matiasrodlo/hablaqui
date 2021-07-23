import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
const mongoose = require('mongoose');
const { Model, Schema } = mongoose;

let planSchema = new Schema(
	{
		title: {
			type: String,
		},
		period: {
			type: String,
		},
		psychologist: {
			type: Schema.Types.ObjectId,
			ref: 'psychologist',
		},
		price: {
			type: Number,
		},
		sessionPrice: {
			type: Number,
		},
		paymentStatus: {
			type: String,
			default: 'pending',
		},
		expiration: {
			type: String,
		},
		invitedByPsychologist: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

let userSchema = new Schema({
	name: {
		type: String,
	},
	lastName: {
		type: String,
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
	inviteCode: {
		type: String,
	},
	googleId: {
		type: String,
	},
	phone: {
		type: String,
		trim: true,
		required: false,
	},
	timeZone: {
		type: String,
		required: false,
	},
	state: {
		type: Boolean,
		default: true,
	},
	avatar: {
		type: String,
		require: false,
	},
	google: {
		type: Boolean,
		default: false,
	},
	plan: [planSchema],
	finishedSessions: {
		type: Array,
		required: false,
	},
	psychologist: {
		type: Schema.Types.ObjectId,
		ref: 'psychologist',
		required: false,
	},
	role: {
		type: String,
		default: 'user',
		enum: ['user', 'psychologist', 'superuser'],
	},
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
