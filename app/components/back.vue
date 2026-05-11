<template>
	<NuxtLink to="/" class="back" aria-label="Retour à l'accueil">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24px" height="24px"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" /></svg>
	</NuxtLink>
</template>

<style scoped>
	.back {
		position: fixed;
		top: 8px; left: 8px;
		background: var(--background);
		border-radius: 50%;
		padding: 4px;
		z-index: 9;
	}
</style>