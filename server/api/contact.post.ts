import { z } from 'zod';
import { sendEmail } from '~~/server/utils/sendEmail';

const bodySchema = z.object({
	type: z.string().optional(),
	email: z.string().optional(),
	message: z.string(),
});

const typeTexts = {
	clue: 'Énigme',
	problem: 'Problème',
	suggestion: 'Suggestion',
	other: 'Autre',
};
const isKnownType = (type?: string): type is keyof typeof typeTexts => !!type && type in typeTexts;

export default defineEventHandler(async (event) => {
	const data = await readValidatedBody(event, body => bodySchema.parse(body));

	await sendEmail({
		subject: `[Cryptiques] CONTACT - ${isKnownType(data.type) ? typeTexts[data.type] : data.type || 'Autre'}`,
		text: `Message de: ${data.email || 'Anonyme'}\n\n${data.message}`,
	});

	return { success: true };
});