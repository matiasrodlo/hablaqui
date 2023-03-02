module.exports = {
  env: {
    node: true,
    // es2021: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'standard',
    'prettier',
  ],
  // overrides: [],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
  // parserOptions: {
  //  sourceType: 'module',
  //  ecmaVersion: 6
  // },
  plugins: ['vue'],
  rules: {
    'linebreak-style': ['warn', 'windows'],
    'vue/multi-word-component-names': 'off',
    'vue/no-v-for-template-key-on-child': 'off',
    'vue/no-reserved-component-names': 'off',
    'vue/valid-v-slot': 'off',
    'vue/no-v-text-v-html-on-component': 'off',
    'vue/no-deprecated-v-bind-sync': 'off',
  },
}
