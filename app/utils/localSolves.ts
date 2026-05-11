const STORAGE_KEY = 'cryptiques-solves';

type LocalSolve = { at: number, hints?: number, time?: number };
function toLocalSolve(entry: [string, unknown]): [string, LocalSolve] | null {
	const [id, solve] = entry;
	if (!solve || typeof solve !== 'object' || !('at' in solve) || typeof solve.at !== 'number') {
		return null;
	}
	const newSolve: LocalSolve = { at: solve.at };
	if ('hints' in solve && typeof solve.hints === 'number') newSolve.hints = solve.hints;
	if ('time' in solve && typeof solve.time === 'number') newSolve.time = solve.time;
	return [id, newSolve];
};

export function getLocalSolves() {
	try {
		const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
		if (typeof data !== 'object' || data === null) return {};
		return Object.fromEntries(Object.entries(data).map(toLocalSolve).filter(e => e !== null));
	} catch {
		return {};
	}
}

export function saveSolveLocally(clueId: string, hints?: number, time?: number) {
	try {
		const solves = getLocalSolves();
		solves[clueId] = { at: Date.now(), hints, time };
		localStorage.setItem(STORAGE_KEY, JSON.stringify(solves));
	} catch {
		// Should the user be informed ?
		console.error('Error saving solve locally');
	}
}

export async function mergeLocalSolves() {
	try {
		const solves = getLocalSolves();
		if (solves && Object.keys(solves).length) {
			await $fetch('/api/solves', {
				method: 'POST',
				body: { solves },
			});
		}
		localStorage.removeItem(STORAGE_KEY);
	} catch (err) {
		console.error('Error merging logged out solves', err);
	}
}
