const configuration = () => {
	if (process.env.NODE_ENV === 'production') {
		return {
			transpileDependencies: ['vuetify'],
			pwa: {
				workboxPluginMode: 'InjectManifest',
			},
		};
	} else {
		return {
			transpileDependencies: ['vuetify'],
		};
	}
};

module.exports = configuration();
