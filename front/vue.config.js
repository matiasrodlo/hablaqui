const configuration = () => {
	if (process.env.NODE_ENV === 'production') {
		return {
			transpileDependencies: ['vuetify'],
			pwa: {
				workboxPluginMode: 'InjectManifest',
				workboxOptions: {
					swSrc: 'src/service-worker.js',
				},
			},
		};
	} else {
		return {
			transpileDependencies: ['vuetify'],
		};
	}
};

module.exports = configuration();
