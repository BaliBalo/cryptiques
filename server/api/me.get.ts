import { db, schema } from '@nuxthub/db';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
	const { user } = await requireUserSession(event);
	const [dbUser] = await db.select().from(schema.users).where(eq(schema.users.id, user.id)).limit(1) || [];
	if (!dbUser) {
		throw createError({
			statusCode: 401,
			message: 'User not found',
		});
	}
	const solveCount = await db.$count(schema.solves, eq(schema.solves.userId, user.id));
	// const solves = await db.select({
	// 	at: schema.solves.createdAt,
	// 	time: schema.solves.time,
	// 	hints: schema.solves.hints,
	// 	clueId: schema.solves.clueId,
	// 	clueContent: schema.clues.content,
	// 	clueAuthor: schema.clues.authorName,
	// 	nsfw: schema.clues.nsfw,
	// }).from(schema.solves).leftJoin(schema.clues, eq(schema.solves.clueId, schema.clues.id)).where(eq(schema.solves.userId, user.id));
	return {
		id: user.id,
		email: user.email,
		name: dbUser.name || null,
		createdAt: dbUser.createdAt.getTime(),
		solveCount: solveCount,
	};
});