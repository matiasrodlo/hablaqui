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

		.readAny('profile')
		.deleteAny('profile')

		.readAny('lodging')
		.createAny('lodging')
		.deleteAny('lodging')
		.updateAny('lodging')

		.readAny('person')
		.createAny('person')
		.deleteAny('person')
		.updateAny('person')

		.readAny('activities')
		.createAny('activities')
		.deleteAny('activities')
		.updateAny('activities')

		.readAny('payments')
		.createAny('payments')
		.deleteAny('payments')
		.updateAny('payments')

		.readAny('periods')
		.createAny('periods')
		.deleteAny('periods')
		.updateAny('periods')

		.readAny('place')
		.createAny('place')
		.deleteAny('place')
		.updateAny('place')

		.readAny('room')
		.createAny('room')
		.deleteAny('room')
		.updateAny('room');
	return accessControl;
};

export default roles();
