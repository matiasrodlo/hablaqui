/**
 * Hablaquí Landing Page Configuration
 * 
 * This file contains the Nuxt.js configuration for the Hablaquí landing page.
 * It defines the build settings, environment variables, server configuration,
 * and various plugins and modules used in the application.
 * 
 * @module nuxt.config
 * @requires axios
 * @requires ./package.json
 * 
 * @property {Object} publicRuntimeConfig - Runtime configuration accessible on both client and server
 * @property {string} publicRuntimeConfig.VUE_URL - Base URL for the Vue application
 * @property {string} publicRuntimeConfig.API_URL - API endpoint URL
 * @property {string} publicRuntimeConfig.API_ABSOLUTE - Absolute API URL for certain operations
 * 
 * @property {Object} server - Server configuration
 * @property {number} server.port - Development server port
 * @property {string} server.host - Network interface to listen on
 * 
 * @property {Object} generate - Static site generation configuration
 * @property {string} generate.fallback - Fallback page for 404 errors
 * @property {Function} generate.routes - Function to generate dynamic routes
 * 
 * @property {Object} loading - Loading bar configuration
 * @property {string} loading.color - Loading bar color
 * @property {string} loading.height - Loading bar height
 * 
 * @property {Object} head - Global page headers and meta tags
 * @property {string} head.titleTemplate - Template for page titles
 * @property {string} head.title - Default page title
 * @property {Array} head.meta - Meta tags for SEO and social sharing
 * @property {Array} head.link - External resources and links
 */

import axios from 'axios';
import pkg from './package.json';

// Determine if we're in development environment
const isDev = process.env.DEPLOY_ENV === 'DEV';

export default {
	// Target: Static site generation
	target: 'static',

	/**
	 * Runtime configuration accessible on both client and server
	 * These values are available in both client and server-side code
	 */
	publicRuntimeConfig: {
		// Base URL for the Vue application
		VUE_URL:
			process.env.NODE_ENV === 'production'
				? process.env.VUE_APP_LANDING
				: 'http://localhost:9000/',
		
		// API endpoint URL for API requests
		API_URL:
			process.env.NODE_ENV === 'production'
				? process.env.VUE_APP_URL
				: 'http://localhost:3000/api/v1',
		
		// Absolute API URL for certain operations requiring full URL
		API_ABSOLUTE:
			process.env.NODE_ENV === 'production'
				? process.env.API_ABSOLUTE
				: 'http://localhost:3000/',
	},

	/**
	 * Server configuration for development environment
	 * Defines how the development server should run
	 */
	server: {
		port: 9000, // Development server port
		host: '0.0.0.0', // Listen on all network interfaces
	},

	/**
	 * Static site generation configuration
	 * Defines how the static site should be generated
	 */
	generate: {
		fallback: '404.html', // Fallback page for 404 errors
		
		/**
		 * Generate dynamic routes for specialists and locations
		 * This function is called during static site generation
		 * 
		 * @param {Function} callback - Callback function to return generated routes
		 * @returns {Promise<void>}
		 */
		async routes(callback) {
			const baseURL = process.env.VUE_APP_URL
				? process.env.VUE_APP_URL
				: 'http://localhost:3000/api/v1';

			// Execute necessary scripts for data preparation
			await axios.post(`${baseURL}/scripts/add-profesion`);
			await axios.put(`${baseURL}/scripts/change-role`);
			await axios.put(`${baseURL}/scripts/migrate-all`);

			// Fetch and generate routes for specialists
			const res = await axios.get(`${baseURL}/specialists/all`);
			const especialistas = res.data.specialists
				.filter(specialist => specialist.username)
				.map(specialist => ({
					route: `/${specialist.username}`,
					payload: specialist,
				}));

			callback(null, especialistas);
		},
	},

	/**
	 * Loading bar configuration
	 * Defines the appearance of the loading bar during page transitions
	 */
	loading: {
		color: '#2070E5', // Loading bar color
		height: '3px', // Loading bar height
	},

	/**
	 * Global page headers and meta tags
	 * Defines the default meta tags and external resources for all pages
	 */
	head: {
		titleTemplate: '%s',
		title: 'Especialistas online desde $15.500 - Terapia online efectiva',
		meta: [
			// Character encoding
			{ charset: 'utf-8' },
			// Viewport settings for responsive design
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			// Google site verification for search console
			{
				name: 'google-site-verification',
				content: 'i6rcEEmyKQ04k5p5OJTGT3_8uEscgWNKme_lKpunAU4',
			},
			// SEO meta tags for search engines
			{
				name: 'robots',
				content: 'index',
			},
			{
				'http-equiv': 'Content-language',
				content: 'es',
			},
			// Main description for SEO
			{
				hid: 'description',
				name: 'description',
				content:
					'Elige un especialista online especialista para tu caso, e inicia la terapia online sin salir de casa. +350 Especialistas especialistas online. ¡Comienza ahora!',
			},
			// Twitter Card meta tags for social sharing
			{
				hid: 'twitter:card',
				name: 'twitter:card',
				content: 'summary_large_image',
			},
			{ hid: 'twitter:site', name: 'twitter:site', content: 'Hablaquí' },
			{
				hid: 'twitter:url',
				name: 'twitter:url',
				content: process.env.NODE_ENV === 'production'
				? process.env.VUE_APP_LANDING
				: 'http://localhost:9000/',
			},
			{
				hid: 'twitter:title',
				name: 'twitter:title',
				content: 'Especialista y terapia online de calidad sin salir de casa | Hablaquí',
			},
			{
				hid: 'twitter:description',
				name: 'twitter:description',
				content:
					'Encuentra un especialista e inicia terapia online de calidad sin salir de casa. Contamos con especialistas profesionales de todas las especialidades. ¡Comienza ahora!',
			},
			{
				hid: 'twitter:image',
				name: 'twitter:image',
				content: 'https://cdn.hablaqui.cl/static/logo_tiny.png',
			},
			// Open Graph meta tags for social sharing
			{ hid: 'og:site_name', property: 'og:site_name', content: 'Hablaquí' },
			{ hid: 'og:type', property: 'og:type', content: 'website' },
			{
				hid: 'og:url',
				property: 'og:url',
				content: process.env.NODE_ENV === 'production'
				? process.env.VUE_APP_LANDING
				: 'http://localhost:9000/',
			},
			{
				hid: 'og:title',
				property: 'og:title',
				content: 'Especialista y terapia online de calidad sin salir de casa | Hablaquí',
			},
			{
				hid: 'og:description',
				property: 'og:description',
				content:
					'Encuentra un especialista e inicia terapia online de calidad sin salir de casa. Contamos con especialistas profesionales de todas las especialidades. ¡Comienza ahora!',
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
				content: 'Especialista y terapia online de calidad sin salir de casa | Hablaquí',
			},
		],
		// External resources and links
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

	/**
	 * Global CSS files
	 * These styles are applied globally across the application
	 */
	css: [
		'vuetify/dist/vuetify.min.css', // Vuetify styles
		'~/assets/global.scss', // Custom global styles
	],

	// Plugins to run before rendering page
	plugins: [
		'~/plugins/jsonld', // JSON-LD structured data
		'~/plugins/interceptor', // Axios interceptors
	],

	// Auto import components
	components: true,

	// Modules for dev and build
	buildModules: [
		'@nuxtjs/vuetify', // Vuetify integration
		'@nuxtjs/eslint-module', // ESLint integration
		'@nuxtjs/google-analytics', // Google Analytics integration
	],

	// Socket.io configuration
	io: {
		sockets: [
			{
				name: 'main',
				url: process.env.NODE_ENV === 'production'
					? process.env.VUE_APP_URL
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
	// build: {
	// 	/*
	// 	 ** Analyze build files
	// 	 */
	// 	analyze: isDev,
	// 	/*
	// 	 ** public patch
	// 	 */
	// 	publicPath: process.env.NODE_ENV === 'production'
	// 			? process.env.VUE_APP_LANDING
	// 			: 'http://localhost:9000/',
	// 	filenames: process.env.VUE_APP_LANDING
	// 		? {
	// 				img: ({ isDev }) =>
	// 					isDev
	// 						? '[path][name].[ext]?v=' + pkg.version
	// 						: 'img/[name].[contenthash:7].[ext]?v=' + pkg.version,
	// 				app: ({ isDev, isModern }) =>
	// 					isDev
	// 						? `[name]${isModern ? '.modern' : ''}.js?v=` + pkg.version
	// 						: `[contenthash:7]${isModern ? '.modern' : ''}.js?v=` + pkg.version,
	// 				chunk: ({ isDev, isModern }) =>
	// 					isDev
	// 						? `[name]${isModern ? '.modern' : ''}.js?v=` + pkg.version
	// 						: `[contenthash:7]${isModern ? '.modern' : ''}.js?v=` + pkg.version,
	// 				css: ({ isDev }) =>
	// 					isDev
	// 						? '[name].css?v=' + pkg.version
	// 						: 'css/[contenthash:7].css?v=' + pkg.version,
	// 				font: ({ isDev }) =>
	// 					isDev
	// 						? '[path][name].[ext]?v=' + pkg.version
	// 						: 'fonts/[name].[contenthash:7].[ext]?v=' + pkg.version,
	// 				video: ({ isDev }) =>
	// 					isDev
	// 						? '[path][name].[ext]?v=' + pkg.version
	// 						: 'videos/[name].[contenthash:7].[ext]?v=' + pkg.version,
	// 		  }
	// 		: {},
	// },
};
