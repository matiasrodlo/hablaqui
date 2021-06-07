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
	},
	server: {
		port: process.env.FRONTEND_URL ? 8080 : 9000, // default: 3000
	},
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		titleTemplate: '%s',
		title: 'Psicología online | Hablaquí',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
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
					'Encuentra un psicólogo online y cuida tu salud emocional sin salir de casa. Contamos con terapeutas y entrenadores de todas las especialidades. ¡Empezar ahora!',
			},
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: ['vuetify/dist/vuetify.min.css', '~/assets/global.scss'],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [],

	// google tagManager
	gtm: {
		id: 'G-BNF1BXZGS4', // Used as fallback if no runtime config is provided
	},

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/eslint
		'@nuxtjs/eslint-module',
		// https://go.nuxtjs.dev/vuetify
		'@nuxtjs/vuetify',
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		[
			'@netsells/nuxt-hotjar',
			{
				id: '2428019',
				sv: '6',
			},
		],
		// https://go.nuxtjs.dev/axios
		'@nuxtjs/axios',
	],

	// Axios module configuration: https://go.nuxtjs.dev/config-axios
	axios: {},

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
		},
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		publicPath: process.env.VUE_APP_LANDING,
	},
};
