import axios from 'axios';

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
		PUSHER_KEY: process.env.VUE_APP_PUSHER_KEY || 'f7e1381e2482c3db4a61',
		PUSHER_CLUSTER: process.env.VUE_APP_PUSHER_CLUSTER || 'us2',
	},
	server: {
		port: process.env.FRONTEND_URL ? 8080 : 9000, // default: 3000
	},
	generate: {
		fallback: '404.html',
		// genera las rutas dinamicas
		async routes() {
			const baseURL = process.env.VUE_APP_URL
				? process.env.VUE_APP_URL
				: 'http://localhost:3000/api/v1';
			const baseApi = process.env.API_ABSOLUTE
				? process.env.API_ABSOLUTE
				: 'http://localhost:3000/';

			// generate routes blogs
			const { data } = await axios.get(`${baseURL}/blog/all`);
			const blogs = data.articles.map(item => ({
				route: `/blog/${item.slug}`,
				payload: item,
			}));

			// generate routes psicologos
			const res = await axios.get(`${baseURL}/psychologists/all`);
			const psicologos = res.data.psychologists.map(psychologist => ({
				route: `/${psychologist.username}`,
				payload: psychologist,
			}));

			// generate routes comunas
			const response = await axios.get(`${baseApi}/comunas.json`);
			const comunas = response.data.map(el => ({
				route: `/psicologos/${el.comuna.slug}`,
				payload: el.comuna,
			}));

			return blogs.concat(psicologos).concat(comunas);
		},
	},
	loading: {
		color: '#2070E5',
		height: '3px',
	},
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		titleTemplate: '%s',
		title: 'Psicología online | Hablaquí',
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
					'Encuentra un psicólogo online y cuida tu salud emocional sin salir de casa. Contamos con terapeutas y entrenadores de todas las especialidades. ¡Empezar ahora!',
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
				content: process.env.VUE_APP_LANDING + '/logo_tiny.png',
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
				content: process.env.VUE_APP_LANDING + '/logo_tiny.png',
			},
			{
				hid: 'og:image:secure_url',
				property: 'og:image:secure_url',
				content: process.env.VUE_APP_LANDING + '/logo_tiny.png',
			},
			{
				hid: 'og:image:alt',
				property: 'og:image:alt',
				content: 'Psicólogo y terapia online de calidad sin salir de casa | Hablaquí',
			},
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [
		'vuetify/dist/vuetify.min.css',
		'~/assets/global.scss',
		'@mdi/font/css/materialdesignicons.min.css',
	],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: ['~/plugins/jsonld'],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://google-fonts.nuxtjs.org
		'@nuxtjs/google-fonts',
		// https://go.nuxtjs.dev/vuetify
		['@nuxtjs/vuetify', { iconfont: 'mdi' }],
		// https://go.nuxtjs.dev/eslint
		'@nuxtjs/eslint-module',
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
		[
			'@nuxtjs/google-gtag',
			{
				id: 'UA-185893751-1',
			},
		],
		// https://go.nuxtjs.dev/axios
		'@nuxtjs/axios',
		'@nuxtjs/auth-next',
		'@nuxtjs/sitemap',
	],

	// Axios module configuration: https://go.nuxtjs.dev/config-axios
	axios: {
		baseUrl: process.env.VUE_APP_URL ? process.env.VUE_APP_URL : 'http://localhost:3000/api/v1',
	},

	sitemap: {
		hostname: process.env.VUE_APP_LANDING
			? process.env.VUE_APP_LANDING
			: 'http://localhost:9000/',
		exclude: ['/dashboard/**', '/nuevo-psicologo'],
		trailingSlash: true,
	},

	googleFonts: {
		display: 'swap',
		families: {
			Roboto: [100, 300, 400, 500, 700],
		},
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
					// get user endpoint
					user: { url: '/user/profile', method: 'get' },
					// logout endpoint
					logout: false,
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
			icons: false,
		},
		treeShake: true,
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
		publicPath: process.env.VUE_APP_LANDING,
	},
};
