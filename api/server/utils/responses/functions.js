// used in all controller methods
export const restResponse = (data, code, res) =>
	res.status(code).json({
		...data,
		status: true,
		apiVersion: 'v1',
		baseUrl: process.env.API_URL,
	});

export const conflictResponse = message => ({ code: 409, data: { message } });
// se conserva la estructura antigua en este, ya que va ser ocupado en los catch del controller
export const errorResponse = (e, res) =>
	res
		.status(400)
		.json({ status: false, error: e.message, description: e.description });

export const createdResponse = (message, data = {}) => ({
	code: 201,
	data: { message, ...data },
});

export const okResponse = (message, data = {}) => ({
	code: 200,
	data: { message, ...data },
});

export const noContentResponse = (message, data = {}) => ({
	code: 204,
	data: { message, ...data },
});

export const notFoundResponse = message => ({ code: 404, data: { message } });
