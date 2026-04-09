<script setup lang="ts">
	import type { NuxtError } from '#app';

	const props = defineProps<{ error: NuxtError }>();

	const status = props.error.status || 500;
</script>

<template>
	<main>
		<template v-if="status === 404">
			<h1><span class="definition"><span class="group-1">Pa</span><span class="group-2">ge non</span> <span class="group-3">t</span><span class="group-4">rouvé</span><span class="group-3">e</span></span></h1>
			<p class="clue"><span class="group-2" tabIndex="0"><span class="fodder">Guenon</span> <span class="indicator">sans</span> <span class="fodder">tension</span></span> suit <span class="group-1" tabIndex="0"><span class="indicator">une paire de</span> <span class="fodder">passants</span></span>, <span class="group-3" tabIndex="0"><span class="fodder">te</span> <span class="indicator">cerne</span></span>, <span class="group-4" tabIndex="0"><span class="fodder">ouvre</span> <span class="indicator">frénétiquement</span></span> <span class="definition" tabIndex="0">ce qui est là</span> (4, 3, 7)</p>
		</template>
		<template v-else>
			<h1>Erreur</h1>
		</template>
		<NuxtLink to="/" class="back">Retour à l'accueil</NuxtLink>
	</main>
</template>

<style scoped>
	main {
		min-height: 100dvh;
		place-content: center;
		text-align: center;
		padding: 48px 32px;
	}
	h1 {
		font-size: 3rem;
	}
	.clue {
		color: color-mix(in oklch, currentColor, transparent 50%);
	}
	.group-1, .group-2, .group-3, .group-4, .definition {
		--hover: 0;
		.indicator { --highlight-scale: .2; }
		h1 &, & .fodder, & .indicator, &.definition {
			background: linear-gradient(var(--color, #0000) 0 0) bottom / 100% calc(100% * var(--hover) * var(--highlight-scale, 1)) no-repeat;
			transition: background-size .15s;
			border-radius: 4px;
		}
	}
	.group-1 { --color: var(--hint-1); }
	.group-2 { --color: var(--hint-2); }
	.group-3 { --color: var(--hint-3); }
	.group-4 { --color: var(--hint-4); }
	.definition { --color: var(--definition); }
	main:has(.group-1:hover, .group-1:focus-visible) .group-1,
	main:has(.group-2:hover, .group-2:focus-visible) .group-2,
	main:has(.group-3:hover, .group-3:focus-visible) .group-3,
	main:has(.group-4:hover, .group-4:focus-visible) .group-4,
	main:has(.clue .definition:hover, .clue .definition:focus-visible) .definition {
		color: var(--text);
		--hover: 1;
	}
	@property --error-wave-height {
		syntax: '<number>';
		inherits: true;
		initial-value: 0;
	}
	@property --error-wave-offset {
		syntax: '<number>';
		inherits: true;
		initial-value: 0;
	}
	@keyframes error-wave-offset { to { --error-wave-offset: 1; } }
	.back {
		--bg: color-mix(in oklch, currentColor, transparent 50%);
		background: var(--bg);
		--error-wave-height: 0;
		--w: max(.225lh, 100% / 38);
		--h: (var(--error-wave-height) * .15lh);
		--t: calc(.05lh + var(--error-wave-height) * .05lh);
		padding-bottom: .2lh;
		--origin: from calc(-2 * var(--w) * var(--error-wave-offset)) calc(100% - var(--h) - round(var(--t) / 2, 1px) + .15lh * (var(--error-wave-height) - 1));
		--r: curve by var(--w) 0px with calc(var(--w) / 2) max(0px, var(--h) - var(--t) / 2), curve by var(--w) 0px with calc(var(--w) / 2) min(0px, -1 * var(--h) + var(--t) / 2);
		--l: curve by calc(-1 * var(--w)) 0px with calc(var(--w) / -2) min(0px, -1 * var(--h) + var(--t) / 2), curve by calc(-1 * var(--w)) 0px with calc(var(--w) / -2) max(0px, var(--h) - var(--t) / 2);
		--shape: shape(
			var(--origin),
			var(--r), var(--r), var(--r), var(--r), var(--r),
			var(--r), var(--r), var(--r), var(--r), var(--r),
			var(--r), var(--r), var(--r), var(--r), var(--r),
			var(--r), var(--r), var(--r), var(--r), var(--r),
			line by 0px var(--t),
			var(--l), var(--l), var(--l), var(--l), var(--l),
			var(--l), var(--l), var(--l), var(--l), var(--l),
			var(--l), var(--l), var(--l), var(--l), var(--l),
			var(--l), var(--l), var(--l), var(--l), var(--l),
			close
		);
		/* border-shape is better if text wraps (clip-path fallback below) */
		border-shape: var(--shape);
		animation: error-wave-offset 1s linear infinite;
		transition: --error-wave-height .15s, background-color .15s;
		@media (prefers-reduced-motion: reduce) {
			animation: none;
			transition: none;
		}
		&:hover { --error-wave-height: 1; --bg: var(--color-primary); }
	}
	@supports not (border-shape: inset(0)) {
		.back {
			position: relative;
			background: transparent;
			&::after {
				content: '';
				position: absolute;
				inset: 0;
				background: var(--bg);
				clip-path: var(--shape);
				pointer-events: none;
				transition: background-color .15s;
			}
		}
	}
</style>