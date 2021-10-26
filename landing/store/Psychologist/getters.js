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
	clients: state => {
		const clients = [...state.clients];
		return clients.sort((a, b) => {
			const fa = a.name.toLowerCase();
			const fb = b.name.toLowerCase();

			if (fa < fb) {
				return -1;
			}
			if (fa > fb) {
				return 1;
			}
			return 0;
		});
	},
	resumeView: state => state.resumeView,
};
