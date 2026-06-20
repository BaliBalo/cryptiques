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
		<h1>
			Mes énigmes
			<NuxtLink to="/enigme/creer" class="create">
				<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
					<path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
				</svg>
				Créer une énigme
			</NuxtLink>
		</h1>
		<ClueList v-if="user" :author-id="user.id" />
	</main>
</template>

<style scoped>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 48px 16px;
	}
	h1 :is(a, button) {
		display: inline-flex;
		justify-content: center;
		gap: 4px;
		padding: 4px 8px;
		font-size: .8rem;
		font-family: var(--font-main);
		border: 1px solid var(--light-border);
		border-radius: 4px;
		transition: border-color .15s;
		svg {
			height: 16px;
			width: auto;
		}
		&:hover {
			border-color: currentColor;
		}
	}
</style>