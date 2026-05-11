import type { H3Event } from 'h3';
import { db, schema } from '@nuxthub/db';

export async function authSuccess(event: H3Event, data: { email: string, name?: string }, redirectTo = '/auth/success') {
	const [dbUser] = await db.insert(schema.users).values({
		email: data.email,
		// name: data.name,
	}).onConflictDoUpdate({
		target: schema.users.email,
		set: { lastLogin: new Date() },
	}).returning();
	if (!dbUser) {
		throw new Error('failed to get or create user');
	}
	if (dbUser.banned) {
		throw createError({
			statusCode: 403,
			message: 'Your account has been banned',
			data: { type: 'banned' },
		});
	}
	await setUserSession(event, { user: { id: dbUser.id, email: dbUser.email, admin: dbUser.admin } });
	return sendRedirect(event, redirectTo);
}