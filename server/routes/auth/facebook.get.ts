import { authSuccess } from '~~/server/utils/authSuccess';

export default defineOAuthFacebookEventHandler({
	config: {
		scope: ['email'],
	},
	async onSuccess(event, { user }) {
		try {
			console.log('Facebook user data:', user);
			if (!user.email) {
				throw new Error('user email not available');
			}
			return await authSuccess(event, { email: user.email, name: user.name });
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
