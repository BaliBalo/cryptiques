const separators = {
	' ': ', ',
	'-': '-',
	"'": "'",
};
export const isSeparator = (str: string | undefined): str is keyof typeof separators => !!str && str in separators;

const escapeInCharacterClass = ['^', '-', ']', '\\'];
export const separatorsRegex = new RegExp(`([${Object.keys(separators).map(s => escapeInCharacterClass.includes(s) ? `\\${s}` : s).join('')}]+)`, 'g');

export function getAnswerLength(answer: string) {
	const parts = answer.split(separatorsRegex).map(part => isSeparator(part[0]) ? separators[part[0]] : part.length);
	return `(${parts.join('')})`;
}
