const STORAGE_KEY = 'cryptiques-solves';
const WIP_STORAGE_KEY = 'cryptiques-solves-wip';

export type SolveDetails = { at: number, hints?: number, time?: number };
export type UnfinishedSolveData = { answer: string[], hints: string[], time: number };

function toLocalSolve(entry: [string, unknown]): [string, SolveDetails] | null {
	const [id, solve] = entry;
	if (!solve || typeof solve !== 'object' || !('at' in solve) || typeof solve.at !== 'number') {
		return null;
	}
	const newSolve: SolveDetails = { at: solve.at };
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

export function saveSolveLocally(clueId: string, solve: SolveDetails) {
	try {
		const solves = getLocalSolves();
		if (!solves[clueId]) {
			solves[clueId] = solve;
			localStorage.setItem(STORAGE_KEY, JSON.stringify(solves));
		}
	} catch (err) {
		// Should the user be informed ?
		console.error('Error saving solve locally', err);
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

function toWIPSolve(entry: [string, unknown]): [string, UnfinishedSolveData] | null {
	const [id, solve] = entry;
	if (!solve || typeof solve !== 'object') {
		return null;
	}
	return [
		id,
		{
			answer: 'answer' in solve && Array.isArray(solve.answer) ? solve.answer.filter(a => typeof a === 'string') : [],
			hints: 'hints' in solve && Array.isArray(solve.hints) ? solve.hints.filter(h => typeof h === 'string') : [],
			time: 'time' in solve && typeof solve.time === 'number' ? solve.time : 0,
		},
	];
};

export function getWIPSolves() {
	try {
		const data: unknown = JSON.parse(localStorage.getItem(WIP_STORAGE_KEY) || '{}');
		if (typeof data !== 'object' || data === null) return {};
		return Object.fromEntries(Object.entries(data).map(toWIPSolve).filter(e => e !== null));
	} catch {
		return {};
	}
}

export function getWIPSolve(clueId: string) {
	const wipSolves = getWIPSolves();
	return wipSolves[clueId] || null;
}

export function saveWIPSolve(clueId: string, data: UnfinishedSolveData) {
	try {
		const wipSolves = getWIPSolves();
		wipSolves[clueId] = data;
		localStorage.setItem(WIP_STORAGE_KEY, JSON.stringify(wipSolves));
	} catch (err) {
		console.error('Error saving WIP solve', err);
	}
}

export function removeWIPSolve(clueId: string) {
	try {
		const wipSolves = getWIPSolves();
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete wipSolves[clueId];
		localStorage.setItem(WIP_STORAGE_KEY, JSON.stringify(wipSolves));
	} catch (err) {
		console.error('Error removing WIP solve', err);
	}
}