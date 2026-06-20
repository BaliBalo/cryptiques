const formats = {
	long: { dateStyle: 'long' },
} as const;

const formatters = new Map<string, Intl.DateTimeFormat>();

export function displayDate(date: Date | string | number, format: keyof typeof formats = 'long') {
	if (!formatters.has(format)) {
		formatters.set(format, new Intl.DateTimeFormat('fr-FR', formats[format]));
	}
	return formatters.get(format)!.format(date instanceof Date ? date : new Date(date));
}