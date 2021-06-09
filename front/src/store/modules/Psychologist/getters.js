export default {
	psychologists: state => {
		const psy = state.psychologists.sort(function randOrd() {
			return Math.round(Math.random()) - 0.5;
		});
		return psy.map(item => ({
			...item,
			specialties: item.specialties.map(specialties => specialties.toLowerCase()),
		}));
	},
	resumeView: state => state.resumeView,
};
