<script setup lang="ts">
	import { getAnswerLength } from '#shared/utils/answerLength';
	import { getLocalSolves } from '~/utils/localSolves';

	useHead({
		title: 'Cryptiques',
		htmlAttrs: { class: 'page-index' },
		meta: [
			{
				name: 'description',
				content: 'Un site pour les "cryptic crosswords" - mais en français !',
			},
		],
	});

	const { loggedIn } = useUserSession();

	const { data: clueOfTheDay } = useFetch('/api/clueOfTheDay');
	const clueOfTheDayLocalSolve = ref(false);
	const clueOfTheDaySolved = computed(() => clueOfTheDay.value?.solve || clueOfTheDayLocalSolve.value);

	onMounted(() => {
		if (clueOfTheDay.value) {
			const localSolves = getLocalSolves();
			clueOfTheDayLocalSolve.value = !!localSolves[clueOfTheDay.value.id];
		}
	});
</script>

<template>
	<div class="above">
		<header>
			<hgroup>
				<h1>Cryptiques</h1>
				<p>Un site pour les énigmes cryptiques françaises.</p>
			</hgroup>
			<div class="account">
				<NuxtLink v-if="loggedIn" to="/moi">Mon Profil</NuxtLink>
				<NuxtLink v-else to="/connexion">Connexion</NuxtLink>
			</div>
		</header>
		<main>
			<div class="top-split">
				<div class="guide-cta">
					<svg class="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M440-120v-80h320v-284q0-117-81.5-198.5T480-764q-117 0-198.5 81.5T200-484v244h-40q-33 0-56.5-23.5T80-320v-80q0-21 10.5-39.5T120-469l3-53q8-68 39.5-126t79-101q47.5-43 109-67T480-840q68 0 129 24t109 66.5Q766-707 797-649t40 126l3 52q19 9 29.5 27t10.5 38v92q0 20-10.5 38T840-249v49q0 33-23.5 56.5T760-120H440ZM331.5-411.5Q320-423 320-440t11.5-28.5Q343-480 360-480t28.5 11.5Q400-457 400-440t-11.5 28.5Q377-400 360-400t-28.5-11.5Zm240 0Q560-423 560-440t11.5-28.5Q583-480 600-480t28.5 11.5Q640-457 640-440t-11.5 28.5Q617-400 600-400t-28.5-11.5ZM241-462q-7-106 64-182t177-76q89 0 156.5 56.5T720-519q-91-1-167.5-49T435-698q-16 80-67.5 142.5T241-462Z" /></svg>
					<p>Nouveau aux cryptiques ou besoin d'un rappel ?</p>
					<NuxtLink to="/guide" class="guide">Suivez le guide</NuxtLink>
				</div>
				<div v-if="clueOfTheDay" class="clue-of-the-day">
					<svg class="icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" /></svg>
					<div class="intro">
						<p class="by">Énigme du jour par : {{ clueOfTheDay.authorName }}</p>
						<svg v-if="clueOfTheDaySolved" class="solved" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"><path d="M288-144v-72h156v-124q-42-8-77.5-33.5T313-434q-73-9-121-62.51T144-622v-26q0-29.7 21.15-50.85Q186.3-720 216-720h72v-96h384v96h72.21Q774-720 795-698.85T816-648v24q0 72-48 126.5T647-434q-18 35-53.5 60.5T516-340v124h156v72H288Zm0-372v-132h-72v24q0 37 19 65.5t53 42.5Zm277 73q35-35 35-85v-216H360v216q0 50 35 85t85 35q50 0 85-35Zm107-73q34-14 53-42.5t19-65.5v-24h-72v132Zm-192-59Z" /></svg>
					</div>
					<p class="content">{{ clueOfTheDay.content }} {{ getAnswerLength(clueOfTheDay.answer) }}</p>
					<NuxtLink :to="{ name: 'enigme-id', params: { id: clueOfTheDay.id } }" class="play">C'est parti !</NuxtLink>
				</div>
			</div>
			<ClueList />
		</main>
	</div>
	<footer>
		<ul>
			<li><NuxtLink to="/contact">Contact</NuxtLink></li>
			<li><NuxtLink to="/guide">Guide</NuxtLink></li>
			<li><NuxtLink to="/outils">Outils</NuxtLink></li>
			<li>
				<a href="https://github.com/BaliBalo/cryptiques" target="_blank" rel="noopener noreferrer">
					<svg height="24" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						<path d="M41.4395 69.3848C28.8066 67.8535 19.9062 58.7617 19.9062 46.9902C19.9062 42.2051 21.6289 37.0371 24.5 33.5918C23.2559 30.4336 23.4473 23.7344 24.8828 20.959C28.7109 20.4805 33.8789 22.4902 36.9414 25.2656C40.5781 24.1172 44.4062 23.543 49.0957 23.543C53.7852 23.543 57.6133 24.1172 61.0586 25.1699C64.0254 22.4902 69.2891 20.4805 73.1172 20.959C74.457 23.543 74.6484 30.2422 73.4043 33.4961C76.4668 37.1328 78.0937 42.0137 78.0937 46.9902C78.0937 58.7617 69.1934 67.6621 56.3691 69.2891C59.623 71.3945 61.8242 75.9883 61.8242 81.252L61.8242 91.2051C61.8242 94.0762 64.2168 95.7031 67.0879 94.5547C84.4102 87.9512 98 70.6289 98 49.1914C98 22.1074 75.9883 6.69539e-07 48.9043 4.309e-07C21.8203 1.92261e-07 -1.9479e-07 22.1074 -4.3343e-07 49.1914C-6.20631e-07 70.4375 13.4941 88.0469 31.6777 94.6504C34.2617 95.6074 36.75 93.8848 36.75 91.3008L36.75 83.6445C35.4102 84.2188 33.6875 84.6016 32.1562 84.6016C25.8398 84.6016 22.1074 81.1563 19.4277 74.7441C18.375 72.1602 17.2266 70.6289 15.0254 70.3418C13.877 70.2461 13.4941 69.7676 13.4941 69.1934C13.4941 68.0449 15.4082 67.1836 17.3223 67.1836C20.0977 67.1836 22.4902 68.9063 24.9785 72.4473C26.8926 75.2227 28.9023 76.4668 31.2949 76.4668C33.6875 76.4668 35.2187 75.6055 37.4199 73.4043C39.0469 71.7773 40.291 70.3418 41.4395 69.3848Z" />
					</svg>
					Code source
				</a>
			</li>
			<li><NuxtLink to="/a-propos">À propos</NuxtLink></li>
			<li><NuxtLink to="/politique-de-confidentialite">Politique de confidentialité</NuxtLink></li>
		</ul>
	</footer>
</template>

<style>
@property --index-transparency {
	syntax: '<percentage>';
	inherits: false;
	initial-value: 0%;
}
@property --index-angle {
	syntax: '<angle>';
	inherits: false;
	initial-value: 0deg;
}
@keyframes index-angle-spin { to { --index-angle: 1turn; } }
.page-index {
	.above {
		max-width: 800px;
		margin: 0 auto;
		padding: 48px 16px;
		min-height: 100lvh;
	}
	.account {
		position: absolute;
		top: 16px; right: 16px;
		a {
			text-decoration: underline wavy color-mix(in srgb, currentColor, transparent 50%);
			transition: text-decoration-color .15s;
			&:hover, &:focus-visible {
				text-decoration-color: var(--color-primary);
			}
		}
	}
	hgroup {
		h1 { margin-bottom: 0; }
		p { font-size: .9em; opacity: 0.75; }
	}
	.top-split {
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		justify-content: center;
		gap: 32px;
		margin-bottom: 32px;
	}
	.guide-cta, .clue-of-the-day {
		flex: 1 1 calc(50% - 16px);
		min-width: min(250px, 100%);
		position: relative;
		padding: 16px;
		border: 2px solid var(--light-border);
		border-radius: 16px;
		background: var(--background);
		&:first-child:last-child { flex-grow: 0; }
		.icon {
			position: absolute;
			top: -10px;
			left: -10px;
			background: var(--background);
			border-radius: 50%;
		}
		p { margin-bottom: 16px; }
		@supports (corner-shape: scoop) {
			corner-top-left-shape: scoop;
			border-top-left-radius: 16px;
			.icon { top: -8px; left: -8px; z-index: -1; }
			@media (hover: hover) and (prefers-reduced-motion: no-preference) {
				transition: border-top-left-radius .2s;
				.icon { transition: translate .2s; }
				&:hover {
					border-top-left-radius: 12px;
					.icon { translate: -7px -7px; }
				}
			}
		}
	}
	.guide-cta {
		--highlight: var(--color-primary-bright);
		border-color: var(--highlight);
		background: color-mix(in srgb, var(--highlight) 10%, var(--background));
		.icon {
			padding: 1px;
			background: var(--highlight);
			color: #111;
			scale: -1 1;
		}
	}
	.clue-of-the-day {
		.icon {
			padding: 3px;
			border: 2px solid var(--light-border);
		}
		.intro {
			display: flex;
			flex-flow: row nowrap;
			justify-content: space-between;
			align-items: center;
			gap: 4px;
			margin-bottom: 8px;
		}
		.by {
			font-size: .8rem;
			opacity: 0.75;
			margin: 0;
		}
		.solved {
			flex: 0 0 auto;
			color: var(--color-primary-bright);
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
	}
	.guide {
		position: relative;
		display: block;
		width: fit-content;
		margin: 0 auto;
		padding: 8px 16px;
		font-size: 1.2rem;
		border: 2px solid #0000;
		border-radius: 8px;
		background:
			linear-gradient(color-mix(in srgb, var(--background), transparent var(--index-transparency)) 0 0) padding-box,
			conic-gradient(from var(--index-angle) in oklch longer hue, oklch(var(--highlight-base) 0), oklch(var(--highlight-base) 0)) border-box
		;
		animation: index-angle-spin 3s linear infinite paused;
		transition: --index-transparency .15s;
		@media (prefers-reduced-motion: reduce) {
			animation: none;
		}
		&:hover, &:focus-visible {
			--index-transparency: 10%;
			animation-play-state: running;
		}
	}
	footer {
		padding: 16px;
		border-top: 1px solid var(--light-border);
		ul {
			display: flex;
			flex-flow: row wrap;
			justify-content: center;
			gap: 8px 24px;
			margin: 0;
			padding: 0;
			list-style: none;
		}
		a {
			display: flex;
			flex-flow: row nowrap;
			gap: .5em;
			opacity: 0.5;
			transition: opacity .15s;
			&:hover, &:focus-visible { opacity: 1; }
			svg { height: 1lh; }
		}
	}
}
</style>