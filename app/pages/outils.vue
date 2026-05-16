<script setup lang="ts">
	useHead({
		title: 'Outils | Cryptiques',
	});
</script>

<template>
	<Back />
	<main>
		<h1>Liens utiles</h1>
		<h2>Pour résoudre ou créer</h2>
		<ul>
			<li>
				Dictionnaires (définitions et synonymes):
				<ul>
					<li><a href="https://dictionnaire.lerobert.com/" target="_blank" rel="noopener noreferrer">Le Robert</a></li>
					<li><a href="https://www.larousse.fr/dictionnaires/francais/" target="_blank" rel="noopener noreferrer">Larousse</a></li>
					<li><a href="https://fr.wiktionary.org/wiki/Wiktionnaire:Page_d%E2%80%99accueil" target="_blank" rel="noopener noreferrer">Wiktionnaire</a></li>
				</ul>
			</li>
			<li>
				<a href="http://ducktiles.com/" target="_blank" rel="noopener noreferrer">Ducktiles</a>, pour mélanger des lettres visuellement et trouver des anagrammes, sans lister tous les mots possibles - utile pour résoudre certaines énigmes sans avoir l'impression de tricher
			</li>
			<li>
				<a href="https://www.quinapalus.com/cgi-bin/qat-fr" target="_blank" rel="noopener noreferrer">Qat</a>, un outil puissant de recherche de mots (un peu difficile d'utilisation, et mode d'emploi en anglais seulement)
			</li>
			<li>
				<a href="https://www.anagrammeur.com/" target="_blank" rel="noopener noreferrer">Anagrammeur</a>, pour trouver des anagrammes (possible avec Qat mais ce site est plus simple d'utilisation)
			</li>
		</ul>
		<h2>Cryptiques Français</h2>
		<ul>
			<li>
				<a href="https://www.instagram.com/mots_cryptiques/" target="_blank" rel="noopener noreferrer">@mots_cryptiques</a> sur Instagram, compte qui poste des cryptiques français (inactif pour le moment)
			</li>
			<li>
				<a href="https://xavierbdm.fr/mots-croises-cryptiques/" target="_blank" rel="noopener noreferrer">Quelques grilles</a> créées par Xavier BdM
			</li>
			<li>
				<a href="https://casevide.fr/grilles/archives/?crossword_type=1" target="_blank" rel="noopener noreferrer">D'autres grilles</a> par Antoine Hinge
			</li>
		</ul>
		<h2>Dans d'autres langues</h2>
		<h3>Anglais</h3>
		<ul>
			<li>
				<a href="https://www.minutecryptic.com/" target="_blank" rel="noopener noreferrer">Minute Cryptic</a>, un jeu quotidien de cryptiques anglais (plutôt du côté simple en général), avec explications
			</li>
			<li>
				<a href="https://www.parseword.com/" target="_blank" rel="noopener noreferrer">Parseword</a>, autre jeu quotidien, mais au lieu de rentrer la réponse directement, il faut appliquer les opérations une à une
			</li>
			<li>
				<a href="https://www.theguardian.com/crosswords/series/quick-cryptic" target="_blank" rel="noopener noreferrer">The Guardian Quick Cryptic</a>, grille hebdomadaire pour débutants (seulement 4 techniques utilisées dans chaque grille, listées explicitement)
			</li>
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
