module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    //'standard',
    'prettier',
  ],
  overrides: [],
  /*
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  */
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
  //plugins: ['prettier'],
  rules: {
    'linebreak-style': ['warn', 'windows'],
    /*'prettier/prettier': [
      'warn',
      {
        trailingComma: 'es5',
        singleQuote: true,
        tabWidth: 2,
        semi: false,
        endOfLine: 'crlf',
      },
    ],
    */
  },
}
