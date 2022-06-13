const initialState = {
	clients: [],
	loading: true,
	page: {
		totalPages: 0,
		page: 0,
		limit: 10,
	},
	loadingPsychologist: false,
	payments: [],
	psychologists: [],
	psychologist: null,
	resumeView: false,
	sessions: [],
	transactions: null,
	sessionsLimit: [],
	sessionsFormatted: [],
	sessionsFormattedAll: [],
};

export default () => initialState;
