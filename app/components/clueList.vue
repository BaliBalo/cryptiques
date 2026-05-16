<script setup lang="ts">
	import { displayPercentage } from '~/utils/displayPercentage';
	import { getLocalSolves, type SolveDetails } from '~/utils/localSolves';

	const { loggedIn } = useUserSession();

	const options = useCookie('cryptiques-list-options', {
		default: () => ({
			order: 'new',
			nsfw: false,
			solved: true,
		}),
		maxAge: 60 * 60 * 24 * 365,
		sameSite: true,
	});

	const search = ref('');
	const offset = ref(0);

	const orderRef = computed(() => options.value.order);
	const nsfwRef = computed(() => options.value.nsfw);
	const solvedRef = computed(() => options.value.solved);

	watch([search, orderRef, nsfwRef, solvedRef], () => {
		offset.value = 0;
	});

	const { data, pending, error } = await useFetch('/api/clues', {
		query: {
			offset,
			search,
			order: orderRef,
			nsfw: nsfwRef,
			solved: solvedRef,
		},
	});

	const localSolves = ref<{ [id: string]: SolveDetails }>({});

	onMounted(() => {
		localSolves.value = getLocalSolves();
	});
</script>

<template>
	<div class="wrapper">
		<div class="filters">
			<!-- <label class="search">
				<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
					<path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
				</svg>
				<input v-model="search" type="text" placeholder="Rechercher une énigme...">
			</label> -->
			<label class="sort">
				<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" aria-hidden="true">
					<path d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z" />
				</svg>
				<select v-model="options.order" aria-label="Ordre des résultats">
					<option value="new">Plus récentes</option>
					<option value="solves">Plus résolues</option>
					<option value="rating">Mieux notées</option>
					<option value="difficulty">Plus difficiles</option>
				</select>
			</label>
			<button type="button" class="extra" popovertarget="list-extra-options" aria-label="Options supplémentaires">
				<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
					<path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
				</svg>
			</button>
			<div id="list-extra-options" popover>
				<label>
					<input v-model="options.nsfw" type="checkbox">
					Contenu explicite
				</label>
				<label v-if="loggedIn">
					<input v-model="options.solved" type="checkbox">
					Énigmes résolues
				</label>
			</div>
		</div>
		<div class="clues">
			<template v-if="error">
				<div class="error">Une erreur est survenue lors du chargement des énigmes.</div>
			</template>
			<template v-else>
				<div class="header">
					<div class="content">Énigme</div>
					<!-- <div class="author">Par</div> -->
					<div class="solves">
						<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
							<title>Nombre de résolutions</title>
							<path d="M280-120v-80h160v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80v-80h400v80h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h160v80H280Zm0-408v-152h-80v40q0 38 22 68.5t58 43.5Zm285 93q35-35 35-85v-240H360v240q0 50 35 85t85 35q50 0 85-35Zm115-93q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z" />
						</svg>
					</div>
					<div class="score">
						<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
							<title>Satisfaction</title>
							<path d="M80-400q-33 0-56.5-23.5T0-480v-240q0-12 5-23t13-19l198-198 30 30q6 6 10 15.5t4 18.5v8l-28 128h208q17 0 28.5 11.5T480-720v50q0 6-1 11.5t-3 10.5l-90 212q-7 17-22.5 26.5T330-400H80Zm238-80 82-194v-6H134l24-108-78 76v232h238ZM744 0l-30-30q-6-6-10-15.5T700-64v-8l28-128H520q-17 0-28.5-11.5T480-240v-50q0-6 1-11.5t3-10.5l90-212q8-17 23-26.5t33-9.5h250q33 0 56.5 23.5T960-480v240q0 12-4.5 22.5T942-198L744 0ZM642-480l-82 194v6h266l-24 108 78-76v-232H642Zm-562 0v-232 232Zm800 0v232-232Z" />
						</svg>
					</div>
					<div class="difficulty">
						<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
							<title>Difficulté</title>
							<path d="M277-285q-69-26-113-86.5T120-510q0-79 37.5-140.5T240-754q45-42 82.5-64l37.5-22v99q0 25 18 42.5t43 17.5q14 0 26-6t20-17l13-16q38 22 65 54t41 72l-67 67q-2-24-11.5-47T482-616q-14 8-29.5 11.5T421-601q-44 0-79.5-24.5T290-691q-38 37-64 82.5T200-510q0 31 11 58.5t30 48.5q2-20 11.5-37.5T276-472l84-84 86 84q2 2 4 5t4 5l-57 57q-2-3-3.5-5t-3.5-4l-30-29-28 28q-5 5-8.5 11.5T320-389q0 12 7 21.5t18 14.5l-68 68Zm83-271Zm0 0ZM296-80l-56-56 544-544 56 56-144 144h144v80H616l-20 20 60 60h184v80H736l84 84-56 56-84-84v104h-80v-184l-60-60-20 20v224h-80v-144L296-80Z" />
						</svg>
					</div>
				</div>
				<template v-if="pending">
					<div class="loading">Chargement...</div>
				</template>
				<div v-else-if="data?.list.length === 0" class="empty">
					Aucune énigme trouvée.
				</div>
				<template v-else>
					<NuxtLink v-for="clue in data?.list || []" :key="clue.id" :to="{ name: 'enigme-id', params: { id: clue.id } }" :class="{ clue: true, solved: clue.solved || (clue.id in localSolves) }">
						<div class="content">{{ clue.clue }}</div>
						<!-- <div class="author" :title="clue.author">{{ clue.author }}</div> -->
						<div class="solves">{{ clue.solves.toLocaleString() }}</div>
						<div class="score">
							<div
								class="scoreBar"
								:style="{ '--up': clue.upvotes, '--down': clue.downvotes }"
								:title="`${displayPercentage((clue.upvotes + 1) / (clue.upvotes + clue.downvotes + 2))} (${clue.upvotes.toLocaleString('fr-FR')} / ${clue.downvotes.toLocaleString('fr-FR')})`"
							/>
						</div>
						<div class="difficulty">
							<Thermometer :p="clue.difficulty" :title="displayPercentage(clue.difficulty)" />
						</div>
					</NuxtLink>
					<div class="pagination">
						<button v-if="offset > 0" type="button" @click="offset = Math.max(0, offset - (data?.list.length || 1))">Précédent</button>
						<button v-if="data?.hasMore" type="button" @click="offset += data?.list.length || 1">Suivant</button>
					</div>
				</template>
			</template>
		</div>
	</div>
</template>

<style scoped>
	.filters {
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		justify-content: end;
		gap: 8px;
	}
	.search {
		flex: 0 1 auto;
		display: flex;
		flex-flow: row nowrap;
		gap: 8px;
		align-items: center;
		transition: flex-grow .3s;
		svg {
			flex: 0 0 auto;
			cursor: pointer;
		}
		input {
			flex: 1 1 0;
			width: 0;
			padding: 8px 0;
			background: transparent;
			color: currentColor;
			font: inherit;
			border: none;
			border-bottom: 1px solid var(--light-border);
			outline: none;
		}
		&:focus-within {
			flex-grow: 1;
			input { padding-inline: 8px; }
		}
	}
	.sort {
		flex: 0 0 auto;
		position: relative;
		select {
			appearance: none;
			background: transparent;
			color: currentColor;
			font: inherit;
			padding: 8px 8px 8px 40px;
			border: 1px solid var(--light-border);
			border-radius: 8px;
			cursor: pointer;
			&::picker {
				border-radius: 8px;
			}
		}
		option {
			background: var(--background);
			color: var(--text);
		}
		svg {
			position: absolute;
			top: 50%;
			left: 8px;
			translate: 0 -50%;
			pointer-events: none;
		}
	}
	.extra {
		flex: 0 0 auto;
		svg { transition: rotate .2s; }
	}
	#list-extra-options {
		margin: 8px 0;
		inset: auto;
		position-area: bottom span-left;
		display: flex;
		flex-flow: column nowrap;
		gap: 8px;
		padding: 16px;
		background: var(--background);
		color: var(--text);
		border: 1px solid var(--light-border);
		border-radius: 8px;
		transition: display .15s allow-discrete, overlay .15s allow-discrete, translate .15s, opacity .15s;
		@media (prefers-reduced-motion: reduce) {
			transition: none;
		}
		@starting-style {
			translate: 0 -8px;
			opacity: 0;
			&::backdrop { opacity: 0; }
		}
		&:not(:popover-open) {
			display: none;
			translate: 0 -8px;
			opacity: 0;
			&::backdrop { opacity: 0; }
		}
		label {
			display: flex;
			flex-flow: row nowrap;
			align-items: center;
			gap: 8px;
		}
		input { accent-color: var(--color-primary); }
	}
	.wrapper:has(#list-extra-options:popover-open) .extra svg {
		rotate: 45deg;
	}
	.clues {
		display: grid;
		grid-template-columns: 1fr auto auto auto;
		gap: 0 16px;
		margin-top: 8px;
	}
	.header, .error, .loading, .empty, .clue, .pagination {
		grid-column: 1 / -1;
		padding: 8px 0;
	}
	.error, .loading, .empty {
		text-align: center;
		color: var(--note);
	}
	.header, .clue {
		display: grid;
		grid-template-columns: subgrid;
		align-items: center;
		border-bottom: 1px solid var(--light-border);
	}
	.header {
		position: sticky;
		top: 0;
		background: var(--background);
		font-weight: bold;
	}
	.clue {
		&.solved .solves {
			color: var(--color-primary);
		}
		&:hover {
			background: color-mix(currentColor, var(--background) 95%);
			/* background: var(--light-border); */
			/* border-bottom-color: currentColor; */
		}
	}
	/* .author {
		max-width: 120px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	} */
	.solves, .score, .difficulty {
		text-align: center;
		place-content: center;
		svg { margin: 0 auto; }
	}
	.scoreBar {
		--color-upvote: #2ecc71;
		--color-downvote: #e74c3c;
		--color-uncertainty: #bbb;
		width: 3rem;
		height: .5rem;
		border-radius: 2px;
		--k: 1;
		background:
			linear-gradient(var(--color-upvote) 0 0) left center / round(down, 100% * (var(--up)) / (var(--up) + var(--down) + 2 * var(--k)), 1px) 100% no-repeat,
			linear-gradient(var(--color-downvote) 0 0) right center / round(down, 100% * (var(--down)) / (var(--up) + var(--down) + 2 * var(--k)), 1px) 100% no-repeat,
			/* linear-gradient(
				to right,
				color-mix(var(--color-upvote), transparent 75%) calc(100% * (var(--up) + var(--k)) / (var(--up) + var(--down) + 2 * var(--k))),
				color-mix(var(--color-downvote), transparent 75%) 0
			) center, */
			var(--color-uncertainty);
		@media (prefers-color-scheme: dark) {
			--color-uncertainty: #444;
		}
	}
	.clue .difficulty svg { width: 32px; height: auto; }
	.pagination {
		display: flex;
		flex-flow: row wrap;
		justify-content: center;
		gap: 8px;
		button {
			padding: 8px;
			border: 1px solid var(--light-border);
			border-radius: 8px;
			&:not(:disabled):hover { border-color: currentColor; }
			&:disabled { opacity: 0.5; cursor: default; }
		}
	}
</style>