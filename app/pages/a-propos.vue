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
		<h2>Pourquoi ce site ?</h2>
		<p>Il y a peu de temps je me suis pris de passion pour les cryptiques (que j'ai découverts en anglais). Assez naturellement, j'ai recherché un équivalent dans ma langue maternelle. Malheureusement, il n'y avait que très peu de résultats, seulement quelques énigmes et grilles par d'autres adeptes.</p>
		<p>Je pense que c'est normal : par la nature de la langue française, il me paraît plus difficile de créer des cryptiques de qualité qu'en anglais. Mais ces quelques trouvailles m'ont montré que tout n'était pas perdu et qu'il est bien possible de créer des cryptiques intéressants.</p>
		<p>Je me suis donc lancé dans la création de ce site avec un but : donner le goût des cryptiques à un plus large public francophone. Donc avec un guide clair, et des énigmes accompagnées d'indices pour aider à la résolution. Un site adapté aux débutants, mais tout aussi intéressant pour les plus expérimentés.</p>
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