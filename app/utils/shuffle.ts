function hash(str: string) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = (hash << 5) - hash + str.charCodeAt(i);
		hash |= 0;
	}
	return hash;
}

function mulberry32(a: number) {
	return function () {
		let t = a += 0x6D2B79F5;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function seededShuffle<T>(array: T[], seed: string) {
	const rnd = mulberry32(hash(seed));
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(rnd() * (i + 1));
		[array[i], array[j]] = [array[j]!, array[i]!];
	}
	return array;
}