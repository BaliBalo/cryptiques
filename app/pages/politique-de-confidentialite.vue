<script setup lang="ts">
	definePageMeta({
		title: 'Politique de confidentialité | Cryptiques',
		htmlAttrs: { class: 'page-politique-de-confidentialite' },
	});
</script>

<template>
	<main>
		<h1>Politique de confidentialité</h1>
		<small>Dernière mise à jour : <time datetime="2026-04-20">20 avril 2026</time></small>
		<hr>
		<h2>Données personelles collectées</h2>
		<p>Lorsque vous vous connectez à un compte via un service tiers, nous enregistrons votre adresse e-mail comme identifiant pour votre compte, ainsi que - si possible - votre nom sur ce service comme nom d'utilisateur (ce nom est modifiable dans les paramètres de votre compte).</p>
		<hr>
		<h2>Utilisation des données</h2>
		<p>Ces informations ne sont ni vendues, ni partagées avec des tiers. Elles sont seulement utilisées pour le bon fonctionement du site.</p>
		<hr>
		<h2>Rétention</h2>
		<p>Les données personnelles sont conservées aussi longtemps que nécessaire pour le bon fonctionnement du site.</p>
		<hr>
		<h2>Suppression des données</h2>
		<p>Vous pouvez demander la suppression de vos données personnelles par email à cryptiques arobase balibalo point xyz.</p>
	</main>
</template>

<style scoped>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 48px 16px;
	}
	h1 {
		margin-bottom: 0;
	}
	h1 + small {
		display: block;
		margin-block: 0 1rem;
	}
	hr {
		margin: 2rem 0;
		border: none;
		border-top: 1px solid;
		opacity: 0.5;
	}
</style>