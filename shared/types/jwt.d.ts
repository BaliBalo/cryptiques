import type { sign, verify, decode } from 'jsonwebtoken';

declare module 'jsonwebtoken' {
	export default {
		sign,
		verify,
		decode,
	};
}

export {};