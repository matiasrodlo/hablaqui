// ESLint configuration file
// This file defines the code style and linting rules for the project

module.exports = {
  // Root configuration
  root: true,  // Stop ESLint from looking for config files in parent folders

  // Environment configuration
  env: {
    node: true,     // Enable Node.js global variables
    browser: true,  // Enable browser global variables
    es2021: true    // Enable ES2021 features
  },

  // Parser configuration
  parser: '@typescript-eslint/parser',  // Use TypeScript parser
  parserOptions: {
    ecmaVersion: 2021,  // Use ECMAScript 2021
    sourceType: 'module',  // Use ES modules
    ecmaFeatures: {
      jsx: true  // Enable JSX
    }
  },

  // Plugin configuration
  plugins: [
    '@typescript-eslint',  // TypeScript ESLint plugin
    'react',              // React ESLint plugin
    'react-hooks',        // React Hooks ESLint plugin
    'prettier'            // Prettier ESLint plugin
  ],

  // Extend existing configurations
  extends: [
    'eslint:recommended',                // ESLint recommended rules
    'plugin:@typescript-eslint/recommended',  // TypeScript recommended rules
    'plugin:react/recommended',          // React recommended rules
    'plugin:react-hooks/recommended',    // React Hooks recommended rules
    'prettier'                           // Prettier configuration
  ],

  // Custom rules
  rules: {
    // TypeScript rules
    '@typescript-eslint/explicit-module-boundary-types': 'off',  // Allow implicit return types
    '@typescript-eslint/no-explicit-any': 'warn',               // Warn on any type usage
    '@typescript-eslint/no-unused-vars': ['error', {            // Error on unused variables
      argsIgnorePattern: '^_',                                  // Ignore parameters starting with _
      varsIgnorePattern: '^_'                                   // Ignore variables starting with _
    }],

    // React rules
    'react/react-in-jsx-scope': 'off',     // No need to import React in JSX files
    'react/prop-types': 'off',             // Disable prop-types validation
    'react/display-name': 'off',           // Disable display name requirement

    // General rules
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',  // Warn on console in production
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off' // Error on debugger in production
  },

  // Settings
  settings: {
    react: {
      version: 'detect'  // Automatically detect React version
    }
  }
}
