import { z } from 'zod';
import { db, schema } from '@nuxthub/db';

const bodySchema = z.object({
	content: z.string(),
	answer: z.string(),
	by: z.string(),
	hints: z.object({
		definition: z.object({ range: z.tuple([z.number(), z.number()]), note: z.string().optional() }).optional(),
		altDefinition: z.object({ range: z.tuple([z.number(), z.number()]), note: z.string().optional() }).optional(),
		indicators: z.object({ ranges: z.array(z.tuple([z.number(), z.number()])), note: z.string().optional() }).optional(),
		fodder: z.object({ ranges: z.array(z.tuple([z.number(), z.number()])), note: z.string().optional() }).optional(),
		extra: z.array(z.object({ name: z.string().optional(), range: z.tuple([z.number(), z.number()]).optional(), content: z.string() })).optional(),
		answer: z.string().optional(),
	}).optional(),
	nsfw: z.boolean().optional(),
	featured: z.boolean().optional(),
	clueOfTheDay: z.iso.date().optional(),
});

export default defineEventHandler(async (event) => {
	const { user } = await requireUserSession(event);
	if (!user.admin) {
		throw createError({ statusCode: 403, message: 'Forbidden' });
	}
	const data = await readValidatedBody(event, body => bodySchema.parse(body));

	const result = await db.insert(schema.clues).values({
		content: data.content,
		answer: data.answer,
		author: user.id,
		authorName: data.by,
		hints: data.hints,
		nsfw: data.nsfw,
		featured: data.featured,
		clueOfTheDay: data.clueOfTheDay,
	}).returning();

	return result;
});