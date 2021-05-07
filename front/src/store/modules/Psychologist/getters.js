export default {
	psychologists: state => {
		return state.psychologists.map(item => ({
			...item,
			specialties: item.specialties.map(specialties => specialties.toLowerCase()),
		}));
	},
};
