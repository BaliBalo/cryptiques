import { z } from 'zod';
import { verifySpamProtectionToken, sendAuthEmail } from '~~/server/utils/authEmail';

const bodySchema = z.object({
	token: z.string(),
	email: z.email(),
});

export default defineEventHandler(async (event) => {
	const data = await readValidatedBody(event, body => bodySchema.parse(body));
	if (!verifySpamProtectionToken(data.token)) {
		throw createError({
			statusCode: 401,
			message: 'Invalid or expired token',
			data: { type: 'token_error' },
		});
	}

	await sendAuthEmail(data.email);

	return { success: true };
});