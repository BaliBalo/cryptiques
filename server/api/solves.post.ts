import { z } from 'zod';
import { db, schema } from '@nuxthub/db';
import { inArray } from 'drizzle-orm';

const bodySchema = z.object({
	solves: z.record(z.uuid(), z.object({ at: z.number().optional(), hints: z.int(), time: z.int().default(0) })),
});

export default defineEventHandler(async (event) => {
	const { user } = await requireUserSession(event);
	const data = await readValidatedBody(event, body => bodySchema.parse(body));

	let values = Object.entries(data.solves).map(([clueId, details]) => ({
		clueId,
		userId: user.id,
		createdAt: details.at ? new Date(details.at) : new Date(),
		time: details.time,
		hints: details.hints,
	}));
	// To ensure deleted clues don't cause issues when merging local solve, make sure to keep existing clue ids only
	const desiredClueIds = values.map(v => v.clueId);
	const existingClueIds = (await db.select({ id: schema.clues.id }).from(schema.clues).where(inArray(schema.clues.id, desiredClueIds))).map(c => c.id);
	values = values.filter(v => existingClueIds.includes(v.clueId));
	if (values.length) {
		await db.insert(schema.solves).values(values).onConflictDoNothing();
	}
	return { success: true };
});