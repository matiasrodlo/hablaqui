import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import Default from './layouts/default.vue';
import Simple from './layouts/simple.vue';

Vue.config.productionTip = false;

Vue.component('layout', Default);
Vue.component('simple', Simple);

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App),
}).$mount('#app');
