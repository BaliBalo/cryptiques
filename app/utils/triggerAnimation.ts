export function triggerAnimation(element: Element | EventTarget | null, className: string) {
	if (!(element instanceof Element)) return;
	element.classList.remove(className);
	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	element.clientWidth;
	element.classList.add(className);
}