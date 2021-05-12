export default {
	// specialties formateadas
	appointments: state => state.appointments.map(item => item.toLowerCase().trim()),
	// specialties sin formatear
	specialties: state => state.appointments,
};
