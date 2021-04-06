import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import Snackbar from '@/store/modules/Snackbar';
import Psychologist from '@/store/modules/Psychologist';
import User from '@/store/modules/User';

Vue.use(Vuex);

const dataPerssist = createPersistedState({
	paths: ['User'],
});

export default new Vuex.Store({
	modules: { Snackbar, User, Psychologist },
	plugins: [dataPerssist],
});
