export default err => {
	if (err.response && err.response.data.message) {
		return err.response.data.message;
	} else if (err.response && err.response.data.description) {
		return err.response.data.description;
	} else {
		return err.message;
	}
};
