export function displayNumber(value: number, word?: string, pluralWord?: string) {
	const num = value.toLocaleString('fr-FR');
	if (!word) return num;
	const displayedWord = value > 1 ? (pluralWord ?? word + 's') : word;
	return `${num} ${displayedWord}`;
}