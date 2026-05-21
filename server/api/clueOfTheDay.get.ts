// import { z } from 'zod';
import { schema } from '@nuxthub/db';
import { eq, sql } from 'drizzle-orm';
import { getClueData } from '~~/server/utils/getClueData';

export default defineEventHandler(async (event) => {
	return await getClueData(eq(schema.clues.clueOfTheDay, sql`CURRENT_DATE`), event);
});