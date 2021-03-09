import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				primary: '#2070E5',
				secondary: '#54565A',
				info: '#5EB3E4',
			},
			dark: {
				primary: '#2070E5',
				secondary: '#54565A',
				info: '#5EB3E4',
			},
		},
	},
});
