declare module '#auth-utils' {
	interface User {
		id: string,
		email: string,
		admin: boolean,
	}
}

export {};