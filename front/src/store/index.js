import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import Snackbar from '@/store/modules/Snackbar';
import User from '@/store/modules/User';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: { Snackbar, User },
	plugins: [createPersistedState()],
});
