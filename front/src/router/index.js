import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// views
const index = () => import('@/views/children/specialists/index.vue');
const List = () => import('@/views/children/specialists/List.vue');
const Specialist = () => import('@/views/children/specialists/Specialist.vue');

const routes = [
	{
		path: '/',
		redirect: { name: 'psicologos' },
		name: 'home',
		component: index,
		meta: { title: 'Nuestros psicologos', layout: 'layout' },
		children: [
			{
				path: '/psicologos',
				name: 'psicologos',
				component: List,
				meta: {
					title: 'Psicologos',
					layout: 'layout',
				},
			},
			{
				path: '/psicologo/:id',
				name: 'psicologo',
				component: Specialist,
				meta: {
					title: 'Perfil del psicologo',
					layout: 'layout',
				},
			},
		],
	},
	{
		path: '/autenticacion',
		name: 'autenticacion',
		component: index,
		meta: { title: 'Autenticacion', layout: 'simple' },
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
