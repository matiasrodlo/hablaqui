import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// auth view
const Auth = () => import('@/views/Auth');

// Psychologists view
const Blog = () => import('@/views/Blog');
const Experts = () => import('@/views/Experts');
const Faq = () => import('@/views/Faq');
const Privacy = () => import('@/views/Privacy');
const Psychologist = () => import('@/views/children/psychologist/Psychologist');
const Psychologists = () => import('@/views/children/psychologist/Psychologists');
const Recruitment = () => import('@/views/Recruitment');
const TermsAndConditions = () => import('@/views/TermsAndConditions');
const Test = () => import('@/views/Test');

const routes = [
	{
		path: '/',
		redirect: { name: 'psicologos' },
		component: Experts,
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
		path: '/blog',
		name: 'blog',
		component: Blog,
		meta: { title: 'Nuestro Blog', layout: 'layout', appBarColor: 'transparent' },
	},
	{
		path: '/reclutamiento',
		name: 'reclutamiento',
		component: Recruitment,
		meta: { title: 'Reclutamiento', layout: 'layout', appBarColor: 'transparent' },
	},
	{
		path: '/evaluacion',
		name: 'evaluacion',
		component: Test,
		meta: { title: 'Evaluacion', layout: 'layout', appBarColor: 'transparent' },
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
