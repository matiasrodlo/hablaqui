export const errorResponse = (e, res) =>
	res.status(400).json({ status: false, error: e.message });
