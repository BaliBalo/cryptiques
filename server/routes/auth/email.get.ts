// import { db, schema } from '@nuxthub/db';
import { verifyJWT } from '~~/server/utils/authEmail';

export default defineEventHandler(async (event) => {
	const { token } = getQuery(event);
	if (!token || typeof token !== 'string') {
		throw createError({
			statusCode: 400,
			message: 'Token is required',
		});
	}
	const email = await verifyJWT(token);
	if (!email) {
		throw createError({
			statusCode: 401,
			message: 'Invalid or expired token',
			data: { type: 'auth_token_error' },
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