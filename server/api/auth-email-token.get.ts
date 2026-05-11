import { wait } from '~~/shared/utils/wait';
import { generateSpamProtectionToken } from '~~/server/utils/authEmail';

export default defineEventHandler(async (event) => {
	// Avoid spam: require a token that takes a few seconds to generate
	await wait(5000);
	return await generateSpamProtectionToken();
});