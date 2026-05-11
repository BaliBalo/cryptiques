import { z } from 'zod';
import { db, schema } from '@nuxthub/db';

const bodySchema = z.object({
	solves: z.record(z.uuid(), z.object({ at: z.number().optional(), hints: z.int().optional(), time: z.int().optional() })),
});

export default defineEventHandler(async (event) => {
	const { user } = await requireUserSession(event);
	const data = await readValidatedBody(event, body => bodySchema.parse(body));
	const values = Object.entries(data.solves).map(([clueId, details]) => ({
		clueId,
		userId: user.id,
		createdAt: details.at ? new Date(details.at) : new Date(),
		time: details.time,
		hints: details.hints,
	}));
	if (values.length) {
		await db.insert(schema.solves).values(values).onConflictDoNothing();
	}
	return { success: true };
});