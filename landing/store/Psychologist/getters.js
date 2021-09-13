import { cloneDeep } from 'lodash';

export default {
	psychologists: state => {
		const psy = cloneDeep(state.psychologists);
		return psy.sort(function randOrd() {
			return Math.round(Math.random()) - 0.5;
		});
	},
	sessions: state => state.sessions,
	sessionsFormatted: state => state.sessionsFormatted,
	clients: state => state.clients,
	resumeView: state => state.resumeView,
};
