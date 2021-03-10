import Vue from 'vue';
import VueRouter from 'vue-router';
import index from '@/views/children/specialists/index.vue';
import List from '@/views/children/specialists/List.vue';
import Specialist from '@/views/children/specialists/Specialist.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: '/',
		redirect: { name: 'especialistas' },
		name: 'home',
		component: index,
		meta: { title: 'Nuestros especialistas', layout: 'layout' },
		children: [
			{
				path: '/especialistas',
				name: 'especialistas',
				component: List,
				meta: {
					title: 'Especialistas',
					layout: 'layout',
				},
			},
			{
				path: '/especialista/:id',
				name: 'especialista',
				component: Specialist,
				meta: {
					title: 'Perfil del especialista',
					layout: 'layout',
				},
			},
		],
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
