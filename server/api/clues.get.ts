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

	const solvesSubquery = db.select({ clueId: solves.clueId, count: count(solves.id).as('solvesCount') }).from(solves).groupBy(solves.clueId).as('s');
	const qualitySubquery = db.select({
		clueId: cluesQualityVotes.clueId,
		upvotes: sql`count(${cluesQualityVotes.like}) filter (where ${cluesQualityVotes.like} is true)`.as('upvotes'),
		downvotes: sql`count(${cluesQualityVotes.like}) filter (where ${cluesQualityVotes.like} is false)`.as('downvotes'),
	}).from(cluesQualityVotes).groupBy(cluesQualityVotes.clueId).as('qv');
	const difficultySubquery = db.select({
		clueId: cluesDifficultyVotes.clueId,
		difficulty: avg(cluesDifficultyVotes.difficulty).as('difficulty'),
	}).from(cluesDifficultyVotes).groupBy(cluesDifficultyVotes.clueId).as('dv');

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
				desc(solvesSubquery.count).append(sql` nulls last`),
				desc(clues.createdAt),
			];
			break;
		case 'rating':
			orderBy = [
				// (upvotes + 1) / (totalVotes + 2) ; avoids small vote counts getting 100%
				// Could use some more complex thing: https://www.evanmiller.org/how-not-to-sort-by-average-rating.html
				desc(sql`(coalesce(${qualitySubquery.upvotes}, 0) + 1)::decimal / (coalesce(${qualitySubquery.upvotes}, 0) + coalesce(${qualitySubquery.downvotes}, 0) + 2)`),
				desc(clues.createdAt),
			];
			break;
		case 'difficulty':
			// should this include actual difficulty ? i.e. average time / hints used ?
			orderBy = [
				desc(sql`coalesce(${difficultySubquery.difficulty}, 0.5)`),
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
		solves: sql`coalesce(${solvesSubquery.count}, 0)`.mapWith(Number),
		upvotes: sql`coalesce(${qualitySubquery.upvotes}, 0)`.mapWith(Number),
		downvotes: sql`coalesce(${qualitySubquery.downvotes}, 0)`.mapWith(Number),
		difficulty: sql`coalesce(${difficultySubquery.difficulty}, 0.5)`.mapWith(Number),
		solved: !userId ? sql<false>`FALSE` : exists(db.select().from(solves).where(and(eq(solves.clueId, clues.id), eq(solves.userId, userId)))).mapWith(Boolean),
	})
		.from(clues)
		.where(and(...filters))
		.leftJoin(solvesSubquery, eq(solvesSubquery.clueId, clues.id))
		.leftJoin(qualitySubquery, eq(qualitySubquery.clueId, clues.id))
		.leftJoin(difficultySubquery, eq(difficultySubquery.clueId, clues.id))
		.orderBy(...orderBy)
		.limit(PAGE_SIZE + 1)
		.offset(query.offset);

	return {
		hasMore: dbData.length > PAGE_SIZE,
		list: dbData.slice(0, PAGE_SIZE).map(clue => ({
			id: clue.id,
			clue: clue.content,
			author: clue.authorName,
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