export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	site: {
		url: 'cryptiques.balibalo.xyz',
		name: 'Cryptiques',
		indexable: true,
	},
	// spaLoadingTemplate: false,
	devtools: { enabled: false },
	app: {
		head: {
			title: 'Cryptiques',
			htmlAttrs: { lang: 'fr' },
			link: [
				{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
				{ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
				{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&family=Limelight&display=block' },
			],
		},
		rootAttrs: { id: 'root' },
	},
	modules: ['@nuxtjs/sitemap'],
	sitemap: {
		zeroRuntime: true,
		xsl: false,
	},
});
