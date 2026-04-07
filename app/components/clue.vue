<script setup lang="tsx">
	import type { Range, TypedRange } from '~/utils/ranges.tsx';

	const slots = useSlots();
	const props = defineProps<{
		example?: boolean,
		answer: string,
		hints?: {
			definition?: { range: Range, note?: string },
			altDefinition?: { range: Range, note?: string },
			indicators?: { ranges: Range[], note?: string },
			fodder?: { ranges: Range[], note?: string },
			extra?: { name?: string, range?: Range, content: string }[],
			answer?: string,
		},
	}>();

	let text = slots.default?.()[0]?.children;
	if (typeof text !== 'string') text = '';
	text = text.trim();

	const hints = props.hints || {};
	const indicatorRanges = hints.indicators?.ranges || [];
	const fodderRanges = hints.fodder?.ranges || [];
	const extraHints = hints.extra || [];
	const addType = (range: Range | undefined, type: string): TypedRange | undefined => range && [range[0], range[1], type];
	const allRanges = [
		addType(hints.definition?.range, 'definition'),
		addType(hints.altDefinition?.range, 'alt-definition'),
		...indicatorRanges.map(r => addType(r, 'indicator')),
		...fodderRanges.map(r => addType(r, 'fodder')),
		...extraHints.map((extra, i) => addType(extra.range, `extra extra-${i + 1}`)),
	].filter(e => !!e);

	const prompt = () => wrapRanges(text, allRanges);
	const answer = props.answer;
	const len = getAnswerLength(answer);

	const toHumanList = (arr: Range[]) => arr.flatMap((range, i, arr) => [
		!i ? '' : (i === arr.length - 1 ? ' et ' : ', '),
		<code>{extractRange(text, range)}</code>,
	]);;

	const indicatorsList = () => toHumanList(indicatorRanges);

	const fodderList = () => toHumanList(fodderRanges);

	const hintsPopoverId = useId();
	const shown = ref<{ [key: string]: boolean }>({});
	const wrapperClass = computed(() => (
		Object.fromEntries(Object.entries(shown.value).map(([k, v]) => [`show-${k}`, v]))
	));

	function show(e: PointerEvent) {
		const target = e.currentTarget;
		if (!(target instanceof HTMLElement)) return;
		const type = target.dataset.type;
		if (!type) return;
		shown.value[type] = !shown.value[type];
		document.getElementById(hintsPopoverId)?.togglePopover(false);
	}
</script>

<template>
	<div class="clue-wrapper" :class="wrapperClass">
		<div class="clue">
			<div class="clue-text">
				<prompt /> {{ len }}
			</div>
			<div v-if="hints.indicators" class="hint indicators">{{ indicatorRanges.length > 1 ? 'Les indicateurs sont' : 'L\'indicateur est' }} <indicatorsList />. {{ hints.indicators.note }}</div>
			<div v-if="hints.fodder" class="hint fodder">La matière est <fodderList />. {{ hints.fodder.note }}</div>
			<div v-if="hints.definition" class="hint definition">{{ hints.altDefinition ? 'Une' : 'La' }} définition est <code>{{ extractRange(text, hints.definition.range) }}</code>. {{ hints.definition.note }}</div>
			<div v-if="hints.altDefinition" class="hint alt-definition">L'autre définition est <code>{{ extractRange(text, hints.altDefinition.range) }}</code>. {{ hints.altDefinition.note }}</div>
			<div v-for="(extra, i) in extraHints" class="hint extra" :class="{ [`extra-${i + 1}`]: true }">{{ extra.content }}</div>
			<div v-if="example" class="answer">
				{{ answer }}
				<div v-if="hints.answer" class="details">{{ hints.answer }}</div>
			</div>
		</div>
		<div class="buttons">
			<!-- setting explicit anchorName because implicit ones from popover break during closing animation in FF -->
			<button v-if="props.hints && (hints.indicators || hints.fodder || hints.definition || hints.altDefinition || extraHints.length)" :popovertarget="hintsPopoverId" :style="{ anchorName: `--${hintsPopoverId}` }">indices</button>
			<div class="choose-hint" popover :id="hintsPopoverId" :style="{ positionAnchor: `--${hintsPopoverId}` }">
				<button v-if="hints.indicators" data-type="indicators" @click="show">indicateurs</button>
				<button v-if="hints.fodder" data-type="fodder" @click="show">matière</button>
				<button v-if="hints.definition" data-type="definition" @click="show">définition</button>
				<button v-if="hints.altDefinition" data-type="alt-definition" @click="show">autre définition</button>
				<button v-for="(extra, i) in extraHints" :data-type="`extra-${i + 1}`" @click="show">{{ extra.name || `extra ${i + 1}` }}</button>
			</div>
			<button v-if="example" data-type="answer" @click="show">solution</button>
		</div>
	</div>
</template>

<style scoped>
	.clue-wrapper {
		--border: var(--light);
	}
	.clue {
		padding: 16px;
		border: 4px double var(--border);
		border-radius: 12px;
		corner-shape: bevel;
		background: var(--background);
	}
	@property --clue-hint-show-highlight {
		syntax: '<number>';
		initial-value: 0;
		inherits: false;
	}
	.clue-text {
		font-size: 1.25rem;
		& :deep(span) {
			--c: #0000;
			background: linear-gradient(to right, var(--c) 50%, #0000 0) calc(100% * (1 - var(--clue-hint-show-highlight))) 100% / 300% 100% no-repeat;
			border-radius: 4px;
			transition: --clue-hint-show-highlight .2s;
		}
		& :deep(.definition) { --c: var(--definition); }
		& :deep(.alt-definition) { --c: var(--definition); }
		& :deep(.indicator) { --c: var(--hint-2); }
		& :deep(.fodder) { --c: var(--hint-1); }
		& :deep(.extra) { --c: var(--hint-6); }
		& :deep(.extra-1) { --c: var(--hint-3); }
		& :deep(.extra-2) { --c: var(--hint-4); }
		& :deep(.extra-3) { --c: var(--hint-5); }
	}
	.hint, .answer {
		--highlight: color-mix(in oklch, currentColor, transparent 90%);
		height: 0;
		border-top: 0 solid transparent;
		margin: 0 -16px;
		padding: 0 16px;
		overflow: clip;
		interpolate-size: allow-keywords;
		transition: padding-top .2s, margin-top .2s, border-top .2s, height .2s;
		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
		&::before { color: var(--note); font-size: .9rem; }
		& :deep(code) {
			font-family: inherit;
			background: var(--highlight);
			padding: 2px 4px;
			border-radius: 4px;
			font-size: .9em;
			text-transform: lowercase;
		}
	}
	.hint::before { content: 'Indice: '; }
	.answer::before { content: 'Solution: '; }
	.hint {
		&.definition { --highlight: var(--definition); }
		&.alt-definition { --highlight: var(--definition); }
		&.indicators { --highlight: var(--hint-2); }
		&.fodder { --highlight: var(--hint-1); }
		&.extra { --highlight: var(--hint-6); }
		&.extra-1 { --highlight: var(--hint-3); }
		&.extra-2 { --highlight: var(--hint-4); }
		&.extra-3 { --highlight: var(--hint-5); }
	}
	.answer {
		text-align: center;
		font-size: 1.25rem;
		font-variant: small-caps;
		&::before { font-variant: none; }
		.details {
			font-variant: none;
			margin-top: 8px;
			font-size: .8em;
			text-align: left;
			color: var(--note);
		}
	}
	.show-indicators .indicators,
	.show-fodder .fodder,
	.show-definition .definition,
	.show-alt-definition .alt-definition,
	.show-extra-1 .extra-1,
	.show-extra-2 .extra-2,
	.show-extra-3 .extra-3,
	.show-extra-4 .extra-4,
	.show-answer .answer {
		padding-top: 8px;
		margin-top: 8px;
		border-top: 1px solid var(--border);
		height: auto;
	}
	.show-indicators .clue-text :deep(.indicator),
	.show-fodder .clue-text :deep(.fodder),
	.show-definition .clue-text :deep(.definition),
	.show-alt-definition .clue-text :deep(.alt-definition),
	.show-extra-1 .clue-text :deep(.extra-1),
	.show-extra-2 .clue-text :deep(.extra-2),
	.show-extra-3 .clue-text :deep(.extra-3),
	.show-extra-4 .clue-text :deep(.extra-4) {
		--clue-hint-show-highlight: 1;
	}
	.buttons {
		display: flex;
		justify-content: center;
		gap: 16px;
		&:empty { display: none; }
		> button {
			position: relative;
			padding: 4px 8px;
			border: 1px solid var(--border);
			border-top: none;
			--r: 8px;
			border-radius: 0 0 var(--r) var(--r);
			corner-shape: bevel;
			&::before, &::after {
				content: '';
				position: absolute;
				inset: 0 -4px -4px;
				border: inherit;
				corner-shape: inherit;
				border-radius: 0 0 calc(var(--r) + 2px) calc(var(--r) + 2px);
				transition: inset .15s, border-radius .15s, visibility .15s;
			}
			/* ::after just for stable hit-checking */
			&::after { border-color: transparent; }
			&:hover::before {
				inset: 0 -1px -1px;
				border-radius: 0 0 var(--r) var(--r);
				visibility: hidden;
			}
		}
	}
	.choose-hint {
		margin: 0;
		inset: auto;
		position-area: top;
		position-try-fallbacks: flip-block;
		display: flex;
		flex-flow: column nowrap;
		align-items: start;
		gap: 8px;
		padding: 8px;
		color: var(--color);
		background: var(--background);
		border: 1px solid color-mix(in oklch, var(--text), transparent 80%);
		border-radius: 8px;
		box-shadow: 0 4px 4px #0001;
		z-index: 8;
		transition: display .15s allow-discrete, overlay .15s allow-discrete, translate .15s, opacity .15s;
		@starting-style {
			translate: 0 8px;
			opacity: 0;
		}
		&:not(:popover-open) {
			display: none;
			translate: 0 8px;
			opacity: 0;
		}
		> button {
			--highlight: #0000;
			background: linear-gradient(var(--highlight) 0 0) bottom / 100% 25% no-repeat;
			-webkit-tap-highlight-color: transparent;
			margin: 0 4px;
			padding: 0;
			border-radius: 0;
			transition: background-size .15s, margin .15s, padding .15s, border-radius .15s;
			&:hover {
				background-size: 100% 100%;
				margin: 0;
				padding: 0 4px;
				border-radius: 4px;
			}
		}
		[data-type="indicators"] { --highlight: var(--hint-2); }
		[data-type="fodder"] { --highlight: var(--hint-1); }
		[data-type="definition"] { --highlight: var(--definition); }
		[data-type="alt-definition"] { --highlight: var(--definition); }
		[data-type^="extra"] { --highlight: var(--hint-6); }
		[data-type="extra-1"] { --highlight: var(--hint-3); }
		[data-type="extra-2"] { --highlight: var(--hint-4); }
		[data-type="extra-3"] { --highlight: var(--hint-5); }
	}
</style>