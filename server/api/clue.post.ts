import { z } from 'zod';
import { db, schema } from '@nuxthub/db';
import { hintsSchema } from '#shared/utils/hintsSchema';

const bodySchema = z.object({
	content: z.string(),
	answer: z.string(),
	author: z.string(),
	hints: hintsSchema.clone().optional(),
	nsfw: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
	const { user } = await requireUserSession(event);
	const data = await readValidatedBody(event, body => bodySchema.parse(body));

	const result = await db.insert(schema.clues).values({
		content: data.content,
		answer: data.answer,
		author: user.id,
		authorName: data.author,
		hints: data.hints,
		nsfw: data.nsfw,
	}).returning();

	return result[0];
});