<script setup lang="ts">
	import { isSeparator } from '~/utils/answerLength';
	import { removeDiacritics } from '~/utils/removeDiacritics';
	import { getLocalSolves, saveSolveLocally } from '~/utils/localSolves';
	import { startTimer } from '~/utils/visibleTimer';

	const route = useRoute('enigme-id');
	const { loggedIn } = useUserSession();

	const { data: clue, pending, error } = await useFetch('/api/clue', {
		query: { id: route.params.id },
	});

	if (error.value) {
		throw createError({
			statusCode: error.value.statusCode || 500,
			message: error.value.message || 'An error occurred while fetching the clue.',
		});
	}

	useHead({
		title: 'Cryptiques',
		htmlAttrs: { class: 'page-clue' },
		meta: [
			{
				name: 'description',
				content: clue.value?.content,
			},
		],
	});

	let timer: ReturnType<typeof startTimer> | null = null;
	const hintsShown = ref<{ [key: string]: boolean }>({});
	const solved = ref(!!clue.value?.solved);
	const qualityVote = ref<null | boolean>(clue.value?.qualityVote ?? null);
	const difficultyVote = ref<null | number>(clue.value?.difficultyVote ?? null);
	const words = computed(() => clue.value?.answer.split(/([ -])/g).map((word, i, all) => ({ letters: word.split(''), offset: all.slice(0, i).reduce((s, w) => s + w.length, 0) })) || []);
	const chars = (clue.value?.answer || '').split('');
	const answer = ref(clue.value?.solved ? chars : chars.fill(''));
	const confetti = ref<{ id: string, color: number, x: number, y: number, angle: number, velocity: number, rotX: number, rotZ: number, duration: number, delay: number }[]>([]);

	function check(e: SubmitEvent) {
		if (solved.value) return;
		const actualAnswer = removeDiacritics(clue.value?.answer?.toLowerCase() || '');
		const valid = answer.value.every((letter, index) => {
			const desired = actualAnswer[index] || '';
			if (isSeparator(desired)) return true;
			// TOOD: strip accents, ignore case, etc.
			return removeDiacritics(letter.toLowerCase()) === desired;
		});
		if (!valid) {
			const form = e.currentTarget;
			if (form instanceof HTMLFormElement) {
				form.classList.remove('invalid');
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				form.clientWidth;
				form.classList.add('invalid');
			}
			return;
		}
		solve();
	}

	function onShowHint(type: string) {
		hintsShown.value[type] = true;
	}

	function offsetFrom<T>(list: T[], item: T, amount = 1) {
		const index = list.indexOf(item);
		return index === -1 ? null : list[index + amount];
	};

	const nextInput = (input: HTMLInputElement) => offsetFrom([...input.closest('.answer')?.querySelectorAll('input') || []], input, 1);
	const prevInput = (input: HTMLInputElement) => offsetFrom([...input.closest('.answer')?.querySelectorAll('input') || []], input, -1);
	const firstInput = (input: HTMLInputElement) => input.closest('.answer')?.querySelector('input');
	const lastInput = (input: HTMLInputElement) => [...input.closest('.answer')?.querySelectorAll('input') || []].at(-1);
	const startOfWord = (input: HTMLInputElement) => input.closest('.word')?.querySelector('input');
	const endOfWord = (input: HTMLInputElement) => [...input.closest('.word')?.querySelectorAll('input') || []].at(-1);

	function onLetterSelectionChange(e: FocusEvent) {
		const input = e.currentTarget;
		if (input instanceof HTMLInputElement && document.activeElement === input) {
			input.select();
		}
	}

	function onLetterKeyDown(e: KeyboardEvent) {
		const input = e.currentTarget;
		if (!(input instanceof HTMLInputElement)) return;
		if (e.key === 'Backspace' && input.value === '') {
			prevInput(input)?.focus();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			let goTo: HTMLInputElement | null | undefined;
			if (e.ctrlKey || e.altKey) {
				goTo = startOfWord(input);
				if (goTo === input) goTo = prevInput(goTo);
			} else {
				goTo = prevInput(input);
			}
			goTo?.focus();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			let goTo: HTMLInputElement | null | undefined;
			if (e.ctrlKey || e.altKey) {
				goTo = endOfWord(input);
				if (goTo === input) goTo = nextInput(goTo);
			} else {
				goTo = nextInput(input);
			}
			goTo?.focus();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			firstInput(input)?.focus();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			lastInput(input)?.focus();
		} else if (e.key === 'Tab') {
			// Go to first/last input, then let the browser default behavior switch to the next focusable element
			const goTo = e.shiftKey ? firstInput(input) : lastInput(input);
			goTo?.focus();
		} else if (isSeparator(e.key)) {
			const index = input.parentElement?.dataset.index;
			if (index && !Number.isNaN(+index) && e.key === clue.value?.answer[+index - 1]) {
				e.preventDefault();
			}
		}
	}

	function onLetterInput(event: InputEvent) {
		const target = event.currentTarget;
		if (!(target instanceof HTMLInputElement)) return;
		const index = target.parentElement?.dataset.index;
		if (!index || Number.isNaN(+index)) return;
		answer.value[+index] = target.value;
		if (target.value) {
			nextInput(target)?.focus();
		}
	}

	const rand = (min: number, max: number) => Math.random() * (max - min) + min;

	function solve(automatic = false) {
		solved.value = true;
		if (clue.value) {
			answer.value = clue.value.answer.split('');
		}
		if (!automatic) {
			saveSolve();
		}
		celebrate();
	}

	async function saveSolve() {
		if (!clue.value) return;
		const time = timer?.getTime();
		const seconds = time ? Math.round(time / 1000) : undefined;
		timer?.stop();
		timer = null;
		const hints = Object.keys(hintsShown.value).length;
		try {
			if (!loggedIn.value) {
				throw new Error('LOGGED_OUT');
			}
			await $fetch('/api/solves', {
				method: 'POST',
				body: { solves: { [clue.value.id]: { hints, time: seconds } } },
			});
		} catch {
			saveSolveLocally(clue.value.id, hints, time);
		}
	}

	function celebrate() {
		const answerEl = document.querySelector('.answer');
		const containerWidth = answerEl?.clientWidth || 0;
		const containerHeight = answerEl?.clientHeight || 0;
		const letters = [...document.querySelectorAll('.answer-letter')].map((l) => {
			if (!(l instanceof HTMLElement)) return null;
			return { x: { from: l.offsetLeft, size: l.offsetWidth }, y: { from: l.offsetTop, size: l.offsetHeight } };
		}).filter(e => !!e);
		confetti.value = [...Array(Math.max(50, 8 * letters.length))].map(() => {
			const letter = letters[Math.floor(rand(0, letters.length))]!;
			const x = (letter.x.from + 4) + Math.random() * (letter.x.size - 8);
			const y = (letter.y.from + 4) + Math.random() * (letter.y.size - 8);
			const baseA = Math.atan2(y / containerHeight - 0.75, x / containerWidth - 0.5);
			return {
				id: crypto.randomUUID(),
				color: rand(0, 360),
				x, y,
				angle: baseA + rand(-Math.PI / 4, Math.PI / 4),
				velocity: rand(30, 200),
				rotX: rand(-720, -360),
				rotZ: rand(360, 720),
				duration: rand(0.4, 0.7),
				delay: rand(0, 0.3),
			};
		});
	}

	function removeConfetti(e: AnimationEvent) {
		const element = e.currentTarget;
		if (!(element instanceof HTMLElement)) {
			return;
		}
		const id = element.dataset.id;
		confetti.value = confetti.value.filter(c => c.id !== id);
	}

	watch(qualityVote, async (newValue) => {
		await $fetch('/api/vote', {
			method: 'POST',
			body: {
				clue: route.params.id,
				type: 'quality',
				like: newValue,
			},
		});
	});
	watch(difficultyVote, async (newValue) => {
		await $fetch('/api/vote', {
			method: 'POST',
			body: {
				clue: route.params.id,
				type: 'difficulty',
				difficulty: newValue,
			},
		});
	});

	onMounted(() => {
		if (clue.value?.solved || getLocalSolves()[route.params.id]) {
			solve(true);
		} else {
			timer = startTimer();
		}
	});
</script>

<template>
	<main>
		<Back />
		<p v-if="pending">Chargement de l'énigme...</p>
		<form v-else-if="clue" :class="{ solved }" @submit.prevent="check">
			<Clue
				:answer="clue.answer"
				:hints="clue.hints"
				@show-hint="onShowHint"
			>
				{{ clue.content }}
			</Clue>
			<div class="answer">
				<span v-for="word in words" :key="word.offset" class="word">
					<template v-for="(letter, index) in word.letters">
						<span v-if="isSeparator(letter)" :key="`sep-${index}`" class="answer-sep">{{ letter }}</span>
						<label v-else :key="`letter-${index}`" class="answer-letter" :data-index="word.offset + index">
							<span class="display">{{ answer[word.offset + index] || '' }}</span>
							<input
								type="text"
								autocomplete="off"
								autocapitalize="none"
								maxlength="1"
								:autofocus="index === 0"
								:name="`letter-${index}`"
								:disabled="solved"
								@selectionchange="onLetterSelectionChange"
								@keydown="onLetterKeyDown"
								@dragstart.prevent
								@input="onLetterInput"
							>
						</label>
					</template>
				</span>
				<div
					v-for="e in confetti"
					:key="e.id"
					class="confetti"
					:data-id="e.id"
					:style="{ '--color': e.color, left: `${e.x}px`, top: `${e.y}px`, '--angle': e.angle, '--vel': e.velocity, '--rotX': e.rotX, '--rotZ': e.rotZ, '--duration': e.duration, '--delay': e.delay }"
					@animationend="removeConfetti"
				/>
			</div>
			<div class="buttons">
				<button type="submit">Vérifier</button>
			</div>
			<div class="results">
				<p class="answer-notes">{{ clue.hints?.answer }}</p>
				<div class="congrats">Bravo !</div>
				<div v-if="loggedIn" class="vote">
					<p>
						Cette énigme était-elle de bonne qualité ?<br>
						<small>(ne votez pas négativement pour les énigmes trop faciles ou trop difficiles)</small>
					</p>
					<div class="options quality">
						<button type="button" :class="{ up: true, active: qualityVote === true }" @click="qualityVote = qualityVote === true ? null : true">
							<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px"><path d="M717.33-120H274.67v-514.67L553.33-920 596-882.67q6.33 5.67 9.83 15.67t3.5 22.33v11.34l-44.66 198.66H850q26.67 0 46.67 20t20 46.67v81.23q0 7.1.33 14.77t-2.33 14.67L790.67-170q-8.92 20.83-29.73 35.42Q740.13-120 717.33-120Zm-376-66.67H726l124-292.66V-568H481.33l53.34-239.33-193.34 200.66v420Zm0-420v420-420Zm-66.66-28V-568H146v381.33h128.67V-120H79.33v-514.67h195.34Z" /></svg>
						</button>
						<button type="button" :class="{ down: true, active: qualityVote === false }" @click="qualityVote = qualityVote === false ? null : false">
							<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px"><path d="M241.33-840H684v514.67L405.33-40l-42.66-37.33Q356.33-83 352.83-93t-3.5-22.33v-11.34L394-325.33H108.67q-26.67 0-46.67-20T42-392v-81.23q0-7.1-.33-14.77-.34-7.67 2.33-14.67L168-790q8.92-20.83 29.73-35.42Q218.54-840 241.33-840Zm376 66.67H232.67l-124 292.66V-392h368.66L424-152.67l193.33-200.66v-420Zm0 420v-420 420Zm66.67 28V-392h128.67v-381.33H684V-840h195.33v514.67H684Z" /></svg>
						</button>
					</div>
					<hr>
					<p>Quelle était la difficulté de cette énigme ?</p>
					<div class="options difficulty">
						<button type="button" data-label="Très facile" :class="{ active: difficultyVote === 0 }" @click="difficultyVote = difficultyVote === 0 ? null : 0"><Thermometer :p="0" /></button>
						<button type="button" data-label="Facile" :class="{ active: difficultyVote === 0.25 }" @click="difficultyVote = difficultyVote === 0.25 ? null : 0.25"><Thermometer :p=".25" /></button>
						<button type="button" data-label="Moyenne" :class="{ active: difficultyVote === 0.5 }" @click="difficultyVote = difficultyVote === 0.5 ? null : 0.5"><Thermometer :p=".5" /></button>
						<button type="button" data-label="Dure" :class="{ active: difficultyVote === 0.75 }" @click="difficultyVote = difficultyVote === 0.75 ? null : 0.75"><Thermometer :p=".75" /></button>
						<button type="button" data-label="Très dure" :class="{ active: difficultyVote === 1 }" @click="difficultyVote = difficultyVote === 1 ? null : 1"><Thermometer :p="1" /></button>
					</div>
				</div>
				<div v-else class="login-to-vote">
					<p><NuxtLink :to="{ name: 'connexion', query: { retour: route.fullPath } }">Connectez-vous</NuxtLink> pour donner votre avis sur cette énigme.</p>
				</div>
			</div>
		</form>
	</main>
</template>

<style scoped>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 48px 16px;
		overflow: hidden;
	}
	@keyframes clue-error-answer-shake {
		10%, 30%, 50%, 70%, 90% { translate: -6px 0; }
		20%, 40%, 60%, 80% { translate: 6px 0; }
	}
	@keyframes clue-error-answer-color {
		5%, 50% { color : #e74c3c; }
	}
	.answer {
		position: relative;
		display: block;
		margin: 24px 0;
		text-align: center;
		font-size: 1.5rem;
		font-weight: 600;
		line-height: 2.2;
	}
	.invalid .answer {
		animation: clue-error-answer-shake .75s, clue-error-answer-color 1s;
		@media (prefers-reduced-motion: reduce) {
			animation: clue-error-answer-color 1s;
		}
	}
	.word { display: inline-block; }
	.answer-letter, .answer-sep {
		line-height: normal;
		vertical-align: middle;
	}
	.answer-sep {
		padding: 0 .2em;
	}
	.answer-letter {
		position: relative;
		display: inline-block;
		width: 1.4lh;
		aspect-ratio: 1;
		background: var(--background);
		border: 2px solid;
		text-align: center;
		place-content: center;
		text-transform: lowercase;
		border-radius: 4px;
		z-index: 1;
		&:has(+ .answer-letter) { border-right-width: 1px; border-top-right-radius: 0; border-bottom-right-radius: 0; }
		+ .answer-letter { border-left-width: 1px; margin-left: -1px; border-top-left-radius: 0; border-bottom-left-radius: 0; }
		input {
			position: absolute;
			inset: 0;
			width: auto;
			height: auto;
			border: none;
			margin: 0;
			padding: 0;
			opacity: 0;
			cursor: default;
		}
		&:focus-within {
			background: oklch(var(--highlight-base) 135);
		}
	}
	.buttons {
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		gap: 16px;
		&:empty { display: none; }
		button {
			padding: 8px 16px;
			border: 1px solid var(--light-border);
			border-radius: 8px;
			transition: border-color .15s;
			&:hover { border-color: currentColor; }
		}
		button[type="submit"]:hover {
			border-color: var(--color-primary);
		}
	}
	@property --clue-confetti-time {
		syntax: '<number>';
		inherits: false;
		initial-value: 0;
	}
	@keyframes clue-confetti-time { to { --clue-confetti-time: 1; } }
	.confetti {
		position: absolute;
		width: 8px; height: 8px;
		margin: -4px 0 0 -4px;
		border-radius: 2px;
		background: oklch(.7 .2 var(--color, 0));
		--t: var(--clue-confetti-time);
		transform:
			translateX(calc(var(--t) * cos(var(--angle)) * var(--vel) * 1px))
			translateY(calc((var(--t) * sin(var(--angle)) * var(--vel) + var(--t) * var(--t) * 50) * 1px))
			rotateX(calc(var(--t) * var(--rotX) * 1deg))
			rotateZ(calc(var(--t) * var(--rotZ) * 1deg));
		opacity: calc(1 - var(--t) * var(--t));
		animation: clue-confetti-time calc(var(--duration, .5) * 1s) calc(var(--delay, 0) * 1s) linear both;
		pointer-events: none;
	}
	.results {
		display: none;
		transition: opacity .3s, translate .3s;
		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
		@starting-style {
			opacity: 0;
			translate: 0 16px;
		}
	}
	.solved {
		.buttons { display: none; }
		.results {
			display: block;
		}
	}
	.congrats {
		text-align: center;
		font-size: 1.5rem;
		font-weight: 600;
	}
	.answer-notes {
		white-space: pre-wrap;
		&::before {
			content: 'Détails :';
			display: block;
			text-decoration: underline wavy var(--light-border);
			margin-bottom: 4px;
		}
		&:empty { display: none; }
	}
	.vote, .login-to-vote {
		width: fit-content;
		margin: 16px auto;
		padding: 16px;
		text-align: center;
		border: 1px solid var(--light-border);
		border-radius: 8px;
		p { margin-bottom: 0; }
	}
	.login-to-vote {
		a {
			text-decoration: underline wavy color-mix(in srgb, currentColor, transparent 50%);
			transition: text-decoration-color .15s;
			&:hover, &:focus-visible {
				text-decoration-color: var(--color-primary);
			}
		}
	}
	.vote {
		small { opacity: 0.7; }
		hr {
			margin: 16px -16px;
			border: none;
			border-top: 1px solid var(--light-border);
		}
		.options {
			display: flex;
			flex-flow: row wrap;
			justify-content: center;
			gap: 0;
			margin-top: 4px;
			svg { max-width: none; }
			button {
				transition: opacity .15s, color .15s;
			}
			button[data-label] {
				position: relative;
				&::after {
					content: attr(data-label);
					position: absolute;
					inset: 100% auto auto 50%;
					white-space: nowrap;
					font-size: .75em;
					opacity: 0;
					visibility: hidden;
					translate: -50% -4px;
					transition: opacity .15s, visibility .15s, translate .15s;
				}
				&:is(:hover, :focus-visible)::after {
					opacity: 1;
					visibility: visible;
					translate: -50% 0;
				}
				@media (hover: none) {
					display: flex;
					flex-flow: column nowrap;
					align-items: center;
					&::after {
						position: relative;
						inset: 0;
						visibility: visible;
						opacity: 1;
						translate: 0 0;
					}
				}
			}
			&:has(button.active) button:not(.active) {
				opacity: 0.25;
			}
		}
		.options.quality {
			gap: 8px;
			.up:is(:hover, :focus-visible, .active) { color: #27ae60; }
			.down:is(:hover, :focus-visible, .active) { color: #c0392b; }
		}
		.options.difficulty {
			gap: 8px;
			@media (hover: hover) {
				gap: 0;
				button:not(:hover, :focus-visible, .active) {
					/* --inner-color: color-mix(currentColor, var(--background) 20%); */
					filter: grayscale(100%);
				}
			}
		}
	}
</style>