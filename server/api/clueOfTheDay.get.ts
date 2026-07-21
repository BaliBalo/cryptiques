import { db, schema } from '@nuxthub/db';
import { eq, gt, sql } from 'drizzle-orm';
import { getClueData } from '~~/server/utils/getClueData';

const { clues } = schema;

export default defineEventHandler(async (event) => {
	const today = sql`CURRENT_DATE`;
	const next = await db.select({ date: sql`extract(epoch from ${clues.clueOfTheDay}::timestamptz) * 1000`.mapWith(Number) }).from(clues).where(gt(clues.clueOfTheDay, today)).orderBy(clues.clueOfTheDay).limit(1);
	return {
		clue: await getClueData(eq(clues.clueOfTheDay, today), event),
		next: next[0]?.date,
	};
});