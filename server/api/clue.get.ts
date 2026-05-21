import { z } from 'zod';
import { getClueData } from '~~/server/utils/getClueData';

const querySchema = z.object({
	id: z.uuid(),
});

export default defineEventHandler(async (event) => {
	const query = await getValidatedQuery(event, query => querySchema.parse(query));
	const data = await getClueData(query.id, event);
	if (!data) {
		throw createError({
			statusCode: 404,
			message: 'Clue not found',
		});
	}
	return data;
});