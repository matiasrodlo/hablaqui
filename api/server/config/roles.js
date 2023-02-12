import AccessControl from 'accesscontrol';
const accessControl = new AccessControl();

const roles = () => {
	accessControl
		.grant('person')

		.readOwn('profile')
		.updateOwn('profile')

		.createOwn('person')
		.readOwn('person')
		.updateOwn('person')

		.readAny('lodging');

	accessControl
		.grant('admin')
		.extend('person')

		.readAny('specialists')
		.createAny('specialists')
		.deleteAny('specialists')
		.updateAny('specialists')

		.readAny('appointments')
		.createAny('appointments')
		.deleteAny('appointments')
		.updateAny('appointments')

		.readAny('users')
		.createAny('users')
		.deleteAny('users')
		.updateAny('users');

	return accessControl;
};

export default roles();
