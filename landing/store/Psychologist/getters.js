export default {
	psychologists: state => {
		return state.psychologists.sort(function randOrd() {
			return Math.round(Math.random()) - 0.5;
		});
	},
	resumeView: state => state.resumeView,
};
