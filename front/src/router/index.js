import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Auth = () => import('@/views/Auth');
const Dashboard = () => import('@/views/Dashboard');
const Evaluation = () => import('@/views/Evaluation');
const Experts = () => import('@/views/Experts');
const MyAgenda = () => import('@/views/children/dashboard/MyAgenda');
const MyDaily = () => import('@/views/children/dashboard/MyDaily');
const MyProfile = () => import('@/views/children/dashboard/MyProfile');
const MySpace = () => import('@/views/children/dashboard/MySpace');
const Payments = () => import('@/views/Payments');
const Psychologist = () => import('@/views/children/psychologist/Psychologist');
const Psychologists = () => import('@/views/children/psychologist/Psychologists');

const routes = [
	{
		path: '/',
		redirect: { name: 'all-psicologos' },
	},
	{
		path: '/psicologos',
		redirect: { name: 'psicologos' },
		component: Experts,
		children: [
			{
				path: 'todos',
				name: 'all-psicologos',
				component: Psychologists,
				meta: {
					title: 'Elige a tu psicólogo online',
				},
			},
			{
				path: ':id',
				name: 'psicologo',
				component: Psychologist,
				meta: {
					title: 'Perfil del psicologo',
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
				meta: { title: 'Mi Perfil', requiresAuth: true },
			},
			{
				path: 'espacio',
				name: 'espacio',
				component: MySpace,
				meta: { title: 'Mi espacio', requiresAuth: true },
			},
			{
				path: 'agenda',
				name: 'agenda',
				component: MyAgenda,
				meta: { title: 'Mi agenda', requiresAuth: true },
			},
			{
				path: 'diario',
				name: 'diario',
				component: MyDaily,
				meta: { title: 'Mi diario', requiresAuth: true },
			},
		],
	},
	{
		path: '/evaluacion',
		name: 'evaluacion',
		component: Evaluation,
		meta: { title: 'Evaluacion' },
	},
	{
		path: '/pagos',
		name: 'pagos',
		component: Payments,
		meta: { title: 'Planes y pagos' },
	},
	{
		path: '/auth/:q?',
		name: 'auth',
		component: Auth,
		meta: { title: 'Autenticacion' },
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
