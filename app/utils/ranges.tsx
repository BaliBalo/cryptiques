export type Range = [number, number];
export type TypedRange = [number, number, string];

export function wrapRanges(text: string, ranges: TypedRange[]) {
	ranges = ranges.slice().sort((a, b) => {
		// Earlier starts first
		if (a[0] !== b[0]) return a[0] - b[0];
		// Longer ranges first
		return (b[1] - b[0]) - (a[1] - a[0]);
	});

	type StackItem = { range?: TypedRange; content: (string | VNode)[] };
	const stack: StackItem[] = [{ content: [] }];
	for (let i = 0; i < text.length; i++) {
		// Ranges ending
		while ((stack.at(-1)?.range?.[1] ?? Infinity) <= i) {
			const tip = stack.pop()!;
			if (!stack.length) throw new Error();
			stack.at(-1)!.content.push(<span class={tip.range?.[2]}>{tip.content}</span>);
		}
		// Ranges starting
		while ((ranges[0]?.[0] ?? Infinity) <= i) {
			const range = ranges.shift();
			if ((range?.[1] ?? Infinity) <= i) continue;
			stack.push({ range, content: [] });
		}
		const tip = stack.at(-1)!.content;
		const char = text[i] || '';
		if (typeof tip.at(-1) === 'string') {
			tip[tip.length - 1] += char;
		} else {
			tip.push(char);
		}
	}
	while (stack.length > 1) {
		const tip = stack.pop()!;
		stack.at(-1)!.content.push(<span class={tip.range?.[2]}>{tip.content}</span>);
	}
	return stack[0]?.content || [];
}

export function extractRange(str: string, range: Range) {
	return str.slice(...range);
}
