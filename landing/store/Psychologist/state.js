const initialState = {
	clients: [],
	loading: true,
	page: {
		totalPages: 0,
		page: 0,
		limit: 10,
	},
	payments: [],
	psychologists: [],
	resumeView: false,
	sessions: [],
	sessionsFormatted: [],
	sessionsFormattedAll: [],
};

export default () => initialState;
