export default {
	apps: [
		{
			name: 'cryptiques',
			port: '28119',
			exec_mode: 'cluster',
			instances: 'max',
			script: './.output/server/index.mjs',
		},
	],
};