const whitelist = {
	API: [process.env.VUE_APP_LANDING, 'https://hablaqui.retool.com/'],
	CRON: ['googleapis.com'],
};

const corsApi = {
	origin: function(origin, callback) {
		if (whitelist['API'].indexOf(origin) !== -1) callback(null, true);
		else callback(new Error('Not allowed by CORS: ' + origin));
	},
};

const corsCron = {
	origin: function(origin, callback) {
		if (whitelist['CRON'].indexOf(origin) !== -1) callback(null, true);
		else callback(new Error('Not allowed by CORS: ' + origin));
	},
};

const permission = { corsApi, corsCron };

export default permission;
