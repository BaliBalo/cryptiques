import eslint from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import eslintPluginVue from 'eslint-plugin-vue';
import typescriptEslint from 'typescript-eslint';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
	{
		files: ['**/*.vue'],
		extends: [
			eslint.configs.recommended,
			...typescriptEslint.configs.recommended,
			...eslintPluginVue.configs['flat/recommended'],
		],
		languageOptions: {
			parserOptions: {
				parser: typescriptEslint.parser,
			},
			globals: { ...globals.browser },
		},
		rules: {
			'vue/multi-word-component-names': 'off',
			'vue/html-indent': ['error', 'tab'],
			'vue/script-indent': ['error', 'tab', { baseIndent: 1 }],
			'vue/no-multiple-template-root': 'off',
			'vue/max-attributes-per-line': 'off',
			'vue/singleline-html-element-content-newline': 'off',
		},
	},
	{
		files: ['**/*.{ts,tsx,js,jsx}'],
		extends: [
			eslint.configs.recommended,
			...typescriptEslint.configs.recommended,
			...eslintPluginVue.configs['flat/recommended'],
			stylistic.configs.customize({
				indent: 'tab',
				semi: true,
				braceStyle: '1tbs',
			}),
		],
		languageOptions: {
			parserOptions: {
				parser: typescriptEslint.parser,
			},
			globals: { ...globals.browser },
		},
		rules: {
			'@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
		},
	},
);
