export default defineEventHandler(async (event) => {
	const { email } = getQuery(event);
	if (!email || typeof email !== 'string') {
		throw createError({
			statusCode: 400,
			message: 'Email is required',
		});
	}
	try {
		return await authSuccess(event, { email }, '/moi');
	} catch (err) {
		if (err instanceof H3Error) throw err;
		throw createError({
			statusCode: 401,
			message: 'Authentication failed',
			data: { type: 'auth_error' },
		});
	}
});