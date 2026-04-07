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
		buildAssetsDir: '/build/',
		head: {
			title: 'Cryptiques',
			htmlAttrs: { lang: 'fr' },
		},
		rootAttrs: { id: 'root' },
	},
	modules: ['@nuxtjs/sitemap', '@nuxtjs/google-fonts'],
	sitemap: {
		zeroRuntime: true,
		xsl: false,
	},
	googleFonts: {
		families: {
			'Funnel Display': {
				wght: '300..800',
			},
			Limelight: true,
		},
		// display: 'block',
		preload: true,
	},
});