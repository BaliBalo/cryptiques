const separators = {
	' ': ', ',
	'-': '-',
	"'": "'",
};
export const isSeparator = (str: string): str is keyof typeof separators => str in separators;

const escapeInCharacterClass = ['^', '-', ']', '\\'];
export const separatorsRegex = new RegExp(`([${Object.keys(separators).map(s => escapeInCharacterClass.includes(s) ? `\\${s}` : s).join('')}])`, 'g');

export function getAnswerLength(answer: string) {
	const parts = answer.split(separatorsRegex).map(part => isSeparator(part) ? separators[part] : part.length);
	return `(${parts.join('')})`;
}
