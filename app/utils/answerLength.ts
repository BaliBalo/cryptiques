const separators = {
	' ': ', ',
	'-': '-',
	"'": "'",
};
const isSeparator = (str: string): str is keyof typeof separators => str in separators;

export function getAnswerLength(answer: string) {
	const parts = answer.split(/([ '-])/).map(part => isSeparator(part) ? separators[part] : part.length);
	return `(${parts.join('')})`;
}