<script setup lang="ts">
	defineProps<{ message: string }>();
</script>

<template>
	<dialog>
		<form method="dialog">
			<div class="message">{{ message }}</div>
			<div class="buttons">
				<button type="submit" value="OK">OK</button>
				<button type="submit" value="CANCEL">Annuler</button>
			</div>
		</form>
	</dialog>
</template>

<style scoped>
	dialog {
		max-width: 600px;
		margin: auto;
		padding: 16px;
		background: var(--background);
		color: var(--text);
		border: 1px solid var(--light-border);
		border-radius: 8px;
		transition: display .15s allow-discrete, overlay .15s allow-discrete, opacity .15s, translate .15s, transform .15s;
		&::backdrop {
			background: #0008;
			transition: opacity .15s;
		}
		@starting-style {
			translate: 0 16px;
			opacity: 0;
			&::backdrop { opacity: 0; }
		}
		&:not(:modal) {
			translate: 0 16px;
			opacity: 0;
			&::backdrop { opacity: 0; };
		}
	}
	.buttons {
		display: flex;
		flex-flow: row nowrap;
		justify-content: end;
		gap: 8px;
		margin-top: 16px;
		button {
			padding: 4px 8px;
			border: 1px solid var(--light-border);
			border-radius: 4px;
			transition: background-color .15s;
			&:hover, &:focus-visible {
				background: var(--light-border);
			}
			&[value="OK"] {
				border-color: var(--color-primary);
				&:hover, &:focus-visible {
					background: color-mix(var(--color-primary-bright), transparent 75%);
				}
			}
		}
	}
</style>