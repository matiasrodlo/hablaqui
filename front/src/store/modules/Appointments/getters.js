export default {
	appointments: state => state.appointments.map(item => item.toLowerCase().trim()),
};
