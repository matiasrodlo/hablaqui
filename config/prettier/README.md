# Prettier Configuration

This directory contains the Prettier configuration for the project. Prettier is a code formatter that enforces consistent code style across the codebase.

## Configuration File

The `.prettierrc` file contains the following settings:

### Line Length Configuration
- `printWidth`: 100 - Maximum line length before wrapping
- `tabWidth`: 2 - Number of spaces per indentation level
- `useTabs`: false - Use spaces instead of tabs

### Code Style Configuration
- `semi`: true - Add semicolons at the end of statements
- `singleQuote`: true - Use single quotes instead of double quotes
- `trailingComma`: "es5" - Add trailing commas where valid in ES5
- `bracketSpacing`: true - Add spaces between brackets in object literals
- `arrowParens`: "avoid" - Omit parentheses around single arrow function parameters
- `endOfLine`: "crlf" - Use CRLF line endings

## Usage

To format your code according to these rules:

1. Install Prettier:
```bash
npm install --save-dev prettier
```

2. Format files:
```bash
npx prettier --write .
```

3. Check formatting without making changes:
```bash
npx prettier --check .
```

## Integration with ESLint

This configuration works in conjunction with the ESLint configuration to ensure both code quality and consistent formatting. The ESLint configuration includes the Prettier plugin to avoid conflicts between ESLint and Prettier rules.

## Best Practices

1. Always run Prettier before committing code
2. Configure your editor to format on save using these settings
3. Use the same configuration across all team members
4. Consider using pre-commit hooks to enforce formatting 