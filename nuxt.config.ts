import secrets from './secrets';

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	site: {
		url: 'cryptiques.balibalo.xyz',
		name: 'Cryptiques',
		indexable: true,
	},
	// spaLoadingTemplate: false,
	devtools: { enabled: false },
	experimental: {
		typedPages: true,
	},
	app: {
		buildAssetsDir: '/build/',
		head: {
			title: 'Cryptiques',
			htmlAttrs: { lang: 'fr' },
		},
		rootAttrs: { id: 'root' },
	},
	modules: [
		'@nuxt/eslint',
		'@nuxtjs/sitemap',
		'@nuxtjs/google-fonts',
		'@nuxthub/core',
		'nuxt-auth-utils',
		// 'nuxt-api-shield',
	],
	sitemap: {
		zeroRuntime: true,
		xsl: false,
		exclude: [
			'/auth/success',
			'/auth/error',
		],
	},
	googleFonts: {
		families: {
			'Funnel Display': {
				wght: '300..800',
			},
			'Limelight': true,
		},
		display: 'swap',
		preload: true,
	},
	hub: {
		db: {
			dialect: 'postgresql',
			connection: { url: 'db' in secrets && typeof secrets.db === 'string' ? secrets.db : undefined },
		},
	},
	runtimeConfig: {
		session: {
			password: secrets.secretKey,
			maxAge: 60 * 60 * 24 * 365,
		},
		oauth: secrets.oauth,
		public: {
			authProviders: Object.keys(secrets.oauth),
		},
	},
});