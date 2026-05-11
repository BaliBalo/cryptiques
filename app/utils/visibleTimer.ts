export function startTimer() {
	let total = 0;
	let currentStart = performance.now();

	const listener = () => {
		if (document.hidden) {
			total += performance.now() - currentStart;
		} else {
			currentStart = performance.now();
		}
	};
	document.addEventListener('visibilitychange', listener);

	return {
		getTime: () => total + (document.hidden ? 0 : performance.now() - currentStart),
		stop: () => document.removeEventListener('visibilitychange', listener),
	};
}