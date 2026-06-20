<script setup lang="ts">
	definePageMeta({
		middleware: 'logged-in-only',
	});

	const { user } = useUserSession();

	useHead({
		title: 'Mes énigmes | Cryptiques',
		htmlAttrs: { class: 'page-mes-enigmes' },
	});
</script>

<template>
	<main>
		<Back />
		<h1>Mes énigmes</h1>
		<ClueList v-if="user" :author-id="user.id" />
	</main>
</template>

<style scoped>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 48px 16px;
	}
</style>