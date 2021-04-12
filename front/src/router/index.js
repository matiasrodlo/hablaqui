import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Auth = () => import('@/views/Auth');
const Blog = () => import('@/views/Blog');
const Dashboard = () => import('@/views/Dashboard');
const Experts = () => import('@/views/Experts');
const Faq = () => import('@/views/Faq');
const MyAgenda = () => import('@/views/children/profile/MyAgenda');
const MyDaily = () => import('@/views/children/profile/MyDaily');
const MyProfile = () => import('@/views/children/profile/MyProfile');
const MySpace = () => import('@/views/children/profile/MySpace');
const Privacy = () => import('@/views/Privacy');
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
		path: '/dashboard',
		name: 'dasboard',
		component: Dashboard,
		redirect: { name: 'perfil' },
		children: [
			{
				path: 'perfil',
				name: 'perfil',
				component: MyProfile,
				meta: { title: 'Mi Perfil', layout: 'simple', requiresAuth: true },
			},
			{
				path: 'espacio',
				name: 'espacio',
				component: MySpace,
				meta: { title: 'Mi espacio', layout: 'simple', requiresAuth: true },
			},
			{
				path: 'agenda',
				name: 'agenda',
				component: MyAgenda,
				meta: { title: 'Mi agenda', layout: 'simple', requiresAuth: true },
			},
			{
				path: 'diario',
				name: 'diario',
				component: MyDaily,
				meta: { title: 'Mi diario', layout: 'simple', requiresAuth: true },
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

router.beforeEach(async (to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		const vuex = JSON.parse(localStorage.getItem('vuex'));
		if (vuex && vuex.User.token && vuex.User.user) next();
		else
			next({
				path: '/auth',
				params: { nextUrl: to.fullPath },
			});
	} else {
		next();
	}
});

export default router;
