export function displayPercentage(value: number) {
	const n = Math.max(0, Math.min(1, value)) * 100;
	return `${n.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}%`;
}