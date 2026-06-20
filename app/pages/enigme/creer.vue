<script setup lang="ts">
	import { getAnswerLength } from '#shared/utils/answerLength';
	import { isHintType, type Hints } from '#shared/utils/hintsSchema';
	import { type Range, extractRange, mergeRanges } from '~/utils/ranges';
	import { InlineInput, register as registerInlineInput } from '~/utils/inlineInput';
	import { confirm } from '~/utils/modal';

	definePageMeta({
		middleware: 'logged-in-only',
	});

	registerInlineInput();

	const step = ref<'write' | 'hints' | 'meta' | 'success'>('write');
	const answer = ref('');
	const content = ref('');
	const hints = ref({} as Hints);
	const author = ref('');
	const nsfw = ref(false);
	const selection = ref<{ start: number, end: number, content: string } | null>(null);

	const clueId = ref<string | null>(null);

	const len = computed(() => getAnswerLength(answer.value));
	const punctuationOnly = /^[^a-z0-9]*$/i;
	const sideDefinitionWarning = computed(() => (
		hints.value.definition
		&& !punctuationOnly.test(content.value.slice(0, hints.value.definition.range[0]))
		&& !punctuationOnly.test(content.value.slice(hints.value.definition.range[1]))
	));

	async function goToWrite() {
		const ok = await confirm('Retourner à l\'étape précédente supprimera les indices enregistrés. Continuer ?');
		if (!ok) return;
		hints.value = { answer: hints.value.answer };
		step.value = 'write';
	}

	function goToHints() {
		step.value = 'hints';
	}

	function goToMeta() {
		step.value = 'meta';
	}

	async function onSubmit(e: SubmitEvent) {
		const form = e.currentTarget;
		if (!(form instanceof HTMLFormElement)) return;
		// const formData: { [key: string]: unknown } = Object.fromEntries(new FormData(form));
		// formData.hints = JSON.parse(formData.hints);
		try {
			const response = await $fetch('/api/clue', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					content: content.value,
					answer: answer.value.toLowerCase(),
					author: author.value,
					hints: hints.value,
					nsfw: nsfw.value,
				}),
			});
			if (!response) throw new Error('No response');
			clueId.value = response.id;
			step.value = 'success';
		} catch {
			triggerAnimation(form, 'error');
		}
	}

	function onContentSelectionChange(e: Event) {
		if (step.value !== 'hints') return;
		const el = e.currentTarget;
		if (!(el instanceof InlineInput)) return;
		let start = el.selectionStart;
		let end = el.selectionEnd;
		if (start === null || end === null) return selection.value = null;

		while (start < end && /^\s/.test(content.value[start] || '')) start++;
		while (end > start && /^\s/.test(content.value[end - 1] || '')) end--;
		if (start === end) return selection.value = null;

		selection.value = { start, end, content: content.value.slice(start, end) };
	}

	function addHint(e: Event) {
		const button = e.currentTarget;
		if (!(button instanceof HTMLButtonElement)) return;
		const type = button.dataset.type;
		const range: Range | null = selection.value && [selection.value.start, selection.value.end];
		switch (type) {
			case 'definition':
			case 'altDefinition': {
				if (!range) return;
				if (!hints.value[type]) {
					hints.value[type] = { range };
				} else {
					hints.value[type].range = range;
				}
				break;
			}
			case 'indicators':
			case 'fodder': {
				if (!range) return;
				if (!hints.value[type]) {
					hints.value[type] = { ranges: [] };
				}
				hints.value[type].ranges = mergeRanges(hints.value[type].ranges.concat([range]));
				break;
			}
			case 'extra': {
				if (!hints.value.extra) {
					hints.value.extra = [];
				}
				hints.value.extra.push({ name: 'extra', range: range || undefined, content: '' });
				break;
			}
		}

		document.getSelection()?.removeAllRanges();
	}

	function removeHint(e: Event) {
		const button = e.currentTarget;
		if (!(button instanceof HTMLButtonElement)) return;
		const type = button.dataset.type;
		if (type && type.startsWith('extra-')) {
			const index = +type.slice(6) - 1;
			hints.value.extra?.splice(index, 1);
			return;
		}
		if (!isHintType(type)) return;
		const range = button.dataset.range;
		if (!range) {
			// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
			delete hints.value[type];
			return;
		}
		if (type !== 'indicators' && type !== 'fodder') return;
		if (!hints.value[type]) return;
		hints.value[type].ranges = hints.value[type].ranges.filter(r => r.join(';') !== range);
	}
</script>

<template>
	<main :class="`step-${step}`">
		<Back />
		<h1>Créer une énigme</h1>
		<h2 v-if="step === 'write'">1. Énigme et solution</h2>
		<h2 v-else-if="step === 'hints'">2. Indices</h2>
		<h2 v-else-if="step === 'meta'">3. Informations supplémentaires</h2>
		<h2 v-else-if="step === 'success'">Succès</h2>
		<form action="/api/clue" method="POST" @submit.prevent="onSubmit">
			<div class="clue">
				<label class="content-wrapper">
					<inline-input name="content" class="content" placeholder="Tapez votre énigme ici" :readonly="step !== 'write'" @input="content = $event.target.value" @selectionchange="onContentSelectionChange" />
					<span class="length">{{ len }}</span>
				</label>
				<hr>
				<label class="answer-wrapper" :inert="step !== 'write'">Réponse: <input v-model="answer" type="text" name="answer" class="answer" autocapitalize="off" :readonly="step !== 'write'"></label>
			</div>
			<input type="hidden" name="hints" :value="JSON.stringify(hints)">
			<div class="meta-fields" :class="{ visible: step === 'meta' }">
				<label>Nom d'auteur : <input v-model="author" type="text" name="author"></label>
				<label><input v-model="nsfw" type="checkbox" name="nsfw"> Cette énigme contient du contenu explicite ou pouvant choquer certaines personnes</label>
			</div>
			<template v-if="step === 'write'">
				<div class="buttons">
					<button type="button" class="next" :disabled="!content || !answer" @click="goToHints">Continuer</button>
				</div>
			</template>
			<template v-else-if="step === 'hints'">
				<div class="hints">
					<div class="add">
						<div class="selection">{{ selection?.content }}</div>
						<div class="hintsButtons">
							<button type="button" data-type="definition" :disabled="!selection" @click="addHint">définition</button>
							<button type="button" data-type="indicators" :disabled="!selection" @click="addHint">indicateur</button>
							<button type="button" data-type="fodder" :disabled="!selection" @click="addHint">matière</button>
							<button type="button" data-type="altDefinition" :disabled="!selection" @click="addHint">double déf.</button>
							<button type="button" data-type="extra" :class="`extra-${(hints.extra?.length || 0) + 1}`" @click="addHint">extra</button>
						</div>
					</div>
					<div class="answer visible">
						<label>
							Explication de la réponse :<br>
							<textarea v-model="hints.answer" placeholder="Indiquez ici en détails les étapes nécessaires pour arriver à la réponse, ainsi que toutes les clarifications nécessaires." />
						</label>
					</div>
					<div class="hint definition" :class="{ visible: hints.definition }">
						<template v-if="!hints.definition">Définition non-sélectionnée.</template>
						<template v-else>
							{{ hints.altDefinition ? 'Une' : 'La' }} définition est
							<code>
								{{ extractRange(content, hints.definition.range) }}
								<button type="button" class="remove" title="Supprimer" data-type="definition" @click="removeHint" />
							</code>
							<input v-model="hints.definition.note" type="text" class="note" placeholder="Notes additionelles (facultatif)">
							<div v-if="sideDefinitionWarning" class="warning">
								<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm330.5-51.5Q520-263 520-280t-11.5-28.5Q497-320 480-320t-28.5 11.5Q440-297 440-280t11.5 28.5Q463-240 480-240t28.5-11.5ZM440-360h80v-200h-80v200Zm40-100Z"/></svg>
								Cette définition n'est pas au tout début ou à la toute fin de l'énigme, ce qui n'est pas standard.
							</div>
						</template>
					</div>
					<div class="hint alt-definition" :class="{ visible: hints.altDefinition }">
						<template v-if="!hints.altDefinition">Pas de double définition.</template>
						<template v-else>
							L'autre définition est
							<code>
								{{ extractRange(content, hints.altDefinition.range) }}
								<button type="button" class="remove" title="Supprimer" data-type="altDefinition" @click="removeHint" />
							</code>
							<input v-model="hints.altDefinition.note" type="text" class="note" placeholder="Notes additionelles (facultatif)">
						</template>
					</div>
					<div class="hint indicators" :class="{ visible: hints.indicators?.ranges?.length }">
						<template v-if="!hints.indicators?.ranges?.length">Pas d'indicateur.</template>
						<template v-else>
							{{ hints.indicators.ranges.length > 1 ? 'Les indicateurs sont' : 'L\'indicateur est' }}
							<code v-for="range in hints.indicators.ranges" :key="range.join(';')">
								{{ extractRange(content, range) }}
								<button type="button" class="remove" title="Supprimer" data-type="indicators" :data-range="range.join(';')" @click="removeHint" />
							</code>
							<input v-model="hints.indicators.note" type="text" class="note" placeholder="Notes additionelles (facultatif)">
						</template>
					</div>
					<div class="hint fodder" :class="{ visible: hints.fodder?.ranges?.length }">
						<template v-if="!hints.fodder?.ranges?.length">Pas de matière.</template>
						<template v-else>
							La matière est
							<code v-for="range in hints.fodder.ranges" :key="range.join(';')">
								{{ extractRange(content, range) }}
								<button type="button" class="remove" title="Supprimer" data-type="fodder" :data-range="range.join(';')" @click="removeHint" />
							</code>
							<br>
							<input v-model="hints.fodder.note" type="text" class="note" placeholder="Notes additionelles (facultatif)">
						</template>
					</div>
					<div v-for="(extra, i) in hints.extra || []" :key="`extra-${i}`" :class="`hint extra extra-${i + 1} visible`">
						<label>
							Type d'indice : <input v-model="extra.name" type="text" class="name" :placeholder="`extra ${i + 1}`">
							<button type="button" class="remove" title="Supprimer" :data-type="`extra-${i + 1}`" @click="removeHint" />
						</label>
						<code v-if="extra.range">{{ extractRange(content, extra.range) }}</code>
						<input v-model="extra.content" type="text" class="note" placeholder="Texte de l'indice">
					</div>
				</div>
				<div class="buttons">
					<button type="button" class="prev" @click="goToWrite">Retour</button>
					<button type="button" class="next" :disabled="!hints.definition || !hints.answer" @click="goToMeta">Continuer</button>
				</div>
				<div v-if="!hints.definition || !hints.answer" class="info">Ajoutez une définition et une explication de la réponse pour continuer.</div>
			</template>
			<template v-if="step === 'meta'">
				<div class="buttons">
					<button type="button" class="prev" @click="goToHints">Retour</button>
					<button type="submit" class="next">Créer</button>
				</div>
			</template>
			<template v-if="step === 'success' && clueId">
				<p>Vous avez créé votre énigme avec succès !</p>
				<p>Vous pouvez la partager, et elle sera peut-être sélectionnée pour apparaître sur la page d'accueil.</p>
				<NuxtLink :to="{ name: 'enigme-id', params: { id: clueId } }" class="play">Voir l'énigme</NuxtLink>
			</template>
		</form>
	</main>
</template>

<style scoped>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 48px 16px;
	}
	h2 {
		transition: opacity .3s, translate .3s;
		@starting-style {
			opacity: 0;
			translate: 16px 0;
		}
	}
	@keyframes caret-blink { 50%, to { border-inline-start-color: var(--text); } }
	.clue {
		padding: 16px;
		border: 4px double var(--light);
		border-radius: 12px;
		corner-shape: bevel;
		background: var(--background);
		.step-success & { display: none; }
		label {
			display: block;
		}
		.content-wrapper {
			font-size: 1.25rem;
		}
		.content {
			padding: 0 2px;
			outline: none;
			&:empty {
				&::before {
					content: attr(placeholder);
					user-select: none;
					color: color-mix(var(--text) 75%, transparent);
					border-inline-start: 1px solid transparent;
					transition: opacity .15s;
				}
				/* Fake caret: in chrome, the caret doesn't show on empty inline elements */
				&:focus-within::before { color: color-mix(var(--text) 25%, transparent); animation: caret-blink 1s step-end infinite; }
			}
		}
		.length::before { content: ' '; }
		hr {
			/* margin: 16px -16px -16px; */
			margin: 16px -16px;
			border: none;
			/* border-top: 0 solid transparent; */
			border-top: 1px solid var(--light);
			transition: border-width .2s, margin .2s, border-color .2s;
			/* .step-write & { margin-block: 16px; border-top-width: 1px; border-color: var(--light); } */
		}
		.answer-wrapper {
			overflow: clip;
			interpolate-size: allow-keywords;
			/* height: 0; */
			/* visibility: hidden; */
			transition: padding-top .2s, margin-top .2s, border-top .2s, height .2s, visibility .2s;
			@media (prefers-reduced-motion: reduce) {
				transition: none;
			}
			/* .step-write & { height: auto; visibility: inherit; } */
		}
		.answer {
			field-sizing: content;
			min-width: 1ch;
			max-width: 100%;
			background: none;
			color: currentColor;
			border: none;
			border-bottom: 1px solid color-mix(var(--light), transparent 50%);
			font: inherit;
			font-size: 1.25rem;
			outline: none;
			text-transform: lowercase;
			&:focus {
				border-color: var(--light);
			}
		}
	}
	.hints {
		margin: 16px 0;
		padding: 16px;
		border: 1px solid var(--light-border);
		border-radius: 8px;
		.selection:empty::before {
			content: 'Sélectionnez une partie de l\'énigme ci-dessus pour ajouter un indice.';
			opacity: 0.75;
		}
		.answer, .hint {
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
			&.visible {
				padding-top: 16px;
				margin-top: 16px;
				border-top: 1px solid var(--light-border);
				height: auto;
			}
			&.definition { --highlight: var(--definition); }
			&.alt-definition { --highlight: var(--definition); }
			&.indicators { --highlight: var(--hint-2); }
			&.fodder { --highlight: var(--hint-1); }
			&.extra { --highlight: var(--hint-3); }
			&.extra-1 { --highlight: var(--hint-4); }
			&.extra-2 { --highlight: var(--hint-5); }
			&.extra-3 { --highlight: var(--hint-7); }
		}
		.hint.extra {
			@starting-style {
				height: 0;
				border-top: 0 solid transparent;
				margin: 0 -16px;
				padding: 0 16px;
			}
			> label {
				display: block;
				margin: 0 0 4px;
			}
			.name {
				padding: 2px 0;
				background: transparent;
				color: currentColor;
				font: inherit;
				border: none;
				border-bottom: 1px solid var(--light-border);
				outline: none;
				&:focus {
					border-bottom-color: var(--color-primary);
				}
			}
			.remove {
				display: inline-block;
				width: 16px;
				height: 16px;
				margin: 0 4px;
				vertical-align: middle;
				color: #fff;
				background:
					linear-gradient(45deg, transparent calc(50% - 1px), currentColor 50%, transparent calc(50% + 1px)) center / 50% 50% no-repeat,
					linear-gradient(-45deg, transparent calc(50% - 1px), currentColor 50%, transparent calc(50% + 1px)) center / 50% 50% no-repeat,
					#e74c3c;
				border: none;
				border-radius: 4px;
				font-size: .8rem;
				&:hover, &:focus-visible {
					background-color: #c0392b;
				}
			}
		}
		code {
			font-family: inherit;
			background: var(--highlight);
			padding: 2px 4px;
			margin: 0 2px;
			border-radius: 4px;
			font-size: .9em;
			text-transform: lowercase;
			.remove {
				display: inline-block;
				width: 12px;
				height: 12px;
				color: #e74c3c;
				background:
					linear-gradient(45deg, transparent calc(50% - 1px), currentColor 50%, transparent calc(50% + 1px)) center / 50% 50% no-repeat,
					linear-gradient(-45deg, transparent calc(50% - 1px), currentColor 50%, transparent calc(50% + 1px)) center / 50% 50% no-repeat;
				vertical-align: middle;
			}
		}
		.answer textarea {
			width: 100%;
			margin: 4px 0 0;
			padding: 0 0 0 8px;
			background: none;
			color: currentColor;
			font: inherit;
			border: none;
			border-left: 1px solid var(--light-border);
			outline: none;
			&:focus {
				border-left-color: var(--color-primary);
			}
			@supports (field-sizing: content) {
				field-sizing: content;
				resize: none;
			}
		}
		.warning {
			margin: 4px 0;
			font-size: .9rem;
			svg { height: 20px; width: auto; color: #f1c40f; display: inline-block; vertical-align: text-bottom; }
		}
		.note {
			display: block;
			width: 100%;
			margin: 4px 0;
			padding: 2px 0;
			background: transparent;
			color: currentColor;
			font: inherit;
			border: none;
			border-bottom: 1px solid var(--light-border);
			outline: none;
			&:focus {
				border-bottom-color: var(--color-primary);
			}
		}
	}
	.hintsButtons {
		display: flex;
		flex-flow: row wrap;
		gap: 4px;
		margin: 4px 0;
		button {
			padding: 2px 8px;
			background: var(--highlight);
			border-radius: 8px;
			font-size: .9rem;
			transition: filter .2s;
			&[data-type="definition"] { --highlight: var(--definition); }
			&[data-type="altDefinition"] { --highlight: var(--definition); }
			&[data-type="indicators"] { --highlight: var(--hint-2); }
			&[data-type="fodder"] { --highlight: var(--hint-1); }
			&[data-type="extra"] { --highlight: var(--hint-3); }
			&[data-type="extra"].extra-1 { --highlight: var(--hint-4); }
			&[data-type="extra"].extra-2 { --highlight: var(--hint-5); }
			&[data-type="extra"].extra-3 { --highlight: var(--hint-7); }
			&:disabled {
				cursor: default;
				filter: grayscale(100%);
			}
		}
	}
	.clue:has(~ .hints .hintsButtons [data-type="definition"]:is(:hover, :focus-visible)) .content::selection { background: var(--definition); }
	.clue:has(~ .hints .hintsButtons [data-type="altDefinition"]:is(:hover, :focus-visible)) .content::selection { background: var(--definition); }
	.clue:has(~ .hints .hintsButtons [data-type="indicators"]:is(:hover, :focus-visible)) .content::selection { background: var(--hint-2); }
	.clue:has(~ .hints .hintsButtons [data-type="fodder"]:is(:hover, :focus-visible)) .content::selection { background: var(--hint-1); }
	.clue:has(~ .hints .hintsButtons [data-type="extra"]:is(:hover, :focus-visible)) .content::selection { background: var(--hint-3); }
	.clue:has(~ .hints .hintsButtons [data-type="extra"].extra-1:is(:hover, :focus-visible)) .content::selection { background: var(--hint-4); }
	.clue:has(~ .hints .hintsButtons [data-type="extra"].extra-2:is(:hover, :focus-visible)) .content::selection { background: var(--hint-5); }
	.clue:has(~ .hints .hintsButtons [data-type="extra"].extra-3:is(:hover, :focus-visible)) .content::selection { background: var(--hint-7); }
	.meta-fields {
		display: none;
		flex-flow: column nowrap;
		gap: 8px;
		margin: 16px 0;
		&.visible { display: flex; }
		label {
			display: block;
		}
		input { accent-color: var(--color-primary); }
		input[type="text"] {
			padding: 2px 0;
			background: transparent;
			color: currentColor;
			font: inherit;
			border: none;
			border-bottom: 1px solid var(--light-border);
			outline: none;
			&:focus {
				border-bottom-color: var(--color-primary);
			}
		}
		input[type="checkbox"] { margin-inline-end: 4px; }
	}
	.buttons {
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		align-items: center;
		gap: 16px;
		margin: 16px auto;
	}
	.prev, .next {
		position: relative;
		padding: 8px 16px;
		border: 1px solid var(--light-border);
		border-radius: 8px;
		transition: border-color .15s;
		&:not(:disabled):is(:hover, :focus-visible) {
			border-color: var(--color-primary);
		}
		&:disabled { opacity: 0.5; cursor: default; }
	}
	.info {
		text-align: center;
		font-size: .9rem;
		color: var(--light);
	}
	@keyframes error-shake {
		from, to { translate: 0; }
		20%, 60% { translate: 5px 0; }
		40%, 80% { translate: -5px 0; }
	}
	@keyframes error-color {
		from, 50% { color: #e74c3c; border-color: #e74c3c }
	}
	.error button[type="submit"] {
		animation: error-shake .3s, error-color .6s;
	}
	.play {
		position: relative;
		display: block;
		width: fit-content;
		margin: 0 auto;
		padding: 8px 16px;
		border: 1px solid var(--light-border);
		border-radius: 8px;
		transition: border-color .15s, background-color .15s;
		&:hover, &:focus-visible {
			border-color: var(--color-primary-bright);
			background-color: color-mix(in srgb, var(--color-primary-bright) 10%, var(--background));
		}
	}
</style>