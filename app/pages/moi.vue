<script setup lang="tsx">
	definePageMeta({
		middleware: 'logged-in-only',
	});

	const { loggedIn, clear: logout } = useUserSession();

	useHead({
		title: 'Mon Profil | Cryptiques',
		htmlAttrs: { class: 'page-moi' },
	});

	const { data: userData, error } = await useFetch('/api/me');
	const solveCount = computed(() => userData.value?.solveCount || 0);

	onMounted(() => {
		mergeLocalSolves();
	});

	watch(loggedIn, async (isLoggedIn) => {
		if (!isLoggedIn) {
			await navigateTo('/connexion');
		}
	});

	const addWBR = (args: { str: string }) => args.str.split(/(?=[@._+])/).flatMap((segment, i) => [
		i && <wbr />,
		segment,
	].filter(Boolean));
</script>

<template>
	<main>
		<Back />
		<h1>
			Mon Profil
			<button type="button" class="logout" @click="logout">
				<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
					<path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
				</svg>
				Se déconnecter
			</button>
		</h1>
		<template v-if="error">
			<p>Une erreur est survenue lors du chargement de votre profil. Veuillez réessayer plus tard.</p>
		</template>
		<template v-else>
			<fieldset class="details">
				<legend>Détails du compte</legend>
				<div class="label">Adresse e-mail</div>
				<div class="value"><addWBR :str="userData?.email || ''" /></div>
				<div class="label">Création du compte</div>
				<div class="value">{{ !userData?.createdAt ? 'Inconnue' : new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(userData.createdAt)) }}</div>
			</fieldset>
			<fieldset>
				<legend>Stats</legend>
				<p>{{ solveCount }} {{ solveCount > 1 ? 'énigmes résolues' : 'énigme résolue' }}</p>
			</fieldset>
		</template>
	</main>
</template>

<style scoped>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 48px 16px;
	}
	fieldset {
		margin-bottom: 1lh;
		border: 1px solid var(--light-border);
		border-radius: 8px;
		p:last-child { margin-bottom: 0; }
	}
	legend {
		padding: 0 8px;
	}
	.details {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 8px 16px;
		.label {
			grid-column: 1;
		}
		.value {
			grid-column: 2;
			text-align: right;
			overflow-wrap: anywhere;
		}
	}
	.logout {
		display: inline-flex;
		justify-content: center;
		gap: .5em;
		padding: 6px 10px;
		font-size: .8rem;
		font-family: var(--font-main);
		border: 1px solid var(--light-border);
		border-radius: 8px;
		transition: border-color .15s;
		svg {
			height: 1lh;
			width: auto;
		}
		&:hover {
			border-color: currentColor;
		}
	}
</style>