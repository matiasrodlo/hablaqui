import axios from 'axios';
import pkg from './package.json';

const isDev = process.env.DEPLOY_ENV === 'DEV';

export default {
	target: 'static',
	publicRuntimeConfig: {
		LANDING_URL:
			process.env.NODE_ENV === 'production'
				? process.env.VUE_APP_LANDING
				: 'http://localhost:9000/',
		FRONTEND_URL:
			process.env.NODE_ENV === 'production'
				? process.env.FRONTEND_URL
				: 'http://localhost:8080/#',
		API_URL:
			process.env.NODE_ENV === 'production'
				? process.env.VUE_APP_URL
				: 'http://localhost:3000/api/v1',
		API_ABSOLUTE:
			process.env.NODE_ENV === 'production'
				? process.env.API_ABSOLUTE
				: 'http://localhost:3000/',
	},
	server: {
		port: process.env.FRONTEND_URL ? 8080 : 9000, // default: 3000
		host: '0.0.0.0',
	},
	generate: {
		fallback: '404.html',
		// genera las rutas dinamicas
		async routes(callback) {
			const baseURL = process.env.VUE_APP_URL
				? process.env.VUE_APP_URL
				: 'http://localhost:3000/api/v1';
			// const baseApi = process.env.API_ABSOLUTE
			// 	? process.env.API_ABSOLUTE
			// 	: 'http://localhost:3000/';

			// generate routes especialistas
			// Se ejecutan scripts para agregar profesion y cambiar rol
			await axios.put(`${baseURL}/scripts/remove-profesion`);
			await axios.delete(`${baseURL}/scripts/remove-rol`);
			await axios.put(`${baseURL}/scripts/step-back`);
			// await axios.post(`${baseURL}/scripts/remove-rol`);
			// await axios.post(`${baseURL}/scripts/remove-profesion`);

			const res = await axios.get(`${baseURL}/specialists/all`);
			const especialistas = res.data.specialists
				.filter(specialist => specialist.username)
				.map(specialist => ({
					route: `/${specialist.username}`,
					payload: specialist,
				}));
			// generate routes comunas
			/* const response = await axios.get(`${baseApi}/comunas.json`);
			const comunas = response.data.map(el => ({
				route: `/especialistas/${el.comuna.slug}`,
				payload: el.comuna,
			}));

			const routes = especialistas.concat(comunas); */
			callback(null, especialistas);
		},
	},
	loading: {
		color: '#2070E5',
		height: '3px',
	},
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		titleTemplate: '%s',
		title: 'Psicólogos online desde $15.500 - Terapia online efectiva',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{
				name: 'google-site-verification',
				content: 'i6rcEEmyKQ04k5p5OJTGT3_8uEscgWNKme_lKpunAU4',
			},
			{
				name: 'robots',
				content: 'index',
			},
			{
				'http-equiv': 'Content-language',
				content: 'es',
			},
			{
				hid: 'description',
				name: 'description',
				content:
					'Elige un psicólogo online especialista para tu caso, e inicia la terapia online sin salir de casa. +350 Psicólogos especialistas online. ¡Comienza ahora!',
			},
			{
				hid: 'twitter:card',
				name: 'twitter:card',
				content: 'summary_large_image',
			},
			{ hid: 'twitter:site', name: 'twitter:site', content: 'Hablaquí' },
			{
				hid: 'twitter:url',
				name: 'twitter:url',
				content: process.env.VUE_APP_LANDING,
			},
			{
				hid: 'twitter:title',
				name: 'twitter:title',
				content: 'Psicólogo y terapia online de calidad sin salir de casa | Hablaquí',
			},
			{
				hid: 'twitter:description',
				name: 'twitter:description',
				content:
					'Encuentra un psicólogo e inicia terapia online de calidad sin salir de casa. Contamos con psicólogos profesionales de todas las especialidades. ¡Comienza ahora!',
			},
			{
				hid: 'twitter:image',
				name: 'twitter:image',
				content: 'https://cdn.hablaqui.cl/static/logo_tiny.png',
			},

			// Open Graph
			// Test on: https://developers.facebook.com/tools/debug/
			{ hid: 'og:site_name', property: 'og:site_name', content: 'Hablaquí' },
			{ hid: 'og:type', property: 'og:type', content: 'website' },
			{
				hid: 'og:url',
				property: 'og:url',
				content: process.env.VUE_APP_LANDING,
			},
			{
				hid: 'og:title',
				property: 'og:title',
				content: 'Psicólogo y terapia online de calidad sin salir de casa | Hablaquí',
			},
			{
				hid: 'og:description',
				property: 'og:description',
				content:
					'Encuentra un psicólogo e inicia terapia online de calidad sin salir de casa. Contamos con psicólogos profesionales de todas las especialidades. ¡Comienza ahora!',
			},
			{
				hid: 'og:image',
				property: 'og:image',
				content: 'https://cdn.hablaqui.cl/static/logo_tiny.png',
			},
			{
				hid: 'og:image:secure_url',
				property: 'og:image:secure_url',
				content: 'https://cdn.hablaqui.cl/static/logo_tiny.png',
			},
			{
				hid: 'og:image:alt',
				property: 'og:image:alt',
				content: 'Psicólogo y terapia online de calidad sin salir de casa | Hablaquí',
			},
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{ rel: 'preconnect', href: 'https://fonts.gstatic.com' },
			{
				rel: 'preload',
				as: 'style',
				href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap',
			},
			{
				rel: 'stylesheet',
				href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap',
			},
		],
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: ['vuetify/dist/vuetify.min.css', '~/assets/global.scss'],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: ['~/plugins/jsonld', '~/plugins/interceptor'],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/vuetify
		'@nuxtjs/vuetify',
		// https://go.nuxtjs.dev/eslint
		'@nuxtjs/eslint-module',
		// https://github.com/Developmint/nuxt-purgecss
		// 'nuxt-purgecss',
		'@nuxtjs/google-analytics',
	],

	io: {
		// module options
		sockets: [
			{
				name: 'main',
				url:
					process.env.NODE_ENV === 'production'
						? process.env.API_ABSOLUTE
						: 'http://localhost:3000',
			},
		],
	},

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/axios
		'@nuxtjs/axios',
		'@nuxtjs/auth-next',
		'@nuxtjs/sitemap',
		'nuxt-socket-io',
		[
			'@netsells/nuxt-hotjar',
			{
				id: '2428019',
				sv: '6',
			},
		],
		// '@nuxtjs/google-analytics',
		// [
		// 	'@nuxtjs/google-gtag',
		// 	{
		// 		id: 'UA-206733202-1',
		// 	},
		// ],
		'@dansmaculotte/nuxt-segment',
		'@nuxtjs/gtm',
	],

	gtm: {
		id: 'GTM-KTHDRHV',
		enabled: true,
		autoInit: true,
		respectDoNotTrack: true,

		layer: 'dataLayer',
		variables: {},

		pageTracking: true,
		pageViewEventName: 'nuxtRoute',

		scriptId: 'gtm-script',
		scriptDefer: false,
		scriptURL: 'https://www.googletagmanager.com/gtm.js',
		crossOrigin: false,

		noscript: true,
		noscriptId: 'gtm-noscript',
		noscriptURL: 'https://www.googletagmanager.com/ns.html',
	},

	segment: {
		writeKey: 'cfhCuLuHi3QH8paFuAqbs3fvc7X2gqh5',
		disabled: false,
		userRouter: true,
	},

	// 'google-gtag': {
	// 	id: 'UA-206733202-1',
	// 	config: {
	// 		anonimize_ip: true,
	// 		linker: {
	// 			domains: ['hablaqui.cl', 'www.hablaqui.cl'],
	// 		},
	// 	},
	// },
	// googleAnalytics: {
	// 	id: 'UA-206733202-1',
	// 	autoTracking: {
	// 		screenview: true,
	// 	},
	// },

	// Axios module configuration: https://go.nuxtjs.dev/config-axios
	axios: {
		baseUrl: process.env.VUE_APP_URL ? process.env.VUE_APP_URL : 'http://localhost:3000/api/v1',
	},

	sitemap: {
		hostname: process.env.VUE_APP_LANDING
			? process.env.VUE_APP_LANDING
			: 'http://localhost:9000/',
		gzip: true,
		exclude: ['/dashboard/**', '/nuevo-especialista'],
		trailingSlash: true,
	},

	auth: {
		localStorage: {
			// prefijo auth example auth._token
			prefix: 'auth.',
		},
		redirect: {
			// ruta a la que se redirecciona desde una ruta privada
			login: '/auth',
			// ruta a la que vamos cuando cerramos sesion
			logout: false,
			// ruta a la que nos redirige al logearnos
			home: false,
		},
		strategies: {
			// login with api
			local: {
				user: {
					autoFetch: false,
				},
				// token config
				token: {
					property: 'token',
					global: true,
					required: true,
					type: 'Bearer',
				},
				endpoints: {
					// login endpoint
					login: { url: '/auth/login', method: 'post' },
					// logout endpoint
					logout: false,
					// logout: { url: '/auth/logout', method: 'post' },
					// get user endpoint
					user: { url: '/user/profile', method: 'get' },
				},
			},
		},
	},

	// Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
	vuetify: {
		customVariables: ['~/assets/variables.scss'],
		breakpoint: {
			scrollBarWidth: 24,
		},
		theme: {
			themes: {
				light: {
					primary: '#2070E5',
					secondary: '#54565A',
					info: '#5EB3E4',
				},
				dark: {
					primary: '#2070E5',
					secondary: '#54565A',
					info: '#5EB3E4',
				},
			},
		},
		defaultAssets: {
			font: false,
			icons: 'mdiSvg',
		},
		treeShake: true,
	},
	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		/*
		 ** Analyze build files
		 */
		analyze: isDev,
		/*
		 ** public patch
		 */
		publicPath: process.env.VUE_APP_LANDING,
		filenames: process.env.VUE_APP_LANDING
			? {
					img: ({ isDev }) =>
						isDev
							? '[path][name].[ext]?v=' + pkg.version
							: 'img/[name].[contenthash:7].[ext]?v=' + pkg.version,
					app: ({ isDev, isModern }) =>
						isDev
							? `[name]${isModern ? '.modern' : ''}.js?v=` + pkg.version
							: `[contenthash:7]${isModern ? '.modern' : ''}.js?v=` + pkg.version,
					chunk: ({ isDev, isModern }) =>
						isDev
							? `[name]${isModern ? '.modern' : ''}.js?v=` + pkg.version
							: `[contenthash:7]${isModern ? '.modern' : ''}.js?v=` + pkg.version,
					css: ({ isDev }) =>
						isDev
							? '[name].css?v=' + pkg.version
							: 'css/[contenthash:7].css?v=' + pkg.version,
					font: ({ isDev }) =>
						isDev
							? '[path][name].[ext]?v=' + pkg.version
							: 'fonts/[name].[contenthash:7].[ext]?v=' + pkg.version,
					video: ({ isDev }) =>
						isDev
							? '[path][name].[ext]?v=' + pkg.version
							: 'videos/[name].[contenthash:7].[ext]?v=' + pkg.version,
			  }
			: {},
	},
};
