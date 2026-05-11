import { z } from 'zod';
import { db, schema } from '@nuxthub/db';

const bodySchema = z.intersection(
	z.object({ clue: z.uuid() }),
	z.union([
		z.object({
			type: z.literal('quality'),
			like: z.boolean().nullable(),
		}),
		z.object({
			type: z.literal('difficulty'),
			difficulty: z.number().min(0).max(1).nullable(),
		}),
	]),
);

export default defineEventHandler(async (event) => {
	const { user } = await requireUserSession(event);
	const data = await readValidatedBody(event, body => bodySchema.parse(body));

	if (data.type === 'quality') {
		await db.insert(schema.cluesQualityVotes).values({
			userId: user.id,
			clueId: data.clue,
			like: data.like,
		}).onConflictDoUpdate({
			target: [schema.cluesQualityVotes.userId, schema.cluesQualityVotes.clueId],
			set: { like: data.like },
		});
	} else if (data.type === 'difficulty') {
		const diffString = data.difficulty === null ? null : `${data.difficulty}`;
		await db.insert(schema.cluesDifficultyVotes).values({
			userId: user.id,
			clueId: data.clue,
			difficulty: diffString,
		}).onConflictDoUpdate({
			target: [schema.cluesDifficultyVotes.userId, schema.cluesDifficultyVotes.clueId],
			set: { difficulty: diffString },
		});
	}

	return { success: true };
});