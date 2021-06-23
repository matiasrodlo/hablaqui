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
const MyChat = () => import('@/views/children/dashboard/MyChat');
const Payments = () => import('@/views/Payments');
const RegisterPsi = () => import('@/views/RegisterPsi');
const Psychologist = () => import('@/views/children/psychologist/Psychologist');
const Psychologists = () => import('@/views/children/psychologist/Psychologists');
const NewArticle = () => import('@/views/children/blog/NewArticle');
const PasswordReset = () => import('@/views/PasswordReset');

const routes = [
	{
		path: '/',
		redirect: { name: 'all-psicologos' },
	},
	{
		path: '/psicologos',
		name: 'psicologos',
		redirect: { name: 'all-psicologos' },
		component: Experts,
		children: [
			{
				path: 'todos',
				name: 'all-psicologos',
				component: Psychologists,
				meta: {
					title: 'Encuentra a tu psicólogo online',
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
				meta: { title: 'Mi cuenta', requiresAuth: true },
			},
			{
				path: 'chat',
				name: 'chat',
				component: MyChat,
				meta: { title: 'Chat', requiresAuth: true },
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
		meta: { title: 'Evaluacion', requiresAuth: true },
	},
	{
		path: '/pagos',
		name: 'pagos',
		component: Payments,
		children: [
			{
				path: '/pago/pending-pay',
				name: 'pending-pay',
				redirect: { name: 'all-psicologos' },
			},
			{
				path: '/pago/failure-pay',
				name: 'failure-pay',
				redirect: { name: 'all-psicologos' },
			},
		],
	},
	{
		path: '/auth/:q?',
		name: 'auth',
		component: Auth,
		meta: { title: 'Autenticacion' },
	},
	{
		path: '/nuevo-psicologo',
		name: 'nuevo-psicologo',
		component: RegisterPsi,
		meta: { title: 'Nuevo psicologo' },
	},
	{
		path: '/blog/nuevo-articulo',
		name: 'nuevo-articulo',
		component: NewArticle,
		meta: { title: 'Nuevo articulo' },
	},
	{
		path: '/passwordReset',
		name: 'passwordReset',
		component: PasswordReset,
		meta: { title: 'Recuperar contraseña', layout: 'simple' },
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
