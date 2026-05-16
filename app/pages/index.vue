<script setup lang="ts">
	useHead({
		title: 'Cryptiques',
		htmlAttrs: { class: 'page-index' },
		meta: [
			{
				name: 'description',
				content: 'Un site pour les cryptiques francophones.',
			},
		],
	});

	const { loggedIn } = useUserSession();
</script>

<template>
	<div class="above">
		<header>
			<hgroup>
				<h1>Cryptiques</h1>
				<p>Un site pour les énigmes cryptiques francophones.</p>
			</hgroup>
			<div class="account">
				<NuxtLink v-if="loggedIn" to="/moi">Mon Profil</NuxtLink>
				<NuxtLink v-else to="/connexion">Connexion</NuxtLink>
			</div>
		</header>
		<main>
			<div class="guide-cta">
				<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M440-120v-80h320v-284q0-117-81.5-198.5T480-764q-117 0-198.5 81.5T200-484v244h-40q-33 0-56.5-23.5T80-320v-80q0-21 10.5-39.5T120-469l3-53q8-68 39.5-126t79-101q47.5-43 109-67T480-840q68 0 129 24t109 66.5Q766-707 797-649t40 126l3 52q19 9 29.5 27t10.5 38v92q0 20-10.5 38T840-249v49q0 33-23.5 56.5T760-120H440ZM331.5-411.5Q320-423 320-440t11.5-28.5Q343-480 360-480t28.5 11.5Q400-457 400-440t-11.5 28.5Q377-400 360-400t-28.5-11.5Zm240 0Q560-423 560-440t11.5-28.5Q583-480 600-480t28.5 11.5Q640-457 640-440t-11.5 28.5Q617-400 600-400t-28.5-11.5ZM241-462q-7-106 64-182t177-76q89 0 156.5 56.5T720-519q-91-1-167.5-49T435-698q-16 80-67.5 142.5T241-462Z" /></svg>
				<p>Nouveau aux cryptiques ou besoin d'un rappel ?</p>
				<NuxtLink to="/guide" class="guide">Suivez le guide</NuxtLink>
			</div>
			<ClueList />
		</main>
	</div>
	<footer>
		<ul>
			<li><NuxtLink to="/contact">Contact</NuxtLink></li>
			<li>
				<a href="https://github.com/BaliBalo/cryptiques" target="_blank" rel="noopener noreferrer">
					<svg height="24" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						<path d="M41.4395 69.3848C28.8066 67.8535 19.9062 58.7617 19.9062 46.9902C19.9062 42.2051 21.6289 37.0371 24.5 33.5918C23.2559 30.4336 23.4473 23.7344 24.8828 20.959C28.7109 20.4805 33.8789 22.4902 36.9414 25.2656C40.5781 24.1172 44.4062 23.543 49.0957 23.543C53.7852 23.543 57.6133 24.1172 61.0586 25.1699C64.0254 22.4902 69.2891 20.4805 73.1172 20.959C74.457 23.543 74.6484 30.2422 73.4043 33.4961C76.4668 37.1328 78.0937 42.0137 78.0937 46.9902C78.0937 58.7617 69.1934 67.6621 56.3691 69.2891C59.623 71.3945 61.8242 75.9883 61.8242 81.252L61.8242 91.2051C61.8242 94.0762 64.2168 95.7031 67.0879 94.5547C84.4102 87.9512 98 70.6289 98 49.1914C98 22.1074 75.9883 6.69539e-07 48.9043 4.309e-07C21.8203 1.92261e-07 -1.9479e-07 22.1074 -4.3343e-07 49.1914C-6.20631e-07 70.4375 13.4941 88.0469 31.6777 94.6504C34.2617 95.6074 36.75 93.8848 36.75 91.3008L36.75 83.6445C35.4102 84.2188 33.6875 84.6016 32.1562 84.6016C25.8398 84.6016 22.1074 81.1563 19.4277 74.7441C18.375 72.1602 17.2266 70.6289 15.0254 70.3418C13.877 70.2461 13.4941 69.7676 13.4941 69.1934C13.4941 68.0449 15.4082 67.1836 17.3223 67.1836C20.0977 67.1836 22.4902 68.9063 24.9785 72.4473C26.8926 75.2227 28.9023 76.4668 31.2949 76.4668C33.6875 76.4668 35.2187 75.6055 37.4199 73.4043C39.0469 71.7773 40.291 70.3418 41.4395 69.3848Z" />
					</svg>
					Code source
				</a>
			</li>
			<li><NuxtLink to="/a-propos">À propos</NuxtLink></li>
			<li><NuxtLink to="/outils">Outils</NuxtLink></li>
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
	.guide-cta {
		/* --highlight: #3498db; */
		--highlight: var(--color-primary-bright);
		position: relative;
		margin: 32px auto;
		padding: 16px;
		width: fit-content;
		border: 2px solid var(--highlight);
		border-radius: 16px;
		background: color-mix(in srgb, var(--highlight) 10%, var(--background));
		svg {
			position: absolute;
			top: -10px;
			left: -10px;
			background: var(--highlight);
			color: var(--background);
			border-radius: 50%;
			scale: -1 1;
		}
		@supports (corner-shape: scoop) {
			corner-top-left-shape: scoop;
			border-top-left-radius: 16px;
			svg { top: -13px; left: -13px; }
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
		&:hover {
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