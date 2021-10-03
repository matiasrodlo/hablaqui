export default err => {
	if (err.response && err.response.data.message) {
		return err.response.data.message;
	} else if (err.response && err.response.data.description) {
		return err.response.data.description;
	} else if (err.response && err.response.data.error) {
		return err.response.data.error;
	} else {
		return err.message;
	}
};
