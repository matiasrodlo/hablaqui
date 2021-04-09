module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
	parserOptions: {
		parser: 'babel-eslint',
	},
	rules: {
		// Rules for prettier
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
				printWidth: 100,
				useTabs: true,
				tabWidth: 4,
				semi: true,
				bracketSpacing: true,
				arrowParens: 'avoid',
				trailingComma: 'es5',
			},
		],
		// Insert the property you want to deactivate here
		'vue/require-default-prop': 'off',
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
	},
	overrides: [
		{
			files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
			env: {
				jest: true,
			},
		},
	],
};
