import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import Snackbar from '@/store/modules/Snackbar';
import Psychologist from '@/store/modules/Psychologist';
import Appointments from '@/store/modules/Appointments';
import User from '@/store/modules/User';
import Blog from '@/store/modules/Blog';
import Calendar from '@/store/modules/Calendar';
import Chat from '@/store/modules/Chat';

Vue.use(Vuex);

const dataPerssist = createPersistedState({
	paths: ['User', 'Psychologist', 'Chat'],
});

export default new Vuex.Store({
	modules: { Appointments, Blog, Chat, Psychologist, Snackbar, User, Calendar },
	plugins: [dataPerssist],
});
