<script setup lang="tsx">
	import { FetchError } from 'ofetch';
	import { mergeLocalSolves } from '~/utils/localSolves';

	definePageMeta({
		middleware: 'logged-out-only',
	});

	useHead({
		title: 'Connexion | Cryptiques',
		htmlAttrs: { class: 'page-connexion' },
	});

	const route = useRoute('connexion');

	const { public: { authProviders } } = useRuntimeConfig();
	const { loggedIn, openInPopup } = useUserSession();
	const syncing = ref(false);
	const sendingMagicLink = ref(false);
	const magicLinkSent = ref(false);
	const magicLinkError = ref(false);
	let magicLinkToken: Promise<string> = Promise.resolve('');

	function getMagicLinkToken() {
		magicLinkToken = fetch('/api/auth-email-token').then(res => res.text());
	}

	onMounted(() => {
		getMagicLinkToken();
	});

	watch(loggedIn, async (isLoggedIn) => {
		if (!isLoggedIn) return;
		syncing.value = true;
		await mergeLocalSolves();
		syncing.value = false;
		const destination = typeof route.query.retour === 'string' ? route.query.retour : '/moi';
		try {
			await navigateTo(destination);
		} catch {
			await navigateTo('/moi');
		} finally { /**/ }
	});

	const providerData = {
		discord: {
			name: 'Discord',
			icon: (
				<svg width="65" height="48" viewBox="0 -4 65 56" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					<path fill="#5865F2" d="M41.2351 0C40.6164 1.09866 40.0607 2.2352 39.5556 3.397C34.7569 2.67719 29.8697 2.67719 25.0584 3.397C24.5658 2.2352 23.9976 1.09866 23.3788 0C18.8705 0.770324 14.4759 2.12155 10.3085 4.02841C2.04967 16.2652 -0.185531 28.1863 0.925755 39.9432C5.76238 43.517 11.1799 46.2447 16.951 47.9874C18.2517 46.2447 19.4009 44.3883 20.3859 42.4562C18.5169 41.7616 16.7111 40.8903 14.981 39.88C15.4356 39.5517 15.8776 39.2107 16.307 38.8824C26.4475 43.6559 38.1917 43.6559 48.3449 38.8824C48.7742 39.236 49.2162 39.577 49.6708 39.88C47.9408 40.9029 46.1349 41.7616 44.2533 42.4688C45.2383 44.4009 46.3875 46.2573 47.6882 48C53.4593 46.2573 58.8768 43.5422 63.7134 39.9684C65.0268 26.3299 61.4656 14.5099 54.3054 4.04104C50.1507 2.13418 45.7561 0.782952 41.2478 0.0252565L41.2351 0ZM21.8003 32.7072C18.6811 32.7072 16.0923 29.8785 16.0923 26.3804C16.0923 22.8824 18.5801 20.041 21.7876 20.041C24.9952 20.041 27.5461 22.895 27.4956 26.3804C27.4451 29.8658 24.9826 32.7072 21.8003 32.7072ZM42.8389 32.7072C39.7071 32.7072 37.1436 29.8785 37.1436 26.3804C37.1436 22.8824 39.6314 20.041 42.8389 20.041C46.0465 20.041 48.5848 22.895 48.5343 26.3804C48.4838 29.8658 46.0213 32.7072 42.8389 32.7072Z" />
				</svg>
			),
		},
		// facebook: {
		// 	name: 'Facebook',
		// 	icon: (
		// 		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 666.667 666.667">
		// 			<path fill="#0866ff" d="M666.665 333.335C666.665 149.24 517.427.002 333.333.002S0 149.24 0 333.335C0 489.66 107.62 620.83 252.807 656.85V435.196h-68.735V333.335h68.735v-43.892c0-113.456 51.344-166.043 162.73-166.043 21.118 0 57.556 4.14 72.463 8.282v92.338c-7.868-.828-21.532-1.243-38.51-1.243-54.656 0-75.775 20.704-75.775 74.534v36.024h108.878l-18.703 101.86h-90.175v229.03c165.048-19.934 292.95-160.467 292.95-330.89" />
		// 			<path fill="#fff" d="m463.89 435.196 18.705-101.861h-108.88v-36.026c0-53.829 21.119-74.532 75.776-74.532 16.977 0 30.64.414 38.51 1.242v-92.337c-14.908-4.142-51.347-8.283-72.463-8.283-111.387 0-162.73 52.588-162.73 166.044v43.893h-68.736v101.86h68.735V656.85a334 334 0 0 0 80.526 9.816 337 337 0 0 0 40.383-2.44v-229.03Z" />
		// 		</svg>
		// 	),
		// },
		github: {
			name: 'GitHub',
			icon: (
				<svg width="98" height="96" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					<path d="M41.4395 69.3848C28.8066 67.8535 19.9062 58.7617 19.9062 46.9902C19.9062 42.2051 21.6289 37.0371 24.5 33.5918C23.2559 30.4336 23.4473 23.7344 24.8828 20.959C28.7109 20.4805 33.8789 22.4902 36.9414 25.2656C40.5781 24.1172 44.4062 23.543 49.0957 23.543C53.7852 23.543 57.6133 24.1172 61.0586 25.1699C64.0254 22.4902 69.2891 20.4805 73.1172 20.959C74.457 23.543 74.6484 30.2422 73.4043 33.4961C76.4668 37.1328 78.0937 42.0137 78.0937 46.9902C78.0937 58.7617 69.1934 67.6621 56.3691 69.2891C59.623 71.3945 61.8242 75.9883 61.8242 81.252L61.8242 91.2051C61.8242 94.0762 64.2168 95.7031 67.0879 94.5547C84.4102 87.9512 98 70.6289 98 49.1914C98 22.1074 75.9883 6.69539e-07 48.9043 4.309e-07C21.8203 1.92261e-07 -1.9479e-07 22.1074 -4.3343e-07 49.1914C-6.20631e-07 70.4375 13.4941 88.0469 31.6777 94.6504C34.2617 95.6074 36.75 93.8848 36.75 91.3008L36.75 83.6445C35.4102 84.2188 33.6875 84.6016 32.1562 84.6016C25.8398 84.6016 22.1074 81.1563 19.4277 74.7441C18.375 72.1602 17.2266 70.6289 15.0254 70.3418C13.877 70.2461 13.4941 69.7676 13.4941 69.1934C13.4941 68.0449 15.4082 67.1836 17.3223 67.1836C20.0977 67.1836 22.4902 68.9063 24.9785 72.4473C26.8926 75.2227 28.9023 76.4668 31.2949 76.4668C33.6875 76.4668 35.2187 75.6055 37.4199 73.4043C39.0469 71.7773 40.291 70.3418 41.4395 69.3848Z" />
				</svg>
			),
		},
		google: {
			name: 'Google',
			icon: (
				<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true">
					<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
					<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
					<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
					<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
				</svg>
			),
		},
		twitch: {
			name: 'Twitch',
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 2800" aria-hidden="true">
					<path fill="#fff" d="m2200 1300-400 400h-400l-350 350v-350H600V200h1600z" />
					<path fill="#9146ff" d="M500 0 0 500v1800h600v500l500-500h400l900-900V0zm1700 1300-400 400h-400l-350 350v-350H600V200h1600z M1700 550h200v600h-200zm-550 0h200v600h-200z" />
				</svg>
			),
		},
	};
	const isKnownProvider = (provider: string): provider is keyof typeof providerData => provider in providerData;
	const expandedProviders = authProviders.map((provider) => {
		const data = isKnownProvider(provider) ? providerData[provider] : null;
		return {
			id: provider,
			name: data?.name || provider,
			icon: () => data?.icon || null,
		};
	});

	function onMagicLinkSubmit(e: SubmitEvent) {
		const form = e.currentTarget;
		if (form instanceof HTMLFormElement) {
			sendMagicLink(form);
		}
	}

	async function sendMagicLink(form: HTMLFormElement, retried = false) {
		if (sendingMagicLink.value) return;
		const formData = new FormData(form);
		const email = formData.get('email');
		if (!email) return;
		sendingMagicLink.value = true;
		magicLinkError.value = false;
		let token: string | undefined;
		try {
			token = await magicLinkToken;
		} catch { /**/ }
		try {
			await $fetch('/api/send-auth-email', {
				method: 'POST',
				body: {
					email: formData.get('email'),
					token,
				},
			});
			magicLinkSent.value = true;
		} catch (err) {
			if (err instanceof FetchError && err.status === 401 && !retried) {
				// Token error: try to get a new one and retry once
				getMagicLinkToken();
				sendingMagicLink.value = false;
				return sendMagicLink(form, true);
			}
			magicLinkError.value = true;
		}
		sendingMagicLink.value = false;
	}
</script>

<template>
	<main :class="{ syncing }" :inert="syncing">
		<Back />
		<h1>Connexion</h1>
		<template v-if="!magicLinkSent">
			<p>Si vous préférez jouer anonymement, vos résultats seront sauvegardés localement. Il est cependant possible que ces résultats soient perdus si vos données de navigation sont supprimées, ou si vous changez d'appareil.</p>
			<p>Pour les synchroniser sur tous vos appareils et pouvoir donner votre avis sur les énigmes, veuillez vous connecter en utilisant l'un des fournisseurs d'authentification ci-dessous :</p>
			<div class="providers">
				<button v-for="provider in expandedProviders" :key="provider.id" type="button" @click="openInPopup(`/auth/${provider.id}`)">
					<component :is="provider.icon" />
					{{ provider.name }}
				</button>
			</div>
			<div class="sep">ou</div>
			<p>Recevez un lien de connexion par email (à ouvrir avec le même navigateur) :</p>
			<form class="magic-link" :class="{ sending: sendingMagicLink, error: magicLinkError }" action="/api/send-auth-email" method="post" @submit.prevent="onMagicLinkSubmit">
				<input type="email" name="email" autocomplete="email" placeholder="moi@gmail.com" required :disabled="sendingMagicLink">
				<button type="submit" :disabled="sendingMagicLink">
					<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" aria-label="Envoyer">
						<path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
					</svg>
				</button>
			</form>
		</template>
		<template v-else>
			<p>Un lien de connexion a été envoyé à votre adresse email. Veuillez l'ouvrir avec le même navigateur pour vous connecter.</p>
		</template>
	</main>
</template>

<style scoped>
	main {
		position: relative;
		max-width: 800px;
		margin: 0 auto;
		padding: 48px 16px;
		&::before, &::after {
			content: '';
			position: absolute;
			inset: 0;
			visibility: hidden;
			opacity: 0;
			transition: opacity .5s, visibility .5s;
		}
		&::before {
			background: var(--background);
		}
		&::after {
			inset: 50% 0 0 50%;
			width: 2rem;
			aspect-ratio: 1;
			border: 3px solid var(--color-primary);
			border-right-color: transparent;
			border-radius: 50%;
			animation: spin 1s cubic-bezier(.7, .3, .3, .7) infinite;
		}
	}
	.syncing {
		&::before, &::after {
			visibility: visible;
			opacity: 1;
		}
		&::before { opacity: 0.8; }
	}
	.providers {
		display: grid;
		gap: 8px;
		width: fit-content;
		margin: 24px auto;
		button {
			display: flex;
			justify-content: center;
			gap: .5em;
			padding: 8px 16px;
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
		&:empty::before { content: 'Pas de fournisseur d\'authentification disponible'; opacity: 0.5; }
	}
	.sep {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: .5em;
		margin: 16px auto;
		opacity: 0.5;
		&::before, &::after {
			content: '';
			flex: 1 1 auto;
			display: block;
			height: 1px;
			max-width: 100px;
			background: var(--light-border);
		}
	}
	.magic-link {
		position: relative;
		display: flex;
		width: fit-content;
		margin: 0 auto;
		border-color: color-mix(var(--text), transparent 80%);
		input {
			padding: 8px 12px;
			background: var(--background);
			color: currentColor;
			font: inherit;
			border: 1px solid;
			border-color: inherit;
			border-right: none;
			border-radius: 8px 0 0 8px;
			&:disabled { color: color-mix(currentColor, transparent 50%); }
		}
		button {
			position: relative;
			padding: 8px 12px;
			background: var(--background);
			border: 1px solid;
			border-color: inherit;
			border-radius: 0 8px 8px 0;
			transition: border-color .15s;
			overflow: hidden;
			&:not(:disabled):hover { border-color: currentColor; }
			&:disabled { cursor: default; }
			&::before {
				content: '';
				position: absolute;
				inset: 50% 0 0 50%;
				width: 20px;
				aspect-ratio: 1;
				border: 2px solid;
				border-right-color: transparent;
				border-radius: 50%;
				animation: spin 1s cubic-bezier(.7, .3, .3, .7) infinite;
				translate: -50% calc(-50% - 100% - 16px);
				transition: translate .3s;
			}
			svg { transition: translate .3s; }
		}
		&:after {
			content: 'Une erreur est survenue. Veuillez rafraîchir la page et réessayer.';
			position: absolute;
			top: 100%;
			left: 8px;
			right: 8px;
			padding: 8px;
			background: #e74c3ccc;
			color: var(--text);
			font-size: .9rem;
			border: 1px solid #e74c3c;
			border-top: none;
			border-radius: 0 0 8px 8px;
			visibility: hidden;
			opacity: 0;
			translate: 0 -16px;
			z-index: -1;
			transition: translate .2s, visibility .2s, opacity .2s;
		}
		&.sending button {
			&::before { translate: -50% -50%; transition-delay: .15s; }
			svg { translate: calc(100% + 16px) 0; }
		}
		&.error {
			animation: login-error-shake .3s, login-error-color .6s;
			&::after {
				visibility: visible;
				opacity: 1;
				translate: 0 0;
			}
		}
	}
	@keyframes login-error-shake {
		from, to { translate: 0; }
		20%, 60% { translate: 5px 0; }
		40%, 80% { translate: -5px 0; }
	}
	@keyframes login-error-color {
		from, 50% { color: #e74c3c; border-color: #e74c3c }
	}
</style>