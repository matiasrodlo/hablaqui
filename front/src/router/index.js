import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// auth view
const Auth = () => import('@/views/Auth');

// Psychologists view
const Faq = () => import('@/views/Faq');
const index = () => import('@/views/Psychologist');
const Privacy = () => import('@/views/Privacy');
const Psychologist = () => import('@/views/children/psychologist/Psychologist');
const Psychologists = () => import('@/views/children/psychologist/Psychologists');
const TermsAndConditions = () => import('@/views/TermsAndConditions');

const routes = [
	{
		path: '/',
		redirect: { name: 'psicologos' },
		component: index,
		children: [
			{
				path: '/psicologos',
				name: 'psicologos',
				component: Psychologists,
				meta: {
					title: 'Psicologos',
					layout: 'layout',
					appBarColor: 'transparent',
				},
			},
			{
				path: '/psicologo/:id',
				name: 'psicologo',
				component: Psychologist,
				meta: {
					title: 'Perfil del psicologo',
					layout: 'layout',
					appBarColor: 'transparent',
				},
			},
		],
	},
	{
		path: '/faq',
		name: 'faq',
		component: Faq,
		meta: { title: 'Preguntas frecuentes', layout: 'layout', appBarColor: 'primary' },
	},
	{
		path: '/terminos-y-condiciones',
		name: 'terminos-y-condiciones',
		component: TermsAndConditions,
		meta: { title: 'Terminos y condiciones', layout: 'layout', appBarColor: 'primary' },
	},
	{
		path: '/privacidad',
		name: 'privacidad',
		component: Privacy,
		meta: { title: 'Políticas de Privacidad', layout: 'layout', appBarColor: 'primary' },
	},
	{
		path: '/auth',
		name: 'auth',
		component: Auth,
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
