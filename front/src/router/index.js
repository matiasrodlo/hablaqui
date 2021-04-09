import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Agenda = () => import('@/views/children/profile/Agenda');
const Auth = () => import('@/views/Auth');
const Blog = () => import('@/views/Blog');
const Daily = () => import('@/views/children/profile/Daily');
const Experts = () => import('@/views/Experts');
const Faq = () => import('@/views/Faq');
const Home = () => import('@/views/children/profile/Home');
const Privacy = () => import('@/views/Privacy');
const Profile = () => import('@/views/Profile');
const Psychologist = () => import('@/views/children/psychologist/Psychologist');
const Psychologists = () => import('@/views/children/psychologist/Psychologists');
const Recruitment = () => import('@/views/Recruitment');
const TermsAndConditions = () => import('@/views/TermsAndConditions');
const Test = () => import('@/views/Test');

const routes = [
	{
		path: '/',
		name: 'blog',
		component: Blog,
		meta: { title: 'Blog hablaquí', layout: 'layout', appBarColor: 'transparent' },
	},
	{
		path: '/psicologos',
		redirect: { name: 'all-psicologos' },
		component: Experts,
		children: [
			{
				path: 'todos',
				name: 'psicologos',
				component: Psychologists,
				meta: {
					title: 'Elige a tu psicólogo online',
					layout: 'layout',
					appBarColor: 'transparent',
				},
			},
			{
				path: ':id',
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
		path: '/perfil',
		name: 'perfil',
		component: Profile,
		redirect: { name: 'perfil-home' },
		children: [
			{
				path: 'espacio',
				name: 'perfil-home',
				component: Home,
				meta: { title: 'Mi perfil', layout: 'simple' },
			},
			{
				path: 'agenda',
				name: 'agenda',
				component: Agenda,
				meta: { title: 'Mi agenda', layout: 'simple' },
			},
			{
				path: 'diario',
				name: 'diario',
				component: Daily,
				meta: { title: 'Mi diario', layout: 'simple' },
			},
		],
	},
	{
		path: '/reclutamiento',
		name: 'reclutamiento',
		component: Recruitment,
		meta: { title: 'Reclutamiento', layout: 'layout', appBarColor: 'primary' },
	},
	{
		path: '/faq',
		name: 'faq',
		component: Faq,
		meta: {
			title: 'Bienvenido a nuestro portal de ayuda',
			layout: 'layout',
			appBarColor: 'primary',
		},
	},
	{
		path: '/evaluacion',
		name: 'evaluacion',
		component: Test,
		meta: { title: 'Evaluacion', layout: 'layout', appBarColor: 'primary' },
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
