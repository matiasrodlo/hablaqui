import { cloneDeep } from 'lodash';

export default {
	psychologists: state => {
		const psy = cloneDeep(state.psychologists);
		return psy.sort(function randOrd() {
			return Math.round(Math.random()) - 0.5;
		});
	},
	resumeView: state => state.resumeView,
};
