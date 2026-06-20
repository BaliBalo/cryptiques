import { z } from 'zod';

const range = z.tuple([z.number(), z.number()]);
const note = z.string().optional();
export const hintsSchema = z.object({
	definition: z.object({ range, note }).optional(),
	altDefinition: z.object({ range, note }).optional(),
	indicators: z.object({ ranges: z.array(range), note }).optional(),
	fodder: z.object({ ranges: z.array(range), note }).optional(),
	extra: z.array(z.object({ name: z.string().optional(), range: range.optional(), content: z.string() })).optional(),
	answer: z.string().optional(),
});

export type Hints = z.infer<typeof hintsSchema>;

export const isHintType = (type: unknown): type is keyof Hints => typeof type === 'string' && type in hintsSchema.shape;
