import { authSuccess } from '~~/server/utils/authSuccess';

export default defineOAuthDiscordEventHandler({
	config: {
		emailRequired: true,
	},
	async onSuccess(event, { user }) {
		try {
			if (!user.email) {
				throw new Error('user email not available');
			}
			return await authSuccess(event, { email: user.email, name: user.global_name });
		} catch (err) {
			if (err instanceof H3Error) throw err;
			throw createError({
				statusCode: 401,
				message: 'Authentication failed',
				data: { type: 'auth_error' },
			});
		}
	},
	onError() {
		throw createError({
			statusCode: 401,
			message: 'Authentication failed',
			data: { type: 'auth_error' },
		});
	},
});
