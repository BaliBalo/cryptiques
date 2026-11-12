<script setup lang="tsx">
	const props = defineProps<{
		name?: string,
		noLink?: boolean,
	}>();

	let link: string | undefined;
	let display = props.name || '';
	const linkMatch = display.match(/^(.*\S)\|(https:\/\/\S+)$/);
	if (linkMatch) {
		[, display = '', link] = linkMatch;
	}
</script>

<template>
	<span class="clue-author">
		{{ display }}
		<a v-if="link && !noLink" :href="link" target="_blank" rel="noopener noreferrer">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height="20px" width="20px" aria-label="Lien externe"><path d="M4.5,17q-0.62,0-1.06-0.44T3,15.5V4.5Q3,3.88 3.44,3.44T4.5,3H10V4.5H4.5v11h11V10H17v5.5q0,0.62-0.44,1.06T15.5,17H4.5Zm3.56-4L7,11.94L14.44,4.5H12V3h5V8H15.5V5.56L8.06,13Z" /></svg>
		</a>
	</span>
</template>

<style scoped>
	.clue-author {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		> a > svg {
			height: 1lh;
			width: auto;
		}
	}
</style>