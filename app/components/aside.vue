<script setup>
	const props = defineProps({
		type: {
			type: String,
			default: 'info',
		},
	});

	const slots = useSlots();
</script>

<template>
	<aside class="aside" :data-type="props.type">
		<svg v-if="props.type === 'info'" xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 -960 960 960"><path d="M440-280h80v-240h-80v240Zm68.5-331.5Q520-623 520-640t-11.5-28.5Q497-680 480-680t-28.5 11.5Q440-657 440-640t11.5 28.5Q463-600 480-600t28.5-11.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
		<svg v-else-if="props.type === 'question'" xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 -960 960 960"><path d="M513.5-254.5Q528-269 528-290t-14.5-35.5Q499-340 478-340t-35.5 14.5Q428-311 428-290t14.5 35.5Q457-240 478-240t35.5-14.5ZM442-394h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
		<svg v-else-if="props.type === 'warning'" xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 -960 960 960"><path d="M508.5-291.5Q520-303 520-320t-11.5-28.5Q497-360 480-360t-28.5 11.5Q440-337 440-320t11.5 28.5Q463-280 480-280t28.5-11.5ZM440-440h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
		<svg v-else-if="props.type === 'success'" xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 -960 960 960"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
		<strong v-if="slots.title" class="title"><slot name="title" /></strong>
		<slot />
	</aside>
</template>

<style scoped>
	.aside {
		--highlight: #34495e;
		position: relative;
		background: color-mix(in oklch, var(--highlight) 10%, var(--background));
		margin: 32px 0;
		padding: 16px;
		border: 2px solid var(--highlight);
		border-radius: 16px;
		svg {
			position: absolute;
			top: -8px;
			left: -8px;
			color: var(--highlight);
			background: var(--background);
			border-radius: 50%;
		}
		@supports (corner-shape: scoop) {
			&:has(svg) {
				corner-top-left-shape: scoop;
				border-top-left-radius: 14px;
				svg { z-index: -1; }
			}
		}
		.title {
			display: block;
			font-size: 1.1em;
			margin-bottom: 8px;
		}
		& :deep(p) { margin-bottom: .5lh; }
		& > :deep(p):last-child { margin-bottom: 0; }
		&[data-type="info"] { --highlight: #3498db; }
		&[data-type="question"] { --highlight: #9b59b6; }
		&[data-type="warning"] { --highlight: #f1c40f; }
		&[data-type="success"] { --highlight: #2ecc71; }
	}
</style>