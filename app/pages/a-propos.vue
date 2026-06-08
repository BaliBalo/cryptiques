<script setup lang="ts">
	definePageMeta({
		title: 'À propos | Cryptiques',
		htmlAttrs: { class: 'page-a-propos' },
	});
</script>

<template>
	<main>
		<Back />
		<h1>À propos</h1>
		<h2>Crédits</h2>
		<ul>
			<li><a href="https://minutecryptic.com" target="_blank" rel="noopener noreferrer">Minute Cryptic</a> : inspiration pour une grande partie du design, ainsi que la gestion des indices, etc.</li>
			<li><a href="https://fonts.google.com/icons" target="_blank" rel="noopener noreferrer">Material Icons by Google Fonts</a> : la plupart des icônes utilisées sur ce site</li>
		</ul>
	</main>
</template>

<style scoped>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 48px 16px;
	}
	a {
		text-decoration: underline color-mix(in srgb, currentColor, transparent 50%);
		text-underline-offset: 2px;
		transition: text-decoration-color .15s, text-underline-offset .15s;
		&:hover, &:focus-visible {
			text-decoration-color: var(--color-primary);
			text-underline-offset: 4px;
		}
	}
</style>