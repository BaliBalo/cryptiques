import { z } from 'zod';
import { db, schema } from '@nuxthub/db';
import { and, eq, exists, type SQL, sql } from 'drizzle-orm';

const { clues, solves, cluesQualityVotes, cluesDifficultyVotes } = schema;

const querySchema = z.object({
	id: z.uuid(),
});

const range = z.tuple([z.number(), z.number()]);
const note = z.string().optional();
const hintsSchema = z.object({
	definition: z.object({ range, note }).optional(),
	altDefinition: z.object({ range, note }).optional(),
	indicators: z.object({ ranges: z.array(range), note }).optional(),
	fodder: z.object({ ranges: z.array(range), note }).optional(),
	extra: z.array(z.object({ name: z.string().optional(), range: range.optional(), content: z.string() })).optional(),
	answer: z.string().optional(),
});

export default defineEventHandler(async (event) => {
	const query = await getValidatedQuery(event, query => querySchema.parse(query));
	const session = await getUserSession(event);
	const userId = session.user?.id;

	const [clue] = await db.select({
		id: clues.id,
		content: clues.content,
		answer: clues.answer,
		hints: clues.hints,
		notes: clues.notes,
		authorName: clues.authorName,
		createdAt: clues.createdAt,
		nsfw: clues.nsfw,
	})
		.from(clues)
		.where(eq(clues.id, query.id))
		.limit(1);

	if (!clue) {
		throw createError({
			statusCode: 404,
			message: 'Clue not found',
		});
	}

	let userData: { solved: boolean, qualityVote: boolean | null, difficultyVote: string | null } | undefined;
	if (userId) {
		[userData] = await db.select({
			solved: exists(db.select().from(solves).where(and(eq(solves.clueId, clues.id), eq(solves.userId, userId)))).mapWith(Boolean),
			qualityVote: cluesQualityVotes.like,
			difficultyVote: cluesDifficultyVotes.difficulty,
		})
			.from(clues)
			.leftJoin(cluesQualityVotes, and(eq(cluesQualityVotes.clueId, clues.id), eq(cluesQualityVotes.userId, userId)))
			.leftJoin(cluesDifficultyVotes, and(eq(cluesDifficultyVotes.clueId, clues.id), eq(cluesDifficultyVotes.userId, userId)))
			.where(eq(clues.id, clue.id))
			.limit(1);
	}

	const hintsParsed = hintsSchema.safeParse(clue.hints);
	const hints = hintsParsed.success ? hintsParsed.data : undefined;

	return {
		id: clue.id,
		content: clue.content,
		answer: clue.answer,
		hints,
		notes: clue.notes,
		authorName: clue.authorName,
		createdAt: clue.createdAt,
		nsfw: clue.nsfw,
		solved: userData?.solved || false,
		qualityVote: userData?.qualityVote ?? null,
		difficultyVote: userData?.difficultyVote == null ? null : +userData.difficultyVote,
	};
});