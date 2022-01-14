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
	resumeView: false,
	sessions: [],
	transactions: [],
	sessionsFormatted: [],
	sessionsFormattedAll: [],
};

export default () => initialState;
