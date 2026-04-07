<script setup lang="ts">
	useHead({
		title: 'Cryptiques',
		meta: [
			{
				name: 'description',
				content: 'Un site pour les cryptiques francophones.',
			},
		],
	});
</script>

<template>
	<main>
		<p>Ce site listera bientôt des énigmes cryptiques. Mais pour l'instant, il n'y a qu'un guide.</p>
		<NuxtLink to="/guide" class="guide">Suivez le guide</NuxtLink>
	</main>
</template>

<style scoped>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 48px 16px;
	}
	.guide {
		font-size: 2rem;
		text-decoration: underline;
		text-decoration-style: wavy;
		text-decoration-color: color-mix(in srgb, currentColor, transparent 50%);
		text-underline-offset: 3px;
		transition: text-decoration-color .15s, text-underline-offset .15s;
		&:hover {
			text-decoration-color: var(--color-primary);
			text-underline-offset: 7px;
		}
	}
</style>