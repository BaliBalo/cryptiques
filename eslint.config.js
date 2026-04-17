import eslint from '@eslint/js';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import eslintPluginVue from 'eslint-plugin-vue';
import typescriptEslint from 'typescript-eslint';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
	{
		extends: [
			eslint.configs.recommended,
			...typescriptEslint.configs.recommended,
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
			'@stylistic/eol-last': 'off',
			'@stylistic/member-delimiter-style': ['error', {
				multiline: { delimiter: 'comma', requireLast: true },
				singleline: { delimiter: 'comma', requireLast: false },
			}],
			'@typescript-eslint/no-unused-vars': 'warn',
		},
	},
	{
		files: ['**/*.vue'],
		extends: [
			...eslintPluginVue.configs['flat/recommended'],
		],
		rules: {
			'vue/multi-word-component-names': 'off',
			'vue/html-indent': ['error', 'tab'],
			'vue/script-indent': ['error', 'tab', { baseIndent: 1 }],
			'@stylistic/indent': 'off',
			'vue/no-multiple-template-root': 'off',
			'vue/max-attributes-per-line': 'off',
			'vue/singleline-html-element-content-newline': 'off',
		},
	},
);
