export const apps = [
	{
		name: 'cryptiques',
		port: '28119',
		exec_mode: 'cluster',
		instances: 'max',
		script: './.prod/server/index.mjs',
	},
];
