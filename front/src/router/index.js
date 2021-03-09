import Vue from 'vue';
import VueRouter from 'vue-router';
import Specialists from '../views/Specialists.vue';
import Prueba from '../views/Prueba.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		name: 'especialistas',
		component: Specialists,
		meta: { title: 'Nuestros especialistas', layout: 'layout' },
	},
	{
		path: '/test',
		name: 'prueba',
		component: Prueba,
		meta: { title: 'Prueba', layout: 'layout' },
	},
	{
		path: '*',
		name: 'Error',
		component: require('@/views/404').default, // load sync
		meta: { title: '404', layout: 'simple' },
	},
];

const router = new VueRouter({
	routes,
	scrollBehavior() {
		return { x: 0, y: 0 };
	},
});

export default router;
