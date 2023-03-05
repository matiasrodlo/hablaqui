const initialState = {
	clients: [],
	loading: true,
	page: {
		totalPages: 0,
		page: 0,
		limit: 10,
	},
	loadingSpecialist: false,
	payments: [],
	specialists: [],
	specialistsIds: [],
	specialist: null,
	resumeView: false,
	sessions: [],
	transactions: null,
	matchMaking: null,
	sessionsLimit: [],
	sessionsFormatted: [],
	sessionsFormattedAll: [],
};

export default () => initialState;
