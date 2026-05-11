import { z } from 'zod';
import { db, schema } from '@nuxthub/db';
import { and, avg, count, desc, eq, exists, ilike, notExists, sql, type SQL } from 'drizzle-orm';

const PAGE_SIZE = 25;

const { clues, solves, cluesQualityVotes, cluesDifficultyVotes } = schema;

const querySchema = z.object({
	offset: z.coerce.number().default(0),
	search: z.string().optional(),
	order: z.enum(['new', 'solves', 'rating', 'difficulty']).default('new'),
	nsfw: z.stringbool().default(false),
	solved: z.stringbool().default(true),
});

export default defineEventHandler(async (event) => {
	const query = await getValidatedQuery(event, query => querySchema.parse(query));
	const session = await getUserSession(event);
	const userId = session.user?.id;

	const filters: SQL[] = [];
	if (query.search) filters.push(ilike(clues.content, `%${query.search}%`));
	if (!query.nsfw) filters.push(eq(clues.nsfw, false));
	if (!query.solved && userId) {
		filters.push(notExists(
			db.select().from(solves).where(and(
				eq(solves.clueId, clues.id),
				eq(solves.userId, userId),
			)),
		));
	}

	let orderBy: SQL[] = [];
	switch (query.order) {
		case 'new':
			orderBy = [desc(clues.createdAt)];
			break;
		case 'solves':
			orderBy = [
				desc(count(solves.id)),
				desc(clues.createdAt),
			];
			break;
		case 'rating':
			orderBy = [
				// (upvotes + 1) / (totalVotes + 2) ; avoids small vote counts getting 100%
				// Could use some more complex thing: https://www.evanmiller.org/how-not-to-sort-by-average-rating.html
				desc(sql`(COUNT(${cluesQualityVotes.like}) FILTER (WHERE ${cluesQualityVotes.like} IS TRUE) + 1)::decimal / (COUNT(${cluesQualityVotes.like}) + 2)`),
				desc(clues.createdAt),
			];
			break;
		case 'difficulty':
			// should this include actual difficulty ? i.e. average time / hints used ?
			orderBy = [
				desc(sql`coalesce(${avg(cluesDifficultyVotes.difficulty)}, 0.5)`),
				desc(clues.createdAt),
			];
			break;
	}

	const dbData = await db.select({
		id: clues.id,
		content: clues.content,
		authorName: clues.authorName,
		createdAt: clues.createdAt,
		nsfw: clues.nsfw,
		solves: count(solves.id),
		upvotes: sql<number>`COUNT(${cluesQualityVotes.like}) FILTER (WHERE ${cluesQualityVotes.like} IS TRUE)`,
		downvotes: sql<number>`COUNT(${cluesQualityVotes.like}) FILTER (WHERE ${cluesQualityVotes.like} IS FALSE)`,
		difficulty: sql`coalesce(${avg(cluesDifficultyVotes.difficulty)}, 0.5)`.mapWith(Number),
		solved: !userId ? sql<false>`FALSE` : exists(db.select().from(solves).where(and(eq(solves.clueId, clues.id), eq(solves.userId, userId)))).mapWith(Boolean),
	})
		.from(schema.clues)
		.where(and(...filters))
		.leftJoin(solves, eq(solves.clueId, clues.id))
		.leftJoin(cluesQualityVotes, eq(cluesQualityVotes.clueId, clues.id))
		.leftJoin(cluesDifficultyVotes, eq(cluesDifficultyVotes.clueId, clues.id))
		.groupBy(clues.id)
		.orderBy(...orderBy)
		.limit(PAGE_SIZE + 1)
		.offset(query.offset);

	return {
		hasMore: dbData.length > PAGE_SIZE,
		list: dbData.slice(0, PAGE_SIZE).map(clue => ({
			id: clue.id,
			clue: clue.content,
			author: clue.authorName || 'Inconnu',
			createdAt: clue.createdAt,
			nsfw: clue.nsfw,
			solves: clue.solves,
			upvotes: clue.upvotes,
			downvotes: clue.downvotes,
			difficulty: clue.difficulty,
			solved: clue.solved,
		})),
	};
});