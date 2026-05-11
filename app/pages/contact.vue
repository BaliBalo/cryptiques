<script setup lang="ts">
	useHead({
		title: 'Contact | Cryptiques',
		htmlAttrs: { class: 'page-contact' },
	});

	const { user } = useUserSession();
	const status = ref('ready');

	async function onSubmit(event: Event) {
		const form = event.currentTarget;
		if (status.value === 'sending' || !(form instanceof HTMLFormElement)) return;
		try {
			status.value = 'sending';
			const formData = new FormData(form);
			await $fetch('/api/contact', {
				method: 'POST',
				body: JSON.stringify(Object.fromEntries(formData)),
			});
			form.reset();
			status.value = 'sent';
		} catch {
			status.value = 'error';
		}
	}
</script>

<template>
	<main>
		<Back />
		<h1>Contact</h1>
		<template v-if="status === 'sent'">
			<p>Merci pour votre message ! Nous y répondrons dès que possible.</p>
			<button type="button" class="retry" @click="status = 'ready'">Envoyer un autre message</button>
		</template>
		<template v-else-if="status === 'error'">
			<p>Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer plus tard.</p>
			<button type="button" class="retry" @click="status = 'ready'">Réessayer</button>
		</template>
		<template v-else>
			<p>Un problème ? Une suggestions ? C'est ici que vous pouvez le faire savoir.</p>
			<form action="/api/contact" method="POST" :class="{ sending: status === 'sending', error: status === 'error' }" @submit.prevent="onSubmit">
				<label>
					<div>Type de message :</div>
					<select name="type">
						<option value="problem">Signaler un problème</option>
						<option value="suggestion">Faire une suggestion</option>
						<option value="other" selected>Autre</option>
					</select>
				</label>
				<label>
					<div>Votre adresse e-mail (si vous voulez une réponse) :</div>
					<input type="email" name="email" autocomplete="email" :value="user?.email || ''" :disabled="status === 'sending'">
				</label>
				<label>
					<div>Votre message :</div>
					<textarea name="message" required :disabled="status === 'sending'" />
				</label>
				<button type="submit" :disabled="status === 'sending'">Envoyer</button>
			</form>
		</template>
	</main>
</template>

<style scoped>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 48px 16px;
	}
	form {
		display: flex;
		flex-flow: column nowrap;
		gap: 16px;
	}
	label {
		display: flex;
		flex-flow: column nowrap;
		gap: 8px;
	}
	input, textarea, select {
		width: 100%;
		padding: 8px;
		background: none;
		color: currentColor;
		border: 1px solid var(--light-border);
		border-radius: 8px;
	}
	option {
		background: var(--background);
		color: var(--text);
	}
	textarea {
		height: calc(4lh + 16px + 2px);
		min-height: calc(1lh + 16px + 2px);
		resize: vertical;
	}
	button[type="submit"] {
		position: relative;
		display: block;
		width: fit-content;
		padding: 8px 16px;
		border: 1px solid var(--light-border);
		border-radius: 8px;
		overflow: hidden;
		transition: border-color .15s, padding .3s;
		&:not(:disabled):hover { border-color: currentColor; }
		&:disabled { cursor: default; color: color-mix(currentColor, transparent 50%); }
		&::before {
			content: '';
			position: absolute;
			inset: 50% 0 0 16px;
			height: .8lh;
			aspect-ratio: 1;
			border: 2px solid;
			border-right-color: transparent;
			border-radius: 50%;
			animation: spin 1s cubic-bezier(.7, .3, .3, .7) infinite;
			translate: 0 calc(-50% - 100% - 16px);
			transition: translate .3s;
		}
	}
	.sending button[type="submit"] {
		padding-inline-start: calc(.8lh + 24px);
		&::before {
			translate: 0 -50%;
		}
	}
	.retry {
		text-decoration: underline wavy color-mix(currentColor, transparent 50%);
	}
</style>