import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'especialistas',
		component: Home,
		meta: { title: 'Nuestros especialistas' },
	},
	{
		path: '*',
		name: 'Error',
		component: require('@/views/404').default, // load sync
		meta: { title: '404' },
	},
];

const router = new VueRouter({
	routes,
	scrollBehavior() {
		return { x: 0, y: 0 };
	},
});

export default router;
