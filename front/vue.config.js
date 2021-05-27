const configuration = () => {
	if (process.env.NODE_ENV === 'production') {
		return {
			transpileDependencies: ['vuetify'],
		};
	} else {
		return {
			transpileDependencies: ['vuetify'],
		};
	}
};

module.exports = configuration();
